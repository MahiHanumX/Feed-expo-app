import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
