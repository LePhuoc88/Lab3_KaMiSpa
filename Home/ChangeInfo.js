import React, { useState, useEffect} from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EditService = ({ route, navigation }) => {
  const currentUser = auth().currentUser;
  const userEmail = currentUser ? currentUser.email : null;
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(userEmail).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setAddress(userData.address);
          setAge(userData.age.toString());
        }
      } catch (error) {
       
      }
    }
      fetchUserDetails()
    },[userEmail])
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const documentSnapshot = await firestore().collection('users').doc(userEmail).get();

      if (documentSnapshot.exists) {
        await firestore().collection('users').doc(userEmail).update({
          address: address,
          age: age,
        });
        navigation.goBack();
      } else {
        setError('Document does not exist.');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      setError('Error updating user information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ justifyContent: 'center', margin: 10, borderRadius: 20 }}>
      <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Age * </Text>
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="Input age"
        value={age}
        keyboardType="numeric"
        underlineColor='transparent'
        onChangeText={age => setAge(age)}
      />

      <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Address * </Text>
      <TextInput
        style={{ margin: 10, borderRadius: 10 }}
        label="Input address"
        value={address}
        underlineColor='transparent'
        onChangeText={address => setAddress(address)}
      />

      {loading ? (
        <ActivityIndicator style={{ margin: 20 }} size="large" color="red" />
      ) : (
        <View style={{ justifyContent: 'center', padding: 10 }}>
          <Pressable
            onPress={handleUpdate}
            style={{
              backgroundColor: "red",
              alignItems: 'center',
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Update</Text>
          </Pressable>
        </View>
      )}

      {error && (
        <View style={{ justifyContent: 'center', padding: 10 }}>
          <Text style={{ color: 'red', fontSize: 15 }}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default EditService;
