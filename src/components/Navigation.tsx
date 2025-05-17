import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Home from '../screens/Home';
import AdicionarTarefa from '../screens/AdicionarTarefa';


export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined; 
  AdicionarTarefa: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Cadastro" 
          component={Cadastro} 
          options={{ 
            headerShown: false,
            headerTitle: '', 
          }} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ 
            headerShown: false,
            headerTitle: '', 
          }} 
        />
        <Stack.Screen 
          name="AdicionarTarefa" 
          component={AdicionarTarefa} 
          options={{ 
            headerShown: false,
            headerTitle: '', 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
