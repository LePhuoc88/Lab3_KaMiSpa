import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, Pressable, Modal, TouchableHighlight, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from '@react-native-firebase/firestore';
import { UserProvider, UserContext } from '../context/UseContext';
const DetailService = ({ route, navigation }) => {
  const { serviceName, price, imageUrl } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const { userInfo } = useContext(UserContext);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateChange = date => {
    hideDatePicker();
    if (date && date >= new Date()) {
      setSelectedDate(date);
    } else {
      Alert.alert("", "Invalid Date");
    }
  };

  const OrderService = () => {
    setShowOrderModal(true);
  };

  const handleOrderConfirm = async () => {
    try {
      await firestore().collection('orders').add({
        serviceName,
        price,
        selectedDate: selectedDate.toISOString(),
        phoneNumber,
        customerName,
        status: 'pending',
        email: userInfo.email
      });
      Alert.alert("Success", `Order Successfully ${serviceName}`);
      // setPhoneNumber('');
      // setCustomerName('');
      // setSelectedDate(new Date());
      // setShowOrderModal(false);
        navigation.navigate("Orders")
    } catch (error) {
      // console.error('Error adding order to Firestore:', error);
      // Alert.alert("Error", "Failed to place the order. Please try again.");
    }
  };

  return (
    <View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginBottom: 10 }}>Service Name: {serviceName}</Text>
        <Text style={{ fontSize: 16, color: 'black' }}>Price: {price} VNĐ</Text>
      </View>

    
  <Image
    source={{ uri: imageUrl }}
    style={{ width: "400", height: 200, borderRadius: 10, margin: 10 }}
  />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date()}
        onConfirm={handleDateChange}
        onCancel={hideDatePicker}
      />
      {userInfo.role !== 'admin' ? (<TouchableHighlight
        onPress={OrderService}
        style={{
          backgroundColor: "red",
          alignItems: 'center',
          padding: 15,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Order Now</Text>
      </TouchableHighlight>) : null}
      {showOrderModal && (
        <Modal

          animationType="slide"
          transparent={true}
          visible={showOrderModal}
          onRequestClose={() => {
            setShowOrderModal(false);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff', fontWeight: 'bold' }}>
            <Text style={{ color: 'red', fontSize: 20, alignSelf: 'center' }}>CONFIRM ORDER !</Text>
            <TouchableHighlight
              onPress={showDatePicker}
              style={{
                backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333',

                padding: 15,
                borderRadius: 10,
                margin: 10,
              }}
            >
              <Text style={{ color: '#333', fontSize: 18, }}>Please selected date !</Text>
            </TouchableHighlight>
            <View>
              <Text style={{ fontSize: 16, marginBottom: 10, marginLeft: 10 }}>Selected Date: {selectedDate.toDateString()}</Text>
              <TextInput
                style={{ margin: 10, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333', borderRadius: 10 }}
                underlineColor='transparent'
                placeholder="Phone Number"
                keyboardType="phone-pad"
                onChangeText={text => setPhoneNumber(text)}
                value={phoneNumber}
              />
              <TextInput
                style={{ margin: 10, borderRadius: 10, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333' }}
                placeholder="Customer Name"
                underlineColor='transparent'
                onChangeText={text => setCustomerName(text)}
                value={customerName}
              />
            </View>
            <TouchableHighlight
              onPress={handleOrderConfirm}
              style={{
                backgroundColor: "green",
                alignItems: 'center',
                padding: 15,
                borderRadius: 10,
                margin: 10,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Confirm Order</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DetailService;
