import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrdersDetails = ({ navigation, route }) => {
  const {
    serviceName,
    price,
    selectedDate, 
    phoneNumber,
    customerName,
    email
  } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service Name: {serviceName}</Text>
      <Text style={styles.label}>Price: {price}</Text>
      <Text style={styles.label}>
        Selected Date: {new Date(selectedDate).toDateString()}
      </Text>
      <Text style={styles.label}>Phone Number: {phoneNumber}</Text>
      <Text style={styles.label}>Customer Name: {customerName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default OrdersDetails;
