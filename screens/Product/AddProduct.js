import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Block, Text } from './../../components';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';

import { COLORS, FONTS, SIZES, icons } from './../../constants';
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AddProduct = () => {
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraRollStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
          alert('Sorry,  we need these permissions to make this work!');
        }
      }
    })();
  }, []);

  const handleSaveAddProduct = async () => {
    try {
    } catch (e) {
      console.log('error', e);
    }
  };

  function renderHeader() {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          backgroundColor: COLORS.white,
          marginBottom: SIZES.padding,
          borderBottomColor: COLORS.gray,
          borderBottomWidth: 1,
        }}
      >
        <View style={{ paddingVertical: SIZES.padding / 2 }}>
          <Text style={{ color: COLORS.primary, ...FONTS.h2 }}>Bomoko Cash</Text>
          <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}>(Produits et Services)</Text>
        </View>
      </View>
    );
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    //try{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      //mediaTypes: ImagePicker.MediaTypeOptions.All,

      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      const uri = result.uri;
      // const type = result.type;
      // const name = `${Math.floor(Math.random() * 900) + 100}_${Date.now()}`;
      // let base64Img = `data:image/jpg;base64,${result.base64}`;

      // const source = {
      //   uri,
      //   type,
      //   name,
      //   base64Img,
      // };
      let imgCb2V2 = [...images];
      imgCb2V2.push(uri);
      setImages([...imgCb2V2]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'Images',
      aspect: [4, 3],
      base64: true,
    });

    if (!result.cancelled) {
      const uri = result.uri;
      // const type = result.type;
      // const name = `${Math.floor(Math.random() * 900) + 100}_${Date.now()}`;
      // let base64Img = `data:image/jpg;base64,${result.base64}`;

      // const source = {
      //   uri,
      //   type,
      //   name,
      //   base64Img,
      // };

      let imgCb2V2 = [...images];
      imgCb2V2.push(uri);
      setImages([...imgCb2V2]);
    }
  };

  const removePic = (id) => {
    var removed = images.filter((value) => value !== id);
    setImages(removed);

    var removedV2 = images.filter((value) => value !== id);
    setImages(removedV2);
  };

  const info = () =>
    Alert.alert(`Warning`, `You can't upload more than 3 pictures!`, [
      {
        text: 'Okay',
        style: 'cancel',
      },
    ]);

  const addAddProduct = () => {
    return (
      <>
        <View style={styles.dropdownContainer}></View>
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={2}
          required
        />
        <TextInput
          label="Montant"
          value={total}
          onChangeText={setTotal}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          required
        />
        <Button
          elevated
          mode="contained"
          onPress={handleSaveAddProduct}
          style={styles.button}
          icon={({ size, color }) => (
            <Ionicons name="save-outline" size={20} color={COLORS.white} />
          )}
        >
          Ajouter
        </Button>
      </>
    );
  };

  const renderImage = () => {
    return (
      <Block flex={1}>
        <Block row space="between">
          <TouchableOpacity
            style={styles.btn}
            onPress={() => (images.length >= 3 ? info() : pickImage())}
          >
            <Ionicons name="cloud-upload" size={30} color={COLORS.white} style={styles.icon} />
            {/* {loadPic?
              <ActivityIndicator size="small" color={Colors.danger} />: <></>} */}
            <Text style={{ color: COLORS.white }}>Téléverser</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => (images.length >= 3 ? info() : takePhoto())}
          >
            <Ionicons name="camera" size={30} color={COLORS.white} style={styles.icon} />
            {/* {loadPic?
              <ActivityIndicator size="small" color={Colors.danger} />: <></>} */}
            <Text style={{ color: COLORS.white }}>Capture une photo</Text>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header section */}
        {renderHeader()}

        {renderImage()}

        <Block flex={1}>
          <Block style={styles.imgContainer}>
            {images.map((img, key) => (
              <Block key={key}>
                <Ionicons
                  color={COLORS.red}
                  size={SIZES.base * 2}
                  name={'close-circle'}
                  style={styles.cancel}
                  onPress={() => removePic(img)}
                />
                <Block style={styles.bg}>
                  <Image source={{ uri: img }} style={styles.img} />
                </Block>
              </Block>
            ))}
          </Block>
        </Block>

        {addAddProduct()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  icon: {
    marginHorizontal: 5,
  },
  scrollContainer: {
    //flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  button: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: SIZES.padding,
  },
  hasErrors: {
    borderBottomColor: COLORS.purple,
  },
  logo: {
    height: 50,
    width: 50,
    marginBottom: 20,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mt: {
    marginTop: 35,
  },
  center: {
    margin: 35,
  },
  dropdownContainer: {
    borderWidth: 1.4,
    borderColor: '#aaa',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    padding: 8,
  },
  imgContainer: {
    marginVertical: SIZES.base,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  img: {
    width: SIZES.width / 4,
    height: SIZES.width / 4,
    borderRadius: SIZES.radius,
    opacity: 0.8,
    borderColor: COLORS.black,
    borderWidth: 3,
  },
  bg: {
    borderRadius: SIZES.radius,
    marginRight: SIZES.base * 1.7,
  },
  btn: {
    backgroundColor: COLORS.peach,
    padding: SIZES.base,
    width: SIZES.width / 2.5,
    borderRadius: SIZES.radius,
    elevation: 2,
    marginTop: SIZES.base * 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    ///height: SIZES.base * 7,
  },
  cancel: {
    position: 'absolute',
    zIndex: 100,
    padding: 10,
    elevation: 2,
  },
});

export default AddProduct;