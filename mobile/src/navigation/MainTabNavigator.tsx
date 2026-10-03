import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { ChatList } from '../screens/ChatList';
import { Search } from '../screens/Search';
import { NewChat } from '../screens/NewChat';
import { CreateContact } from '../screens/CreateContact';
import { Contacts } from '../screens/Contacts';
import { Conversation } from '../screens/Conversation';
import { Profile } from '../screens/Profile';
import { UserProfile } from '../screens/UserProfile';
import { NearbyUsers } from '../screens/NearbyUsers';
import { MediaGallery } from '../screens/MediaGallery';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="NewChat" component={NewChat} />
      <Stack.Screen name="CreateContact" component={CreateContact} />
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="NearbyUsers" component={NearbyUsers} />
      <Stack.Screen name="MediaGallery" component={MediaGallery} />
    </Stack.Navigator>
  );
};
