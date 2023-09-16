import React, { useState } from 'react';
import {ImageBackground, View, TouchableOpacity, StyleSheet, ScrollView, Image, ToastAndroid } from 'react-native';
import Block from '../Product/Block';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../../components';
import {  Provider, Menu, Button, IconButton } from 'react-native-paper';
import {  BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { fr as myFr } from 'date-fns/locale';



const DetailsReunion = ({ route, navigation }) => {
  
  // Fonction pour convertir la date en format français
  const formatDateToFrench = (date) => {
    console.log('date', date);
    return format(new Date(date), 'dd MMMM yyyy', { locale: myFr });
  };

  const renderImage = () => {
    return (
      <ImageBackground
        source={require('./../../assets/img/meeting.png')}
        resizeMode="cover"
        style={{ width: SIZES.width, height: 120, justifyContent: 'flex-end' }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 120,
          }}
        ></LinearGradient>
      </ImageBackground>
    );
  };


  const renderTopDetails = () => {
    return (
      <Block card style={styles.topdetails} >
        
        <Block row center space='between'>
          <Block>
          <Text h2  bold >REUNION</Text>
          <Text color={COLORS.peach} >Du {formatDateToFrench(route.params.reunion.dateStart)}</Text>
          </Block>
          <Button mode='contained'>Menu</Button>
        </Block>

        <Block center m_t={20} m_b={20} >
            <Text bold h1>0 USD</Text>
            <Text >Total de l’épargne</Text>
        </Block>
     
        

      </Block>
    );
  };



  return (
    <Provider>
      <BottomSheetModalProvider>

      <ScrollView>
    <Block>
      {/* Fixed content */}
      <View>
        {renderImage()}
      </View>

      {/* Scrollable content */}
      <View style={{ alignItems: "center" }}>
        {renderTopDetails()}
      </View>
      <Block row space="between" center>
        <TouchableOpacity style={{ width: '40%', margin:'5%'}} onPress={()=> console.log('ok')}>
          <Block card  style={{ alignItems: 'center',  padding:10}}>
        <IconButton
          icon="arrow-up"
          iconColor={COLORS.darkgreen}
          size={30}
        />
          <Text bold>Achat des parts</Text>
          <Text>Une part a 5 USD</Text>
          </Block>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '40%', margin:'5%' }} onPress={()=> console.log('ok')}>
          <Block card style={{ alignItems: 'center',  padding:10}}>
          <IconButton
            icon="arrow-down"
            iconColor={COLORS.peach}
            size={30}
          />
          <Text bold>Achat des parts</Text>
          <Text>Une part a 5 USD</Text>
          </Block>
        </TouchableOpacity>
      </Block>

      <Block row >
        
      </Block>
      </Block>

      
          </ScrollView>
          </BottomSheetModalProvider>
        
        </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    //padding: 20,
    margin:20
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  topdetails:{
    width: '90%',
    marginTop:-20,
    padding:15,
    elevation:2,
  },
  containerTop: {
    flexDirection: 'row', // Horizontal layout
    justifyContent:"space-evenly",
    marginBottom:20
  },
  column: {
    flex: 1, // Equal width for each column
    paddingVertical: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 12
  },
  content: {
    fontSize: 13,
    color:'grey'
  },
  titleMenu:{
    color: COLORS.gray,
    paddingBottom:10
  },

  containerTitle: {
    flexDirection: 'row',
    marginBottom:10
  },
  columnTitle1: {
    flex: 2, // Takes 50% width
    marginRight: 8, // Adjust the margin as needed
    paddingVertical:8,
  },
  columnTitle2: {
    flex: 1, // Takes 50% width
    marginLeft: 4, // Adjust the margin as needed
    paddingVertical:8,
  },
  titleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentTitle: {
    fontSize: 13,
    color: COLORS.peach
  },
  imgs: {
    flexDirection: 'row',
    marginVertical:10,
    // alignContent:'center',
    //alignItems: 'flex-end'
    // alignSelf:'flex-end'
  },
  img: {
    borderRadius: SIZES.base * 3,
    backgroundColor:COLORS.white,
    borderWidth:2,
    borderColor: COLORS.black,
    width: SIZES.base * 5,
    height: SIZES.base * 5,
    //tintColor: COLORS.black,
  },
  columnMembre1: {
    flex: 1, // Takes 50% width
    marginRight: 8, // Adjust the margin as needed
    paddingVertical:8,
    alignItems:'center'
  },
  columnMembre2: {
    flex: 2, // Takes 50% width
    marginLeft: 12, // Adjust the margin as needed
    paddingVertical:8,
    justifyContent:'center',
  },
  moreImagesText: {
    flex:1,
    alignSelf:'center', 
    marginLeft:10
  },
  imgOwner:{
    width: 100,
    height: 100,
    borderRadius:50,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },


});

export default DetailsReunion;
