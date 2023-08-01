import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Button, TextInput, Text, ActivityIndicator, Snackbar, } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";

import LottieView from 'lottie-react-native';
import { COLORS, FONTS } from '../../../constants';
import { signUpUser } from '../../../redux/userSlice';

const { height, width } = Dimensions.get('window');

export const SignUpForm = ({ navigation }) => {
  const dispatch = useDispatch();

  const { error, isLoading, success, userSignUp } = useSelector((state) => state.user);

  const [name, setNom] = useState('');
  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('user');

  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  // Use useEffect or any other method to handle the success state and display the alert
    useEffect(() => {
      console.log("userSignUp", userSignUp);
      if (userSignUp != null) {
        // Alert.alert("Success", "Login successful!");
        navigation.navigate('LoginScreen'); 
      }
      if (error) {
        onToggleSnackBar()
      }
      
    }, [userSignUp, error]);

const handleSignUp = async () => {
  try {
    // Check internet connections
    const netInfo = await NetInfo.fetch();
    // console.log("netInfo.isConnected", netInfo.isConnected);
    if (!netInfo.isConnected) {
      Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
      return;
    }

    // Handle login functionality
    dispatch(signUpUser({
      username:name,
      name,
      password,
      email,
      mobile,
      role
    }))
    //dispatch(loginUser({username:"bvenceslas", password: "1234567890"}))
 
  } catch (error) {
    Alert.alert("Attention", "Error occurred during login.");

    console.error("Error occurred during login:", error);
  }
};


  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('./../../../assets/login1_bg.png')}
        blurRadius={10}
      ></ImageBackground>
      <View style={styles.contentContainer}>
        <LottieView
          style={styles.animation}
          source={require('../../../assets/json/animation_lks5mkix.json')}
          autoPlay
          loop
        />
        <TextInput error={error} keyboardType="default" label="Nom d'utilisateur" value={name} onChangeText={setNom} style={styles.input} />
        <TextInput
          label="Mots de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          error={error}
        />

        <TextInput error={error} keyboardType="default" 
        label="E-mail" value={email} 
        onChangeText={setEmail} style={styles.input} />

      <TextInput error={error} keyboardType="default" 
        label="Téléphone" value={mobile} 
        onChangeText={setMobile} style={styles.input} />

          <ActivityIndicator  animating={isLoading} color={COLORS.red} />

        
        <Button mode="contained" onPress={handleSignUp} style={styles.button}>
          S'enregistrer
        </Button>

        <Text style={{ marginVertical: 20, color: COLORS.white, ...FONTS.h2}} 
      onPress={()=> navigation.goBack()} > Retour</Text>

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: COLORS.peach}}
        action={{
          label: 'Annuler',
          onPress: () => {
            // Do something
          },
        }}
        >
        {error}
        
      </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    height,
    width,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 300,
    height: 300,
  },
  input: {
    width: '70%',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    padding:10,
    width: '70%',
  },
});
