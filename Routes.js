import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { useFonts } from 'expo-font';
import { useDispatch, useSelector } from 'react-redux';
import InitialLoader from './screens/InitialLoader';
import Onboard from './navigations/Onboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setInstalled } from './redux/appReducer';
import { LoginScreen } from './screens/LoginScreen/LoginScreen';
import { AuthScreen } from './screens/AuthScreen/AuthScreen';
import { resetAllCat } from './redux/catReducer';
import { StatusBar } from 'react-native';
import MyDrawer from './navigations/MyDrawer';
import { Expense, Income } from './screens';
import { COLORS, icons } from './constants';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const income = 'income';
  const expense = 'expense';

  const cat = [
    {
      id: 1,
      name: 'Vente',
      icon: icons.shopping,
      cat: income,
      color: COLORS.purple,
      data: [],
    },
    {
      id: 2,
      name: 'Remboursement',
      icon: icons.refund,
      cat: income,
      color: COLORS.blue,
      data: [],
    },
    {
      id: 3,
      name: 'Intérêt',
      icon: icons.interest,
      cat: income,
      color: COLORS.darkgreen,
      data: [],
    },
    {
      id: 4,
      name: 'Subvention',
      icon: icons.grant,
      cat: income,
      color: COLORS.red,
      data: [],
    },
    {
      id: 5,
      name: 'Investissement',
      icon: icons.investment,
      cat: income,
      color: COLORS.peach,
      data: [],
    },

    {
      id: 6,
      name: 'Achat',
      icon: icons.shopping,
      cat: expense,
      color: COLORS.lightBlue,
      data: [],
    },
    {
      id: 7,
      name: 'Salaire',
      icon: icons.cash,
      cat: expense,
      color: COLORS.peach,
      data: [],
    },
    {
      id: 8,
      name: "Dépenses d'exploitation",
      icon: icons.cashbook,
      cat: expense,
      color: COLORS.darkgreen,
      data: [],
    },
    {
      id: 9,
      name: "Retraits d'argent",
      icon: icons.sell,
      cat: expense,
      color: COLORS.red,
      data: [],
    },
    {
      id: 10,
      name: 'Paiements de dettes',
      icon: icons.income,
      cat: expense,
      color: COLORS.yellow,
      data: [],
    },
    {
      id: 11,
      name: 'Autres entrées',
      icon: icons.more,
      cat: income,
      color: COLORS.gray,
      data: [],
    },

    {
      id: 12,
      name: 'Autres Sorties',
      icon: icons.more,
      cat: expense,
      color: COLORS.purple,
      data: [],
    },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    // AsyncStorage.clear();
    checkInstallationStatus();
    checkCategories();
  }, []);

  const checkInstallationStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isInstalled');
      console.log('value', value);
      if (value !== null && value === 'true') {
        dispatch(setInstalled());
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log('Error retrieving installation status:', error);
      setLoading(false);
    }
  };

  const checkCategories = async () => {
    try {
      const value = await AsyncStorage.getItem('categories');
      console.log('----------', value);

      if (value !== null) {
        //dispatch(addCat(JSON.parse(value)));
        dispatch(resetAllCat(JSON.parse(value)));
      } else {
        // setLoading(false);
        dispatch(resetAllCat([...cat]));
      }
    } catch (error) {
      console.log('Error retrieving categories status:', error);
      setLoading(false);
    }
  };

  const isInstalled = useSelector((state) => state.app.isInstalled);

  const [loaded] = useFonts({
    'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  if (loading) {
    return <InitialLoader />;
  }
  if (isInstalled) {
    return (
      <NavigationContainer theme={theme}>
        <StatusBar barStyle="default"></StatusBar>

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'MyDrawer'}
        >
          <Stack.Screen name="Main" component={MyDrawer} />
          <Stack.Screen name="Income" component={Income} />
          <Stack.Screen name="Expense" component={Expense} />

          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else if (!isInstalled) {
    return <Onboard />;
  }
  return <InitialLoader />;
};

export default App;
