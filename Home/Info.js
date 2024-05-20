import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserProvider, UserContext } from '../context/UseContext';

const Info = ({ route, navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDocument = await firestore()
          .collection('users') 
          .doc(currentUser.uid)
          .get();

        if (userDocument.exists) {
          setUserDetails(userDocument.data());
        } else {
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle the error
        Alert.alert('Error', 'An error occurred while fetching user details.');
      }
    };

    const currentUser = auth().currentUser;
    if (currentUser) {
      fetchUserDetails();
    }
  }, []);

  return (
    <View style={{ padding: 10 }}>
        <View>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
            Email: {userInfo.email}
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
            Address: {userInfo.address}
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
            Age: {userInfo.age}
          </Text>
        </View>
      
    </View>
  );
};

export default Info;
