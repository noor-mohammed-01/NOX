import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Splash } from '../screens/Splash';
import { Welcome } from '../screens/Welcome';
import { Phone } from '../screens/Phone';
import { OTP } from '../screens/OTP';
import { ProfileSetup } from '../screens/ProfileSetup';
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

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Phone" component={Phone} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
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
    </NavigationContainer>
  );
};
