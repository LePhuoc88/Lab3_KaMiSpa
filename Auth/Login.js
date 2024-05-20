import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, Pressable, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';
import { UserContext } from '../context/UseContext';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [showPassword, setShowPassword] = useState(false);
    let { loginUser } = useContext(UserContext);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const HandleLogin = () => {
        if (pass != null || email != null || pass != "" || email != "") {
            loginUser(email, pass);
            setEmail("");
            setPass("");
            navigation.navigate("Home");
        } else {
            Alert.alert("", "Please enter mail or password !");
        }
        
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', margin: 10, borderRadius: 20 }}>
            <Text style={{ color: 'red', fontSize: 25, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 }}>ĐĂNG NHẬP</Text>
            <TextInput
                style={{ ...styles.TextInput, margin: 10, borderRadius: 10 }}
                label="Email"
                value={email}
                underlineColor='transparent'
                onChangeText={email => setEmail(email)}
            />
            <TextInput
                style={{ ...styles.TextInput, margin: 10, borderRadius: 10 }}
                label="Password"
                value={pass}
                underlineColor='transparent'
                onChangeText={pass => setPass(pass)}
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? 'eye' : 'eye-off'} onPress={toggleShowPassword} />}
            />

            <View style={{ justifyContent: 'center', padding: 10 }}>
                <Pressable
                    style={{
                        backgroundColor: "red",
                        alignItems: 'center',
                        padding: 15,
                        borderRadius: 10,

                    }}
                    onPress={HandleLogin}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Sign In</Text>
                </Pressable>
                {/* <Pressable
                    onPress={
                        () => onGoogleButtonPress()
                            .then(() => {
                                navigation.navigate("Home");
                                console.log("User signed in using Google");
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                    style={{
                        backgroundColor: "red",
                        alignItems: 'center',
                        padding: 15,
                        borderRadius: 10,
                        marginTop: 10,

                    }}
                >
                     <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Sign In with Google</Text>
                </Pressable> */}
            </View>
            <View style={{ justifyContent: 'center', padding: 10, paddingTop: 0 }}>
                <Pressable
                    style={{
                        backgroundColor: "red",
                        alignItems: 'center',
                        padding: 15,
                        borderRadius: 10,
                    }}
                    onPress={() => navigation.navigate("SignUp")}>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Sign Up</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    TextInput: {
        width: 350,
        alignSelf: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginBottom: 5,
        backgroundColor: 'white',
    }
})

export default Login;
