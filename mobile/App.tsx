import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ConnectionProvider } from './src/context/ConnectionContext';
import { ContactProvider } from './src/context/ContactContext';
import { ChatProvider } from './src/context/ChatContext';

function App() {
  return (
    <SafeAreaProvider>
      <ConnectionProvider>
        <ContactProvider>
          <ChatProvider>
            <View style={styles.container}>
              <StatusBar barStyle="light-content" />
              <AppNavigator />
            </View>
          </ChatProvider>
        </ContactProvider>
      </ConnectionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});

export default App;
