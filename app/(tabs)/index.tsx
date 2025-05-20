import { View, StyleSheet, Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Home() {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={({ pressed }) => [
          styles.iconContainer,
          pressed && styles.pressed
        ]}
      >
        <AntDesign
          name="pluscircle"
          size={56}
          color={pressed ? '#666' : '#007AFF'}
          style={styles.icon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 40,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8
  },
  icon: {
    
    transform: [{ translateY: -2 }]
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.8
  }
});