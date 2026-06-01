import React from 'react';
import { Image, ImageStyle } from 'react-native';

export { default as Feather } from '@expo/vector-icons/Feather';
export { default as FontAwesome } from '@expo/vector-icons/FontAwesome';
export { default as Ionicons } from '@expo/vector-icons/Ionicons';
export { default as MaterialCommunityIcons } from '@expo/vector-icons/MaterialCommunityIcons';

export const PixIcon: React.FC<{ size?: number; color?: string; style?: ImageStyle }> = ({ size = 24, color = "#000000", style }) => {
  return React.createElement(Image, {
    source: { uri: "https://logospng.org/download/pix/logo-pix-icone-1024.png" },
    style: [{ width: size, height: size, tintColor: color, resizeMode: "contain" }, style]
  });
};
