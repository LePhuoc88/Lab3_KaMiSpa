import React, { useState } from 'react';
import { View, StyleSheet, Alert, Pressable, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passrp, setPassrp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSignUp = async () => {
  if (pass === passrp) {
      try {
        const { user } = await auth().createUserWithEmailAndPassword(email, pass);
        await firestore().collection('users').doc(user.email).set({
          email: user.email,
          age :'0',
          address:'abc',
          role:'user'
        });
        navigation.navigate("Login");

        Alert.alert('Success', 'successfully');
      } catch (error) {
        // console.error('Error creating user: ', error);
        // Alert.alert('Error', 'An error occurred while creating the user');
      }
    } else {
    //   Alert.alert('Error', 'Passwords do not match');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', margin: 10, borderRadius: 20 }}>
      <Text style={{ color: 'red', fontSize: 25, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 }}>ĐĂNG Ký</Text>

      <TextInput 
      style={styles.TextInput}
      label="Email" 
      value={email} 
      onChangeText={(email) => setEmail(email)} 
      underlineColor='transparent'
      />
      <TextInput
       style={styles.TextInput}
        label="Password"
        value={pass}
        onChangeText={(pass) => setPass(pass)}
        secureTextEntry={!showPassword} 
        right={<TextInput.Icon icon={showPassword ? 'eye' : 'eye-off'} onPress={toggleShowPassword}/>}
        underlineColor='transparent'
      />
      <TextInput
       style={styles.TextInput}
        label="Password repeat"
        value={passrp}
        onChangeText={(passrp) => setPassrp(passrp)}
        secureTextEntry={!showPassword} 
        right={<TextInput.Icon icon={showPassword ? 'eye' : 'eye-off'} onPress={toggleShowPassword}/>}
        underlineColor='transparent'
      />
       <View style={{justifyContent: 'center', padding: 10 }}>
                <Pressable 
                style={{backgroundColor: "red", 
                alignItems:'center',
                padding: 15, 
                borderRadius:10, 
        
               }}
            onPress={handleSignUp}>
                  <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>SignUp</Text>
                </Pressable>
            </View>
            <View style={{justifyContent: 'center', padding: 10,paddingTop:0 }}>
                <Pressable 
                style={{backgroundColor: "red", 
                alignItems:'center',
                padding: 15, 
                borderRadius:10, 
            }}
            onPress={()=> navigation.navigate("Login")}>
                   <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>SignIn</Text>
                </Pressable>
                </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TextInput:{
    width: 350,
    alignSelf: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 5,
    backgroundColor: 'white',
  
    // borderWidth: 1,
}
});

export default SignUp;
