
import React from 'react';
import { ImageBackground, Text, View } from 'react-native';

export interface OnboardingContentProps {
  image: any;
  title: string;
  description: string;
  dots?: React.ReactNode;
  skipButton?: React.ReactNode;
}

export const OnboardingContent: React.FC<OnboardingContentProps> = ({
  image,
  title,
  description,
  dots,
  skipButton,
}) => {
  return (
    <ImageBackground
      source={image}
      style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}
      imageStyle={{ resizeMode: 'cover' }}
    >
      {/* Overlay skip button at top right */}
      {skipButton}
      <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 24, padding: 28, marginBottom: 40, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 12, color: '#2196F3' }}>{title}</Text>
        <Text style={{ fontSize: 18, textAlign: 'center', color: '#2196F3', fontWeight: '500', lineHeight: 26 }}>
          {description}
        </Text>
      </View>
      {/* Dots indicator below the card */}
      <View style={{ marginBottom: 40, width: '100%', alignItems: 'center', zIndex: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>{dots}</View>
      </View>
    </ImageBackground>
  );
};


export default OnboardingContent;