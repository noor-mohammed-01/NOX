import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { commonStyles, colors } from '../theme';

export const Splash: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[commonStyles.container, commonStyles.center]}>
      <View style={styles.logo}>
        <View style={styles.logoInner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryDark,
  },
});
