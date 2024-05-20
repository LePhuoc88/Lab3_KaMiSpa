import React, { useEffect, useState, useContext } from 'react';
import { FlatList,Text,View,StyleSheet,Modal,TouchableOpacity,Alert,Pressable,TouchableHighlight} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { UserProvider, UserContext } from '../context/UseContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const { userInfo } = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);

  const fetchData = async () => {
    try {
      if (userInfo.email) {
        const ordersCollection = firestore().collection('orders');
        const ordersSnapshot = userInfo.role === 'admin'
          ? await ordersCollection.get()
          : await ordersCollection.where('email', '==', userInfo.email).get();
  
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } else {
        console.log('User email not available.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };
  const handleDetails = (orderId, serviceName, price, selectedDate, phoneNumber, customerName, email) => {
    navigation.navigate('OrdersDetails', {
      orderId,
      serviceName,
      price,
      selectedDate,
      phoneNumber,
      customerName,
      email
    });
  };

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
      Alert.alert('Invalid Date', 'Please select a future date.');
    }
  };

  const handleEditOrder = orderId => {
    const selectedOrder = orders.find(order => order.id === orderId);
    if (selectedOrder) {
      setPhoneNumber(selectedOrder.phoneNumber);
      setCustomerName(selectedOrder.customerName);
      setSelectedDate(new Date(selectedOrder.selectedDate));
      setEditingOrderId(orderId);
      setShowOrderModal(true);
    } else {
      console.error('Selected order not found.');
    }
  };

  const handleConfirm = async () => {
    try {
      const selectedOrder = orders.find(order => order.id === editingOrderId);

      if (!selectedOrder) {
        console.error('Selected order not found.');
        return;
      }
      await firestore().collection('orders').doc(selectedOrder.id).update({
        selectedDate: selectedDate.toISOString(),
        phoneNumber,
        customerName,
      });

      setPhoneNumber('');
      setCustomerName('');
      setSelectedDate(new Date());
      setShowOrderModal(false);
      fetchData(); 
    } catch (error) {
      // console.error('Error editing order in Firestore:', error);
      // Alert.alert('Error', 'Failed to edit the order. Please try again.');
    }
  };

  const handleDeleteOrder = async orderId => {
    try {
      Alert.alert(
        'Delete Order',
        'Are you sure you want to delete this order?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await firestore().collection('orders').doc(orderId).delete();
              fetchData();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting order:', error.message);
    }
  };
  const handleProcessOrder = async orderId => {
    try {
      Alert.alert(
        'Confirm Process Order',
        'Are you sure you want to mark this order as done?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              await firestore().collection('orders').doc(orderId).update({
                status: 'done',
              });

              console.log('Order Successfully processed:', orderId);
              fetchData(); 
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error processing order in Firestore:', error);
      Alert.alert('Error', 'Failed to process the order. Please try again.');
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              handleDetails(
                item.id,
                item.serviceName,
                item.price,
                item.selectedDate,
                item.phoneNumber,
                item.customerName
              )
            }
            style={{ ...styles.item, marginTop: 10 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text>Tên dịch vụ: {item.serviceName}</Text>
                <Text>Đơn giá: {item.price}</Text>
                <Text>Ngày đặt: {item.selectedDate}</Text>
                <Text>SĐT: {item.phoneNumber}</Text>
                {item.status == 'done'?(<Text style={{color:'white', 
                                                      textAlign:'center',
                                                      fontWeight:'bold', 
                                                      padding: 2,
                                                      backgroundColor:'green',
                                                      borderRadius:10,
                                                      width:80,
                                                      textTransform:'uppercase'
                                                      }}>{item.status}</Text>)
                                                      :
                                                      (<Text style={{color:'white', 
                                                      textAlign:'center',
                                                      fontWeight:'bold', 
                                                      padding: 2,
                                                      backgroundColor:'red',
                                                      borderRadius:10,
                                                      width:80,
                                                      textTransform:'uppercase'
                                                      }}>{item.status}</Text>)}
            
              </View>
       
              <View style={{ justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                  {item.status !== 'done' ? (
                    <Pressable onPress={() => handleEditOrder(item.id)}>
                      <View style={{ backgroundColor: 'orange', padding: 10, borderRadius: 50, marginRight: 10 }}>
                        <Text>
                          <Icon name="edit" size={20} style={{ color: 'white' }} />
                        </Text>
                      </View>
                    </Pressable>
                  ) : null}
                  {item.status !== 'done' && userInfo && userInfo.role !== 'admin' ? (
                    <Pressable onPress={() => handleDeleteOrder(item.id)}>
                      <View style={{ backgroundColor: 'red', padding: 10, borderRadius: 50 }}>
                        <Text>
                          <Icon name="delete" size={20} style={{ color: 'white' }} />
                        </Text>
                      </View>
                    </Pressable>
                  ) : null}

                  {userInfo && userInfo.role === 'admin' && item.status !== 'done' ? (
                    <Pressable onPress={() => handleProcessOrder(item.id)}>
                      <View style={{ backgroundColor: 'green', padding: 10, borderRadius: 50 }}>
                        <Text>
                          <Icon name="done" size={20} style={{ color: 'white' }} />
                        </Text>
                      </View>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date()}
        onConfirm={handleDateChange}
        onCancel={hideDatePicker}
      />

      {showOrderModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showOrderModal}
          onRequestClose={() => {
            setShowOrderModal(false);
          }}
        >
          <View style={{flex:1,justifyContent: 'center', backgroundColor:'#fff', fontWeight:'bold' }}>
          <Text style={{ color: 'red', fontSize: 20, alignSelf:'center' }}>EDIT ORDER</Text>
          <TouchableHighlight
        onPress={showDatePicker}
        style={{
          backgroundColor:'transparent', borderWidth:1, borderColor:'#333',
        
          padding: 15,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: '#333', fontSize: 18,  }}>Please selected date !</Text>
      </TouchableHighlight>
      <Text style={{ fontSize: 16, marginBottom: 10 , marginLeft:10}}>Selected Date: {selectedDate.toDateString()}</Text>
            <TextInput
              style={{ margin: 10, backgroundColor:'transparent', borderWidth:1, borderColor:'#333', borderRadius:10}}
              underlineColor='transparent'
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={text => setPhoneNumber(text)}
              value={phoneNumber}
            />
            <TextInput
             style={{ margin: 10, backgroundColor:'transparent', borderWidth:1, borderColor:'#333', borderRadius:10}}
             underlineColor='transparent'
              placeholder="Customer Name"
              onChangeText={text => setCustomerName(text)}
              value={customerName}
            />
            <TouchableHighlight
              onPress={handleConfirm}
              style={{
                backgroundColor: "green",
                alignItems: 'center',
                padding: 15,
                borderRadius: 10,
                margin: 10,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Confirm Edit</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    flex: 1,
  },
  item: {
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 10,
    justifyContent: 'center',
    margin: 5,
  },
});

export default Orders;
