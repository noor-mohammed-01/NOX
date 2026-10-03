import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Contact } from '../types';
import { mockContacts } from '../mock/data';

export type AddContactResult =
  | { ok: true; contact: Contact }
  | { ok: false; reason: 'duplicate'; existing: Contact }
  | { ok: false; reason: 'invalid' };

type ContactContextType = {
  contacts: Contact[];
  addContact: (name: string, phone: string) => AddContactResult;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

const phoneKey = (phone: string) => phone.replace(/\D/g, '');

export const ContactProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const contactsRef = useRef<Contact[]>(mockContacts);
  const idCounterRef = useRef(0);

  const addContact = useCallback(
    (name: string, phone: string): AddContactResult => {
      const trimmedName = name.trim();
      const key = phoneKey(phone);

      if (trimmedName.length === 0 || key.length === 0) {
        return { ok: false, reason: 'invalid' };
      }

      const existing = contactsRef.current.find(
        (contact) => phoneKey(contact.phone) === key,
      );

      if (existing) {
        return { ok: false, reason: 'duplicate', existing };
      }

      idCounterRef.current += 1;

      const contact: Contact = {
        id: `contact-${Date.now().toString(36)}-${idCounterRef.current}`,
        name: trimmedName,
        phone,
      };

      const next = [...contactsRef.current, contact].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      contactsRef.current = next;
      setContacts(next);

      return { ok: true, contact };
    },
    [],
  );

  const value = useMemo(
    () => ({ contacts, addContact }),
    [contacts, addContact],
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }

  return context;
};
