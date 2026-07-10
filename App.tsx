import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎲 Domino Pro</Text>
      <Text style={styles.subtext}>Working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  subtext: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
});