import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthScreen } from '../screens/AuthScreen/AuthScreen';

const MyStack = createNativeStackNavigator();

const Auth = () => {
  return (
    <NavigationContainer>
      <MyStack.Navigator initialRouteName="IntroScreen" screenOptions={{ headerShown: false }}>
        <MyStack.Screen name="AuthScreen" component={AuthScreen} />
      </MyStack.Navigator>
    </NavigationContainer>
  );
};

export default Auth;
