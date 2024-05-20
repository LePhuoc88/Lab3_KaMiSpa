import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import SignUp from './Auth/SignUp';
import Login from './Auth/Login';
import Home from './Home/Home';
import Router from './Router';
import AddService from './Home/AddService';
import Logout from './Home/Logout';
import Service from './Home/Service';
import { UserProvider } from './context/UseContext';

const Stack = createStackNavigator();

const App = () => {
  const user = async () => {
    const ref = firestore().collection('users');
    const admin = {
      email: 'phuocAd@gmail.com',
      password: '123123',
      role: 'admin',
      address:'Bình Dương',
      age:'22'
    };

    await ref.doc(admin.email).onSnapshot((u) => {
      if (!u.exists) {
        auth()
          .createUserWithEmailAndPassword(admin.email, admin.password)
          .then(() => {
            ref.doc(admin.email).set({
              ...admin,
            });
          });
      }
    });
  };

  useEffect(() => {
    user();
  }, []); 

  return (
    <UserProvider>
    <NavigationContainer independent={true}>
       <Router/>
    </NavigationContainer>
    </UserProvider>
  
  );
};

export default App;
