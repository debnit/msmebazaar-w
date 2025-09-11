
import React from 'react';
import { TouchableOpacity, Linking, Alert } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

const WhatsAppButton = () => {
    const phoneNumber = "8260895728";
    const message = "Hello! I'm interested in your services.";
  
    const handlePress = () => {
      const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Make sure WhatsApp is installed on your device');
      });
    };
  
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="absolute bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg"
        style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }}
      >
        <MessageCircle size={28} color="#ffffff" />
      </TouchableOpacity>
    );
  };
  
  export default WhatsAppButton;
