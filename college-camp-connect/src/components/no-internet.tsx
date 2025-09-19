// components/NoInternet.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NoInternet() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚫 No Internet Connection</Text>
      <Text style={styles.subtext}>Please check your network settings.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    color: 'gray',
  },
});
