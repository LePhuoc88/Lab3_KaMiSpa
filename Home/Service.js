import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Pressable, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-virtualized-view'
import { UserProvider, UserContext } from '../context/UseContext';
import { Image } from 'react-native';

const Service = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const { userInfo } = useContext(UserContext);
    const [filterServices, setfilterServices] = useState([]);



    useEffect(() => {
        const unsubscribe = firestore().collection('services').onSnapshot((snapshot) => {
            const servicesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setServices(servicesData);
            setfilterServices(servicesData);
        });

        return () => unsubscribe();
    }, []);

    const handleDetails = (service) => {
        navigation.navigate('DetailsService', {
            serviceName: service.serviceName,
            price: service.price,
            imageUrl: service.imageUrl
        });
    };

    const handleEdit = (service) => {
        navigation.navigate('EditService', { id: service.id });
    };

    const handleDelete = async (service) => {
        try {
            Alert.alert(
                '',
                'Are you sure?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        onPress: async () => {
                            await firestore().collection('services').doc(service.id).delete();
                        },
                        style: 'destructive',
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Error deleting service: ', error);
            Alert.alert('Error', 'An error occurred while deleting the service');
        }
    };

    const handleSearch = (query) => {
        const filterData = services.filter((service) =>
            service.serviceName.toLowerCase().includes(query.toLowerCase())
        );
        setfilterServices(filterData);
    };


    return (
        <View style={{backgroundColor:'#fff'}}>
            <View style={{ width: "95%", alignItems: 'center', alignSelf: 'center', margin: 10 }}>
                <Searchbar
                    style={{
                        ...styles.item,
                        padding: 2,
                        backgroundColor: 'transparent',
                        margin: 0,
                        height: 60,
                        justifyContent: 'center',
                    }}
                    placeholder="Tìm kiếm ... "
                    onChangeText={handleSearch}
                />
            </View>
            <View  >
                <Image source = {require('../asset/logolab3.png')}
                style={{
                    alignSelf: 'center',
                    margin: 5
                }}/>
            </View>
            <View style={styles.container}>

                <View>

                    <Text style={{ fontWeight: '600', color: 'black',fontSize: 18 }}>Danh sách dịch vụ</Text>

                </View>

                {userInfo && userInfo.role === 'admin' ? (
                    <TouchableOpacity onPress={() => navigation.navigate('AddService')}>
                        <Text>
                            <Icon name="add-circle" size={45} style={{ color: 'red' }} />
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            <ScrollView>
                <FlatList
                    style={{ marginBottom: 150 }}
                    data={filterServices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', margin: 5 }}>
                            <View style={styles.item}>
                                <TouchableOpacity onPress={() => handleDetails(item)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', marginBottom: 4 }}>{item.serviceName}</Text>
                                            <Text style={{ fontSize: 14, color: 'black' }}>{item.price + " VNĐ"}</Text>
                                        </View>
                                        {userInfo && userInfo.role === 'admin' && (
                                            <View style={{ flexDirection: 'row' }}>
                                                <Pressable onPress={() => handleEdit(item)}>
                                                    <View style={{ backgroundColor: 'green', padding: 10, borderRadius: 50, marginRight: 10 }}>
                                                        <Text>
                                                            <Icon name="edit" size={20} style={{ color: 'white' }} />
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                                <Pressable onPress={() => handleDelete(item)}>
                                                    <View style={{ backgroundColor: 'red', padding: 10, borderRadius: 50 }}>
                                                        <Text>
                                                            <Icon name="delete" size={20} style={{ color: 'white' }} />
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center'
    },
    item: {
        width: '100%',
        borderWidth: 2,
        padding: 10,
        height: 80,
        borderColor: 'pink',
        borderRadius: 10,
        justifyContent: 'center'
    }
});

export default Service;
