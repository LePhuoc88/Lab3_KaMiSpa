import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';
import { Home } from '../Home/Home';
import Service from './Service';
import AddService from './AddService';
import Logout from './Logout';
import Setting from './Setting';
import Orders from './Orders';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Tab = createBottomTabNavigator();


const getTabBarIcon = icon => ({ tintColor }) => (
  <Icon name={icon} size={26} style={{ color: "black" }} />
);

const MyTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName='Service'
      barStyle={{ backgroundColor: "red" }}
      labeled={false}
      activeTintColor={{ color: "red" }}
      inactiveColor={{ color: "red" }}
    >
      <Tab.Screen
        name="Service"
        component={Service}
        options={{
          tabBarIcon: getTabBarIcon('house'),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: getTabBarIcon('attach-money'),
        }}
      />
      <Tab.Screen
        name="Customer"
        component={Logout}
        options={{
          tabBarIcon: getTabBarIcon('supervised-user-circle'),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: getTabBarIcon('settings'),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
