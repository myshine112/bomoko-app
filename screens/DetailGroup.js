import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  ScrollView,
  NetInfo,
  AsyncStorage,
  Alert,
  Image,
  ActivityIndicator,
  View
} from 'react-native';
import { Block, Text, Button as GaButton, theme, Checkbox } from 'galio-framework';

import { Button, Icon, Input, ListCLient } from '../components';

import { Images, nowTheme } from '../constants';

import { HeaderHeight } from '../constants/utils';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 4;




const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class DetailGroup extends React.Component {
  constructor(props) {
    super(props);
    //this._bootstrapAsync();
    this.state = {
      st : "",
      group:[],
      isLoading: true,
      clients:[],

      isRefreshing: false,
    };
    //ToastAndroid.show( JSON.stringify(this.props.navigation.getParam("product")), ToastAndroid.SHORT)
    //this.setState({group: JSON.parse(this.props.navigation.getParam("product"))})

  }
  componentDidMount(){
    this._bootstrapAsync();
    this._bootstrapAsyncClient()
  }

  _bootstrapAsyncClient = async () => {
  
    dataClients = [];
    dataClients002 = [];
    const GroupsLocalStorage = await AsyncStorage.getItem('ClientsLocalStorage')
    .then(async (value) => {
      //console.log("************************Get Value >> ", JSON.parse(value));
      dataClients = await JSON.parse(value);
      //dataClients002 = await dataClients.filter((item) => (item.type == 102));
      //ToastAndroid.show(JSON.stringify(dataClients)+"vo", ToastAndroid.LONG)
  
      this.setState({
        isLoading:  false,
        clients: await dataClients,
      });
   
      console.log(dataClients)
  
     //console.log("*********************Put Value >> ", dataClients);
   }).done();
  };

  _bootstrapAsync = async () => {
 
    prod = await JSON.parse(this.props.navigation.getParam("product"))
    this.setState({
      group: await prod,
      isLoading:  false,
    });

  };

  async _devenir_mbr_group(){
    this.setState({isloading: true})
     //var nom_ = this.state.nom
     var phone_ = this.state.phone
     var nom_ = this.state.nom
     var address_ = this.state.address
     var sexe_ = this.state.sexe
     var password = this.state.password
     var conf_password = this.state.conf_password

    await fetch('http://192.168.56.1:3000/register_client', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        nom: nom_,
        phone: phone_,
        id_g: "",
        num_carte_elec: "",
        address: address_,
        sexe: sexe_,
        profession: "",
        code_conf_sms: "",
        password:conf_password           
      })
    }).then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
        //Success 
        //ToastAndroid.show(JSON.stringify(responseJson["code_conf_sms"]), ToastAndroid.SHORT)
        // TODO Save local variables
        AsyncStorage.setItem('currentAccount', JSON.stringify(responseJson))
        .then(json => ToastAndroid.show('currentAcount save locally', ToastAndroid.SHORT))
        .catch(error => ToastAndroid.show('currentAcount error local memory', ToastAndroid.SHORT));
        this.setState({isloading: false})
        // TODO send code sms  send_sms_from_rmlconnect
        fetch('http://192.168.56.1:3000/send_sms_from_rmlconnect', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            msg_detail:"Bonjour "+nom_+", validez votre compte. Votre code est:",
	          msg_code:JSON.stringify(responseJson["code_conf_sms"]),
	          phone:phone_
              
          })
        }).then((response1) => response1.json())
        //If response is in json then in success
        .then((responseJson1) => {
          //ToastAndroid.show('codeeeeeeeeeeee '+ JSON.stringify(responseJson1), ToastAndroid.LONG)
            
        }) //If response is not in json then in error
        .catch((error1) => {
          this.setState({isloading: false})
            //Error 
          console.error(error1);
          ToastAndroid.show('Une erreur est surnenue '+ error1, ToastAndroid.LONG)
        });
        // TODO open waitValidAccout screen
          this.props.navigation.navigate("WaitValidAccount");

    }) //If response is not in json then in error
    .catch((error) => {
        //Error 
        //alert(JSON.stringify(error));
        console.error(error);
        this.setState({isloading: false})
        ToastAndroid.show('Une erreur est surnenue '+ error, ToastAndroid.LONG)
    });
  }

  _adhesion(id,group,somme, nbr_jour, cat){
    Alert.alert("Attention!",'Voulez vous vraiment adherer dans le groupe :'+group+"? Vous aurez droit a un credit maximum de "+somme+" $ a remetre progressivement dans "+nbr_jour+" "+cat+".",
      [
       
        {text: 'Annuler', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Valider', onPress: () => 
          {
            NetInfo.isConnected.fetch().then(isConnected => {
              if(isConnected)
              {
                console.log('OK Pressed')
                //this.checkCreditExistFromAPI(id, name)
                ToastAndroid.show(id, ToastAndroid.SHORT)


              }
              else{
                ToastAndroid.show("Aucune connexion internet disponible", ToastAndroid.SHORT)
               
                
              }
            });

          }
        },
      ]);
  }

  render() {
    const { navigation } = this.props;
    const {
      st,
      group
    } = this.state;
    //ToastAndroid.show( JSON.parse(navigation.getParam("product")), ToastAndroid.SHORT)
    //ToastAndroid.show( JSON.stringify(navigation.getParam("product")), ToastAndroid.SHORT)
    if(this.state.isLoading){
      return( 
        <Block style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" /> 
        </Block>
      )
    }
    

    return (
      <DismissKeyboard>
        <Block flex middle>
          <ImageBackground
            source={Images.RegisterBackground}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
            <Block flex middle>
              <Block style={styles.registerContainer}>
                









            <ScrollView showsVerticalScrollIndicator={false}>
              <Block style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }} >
              <Block flex={0.6} >
                <ImageBackground
                  source={Images.acheteur}
                  style={styles.profileContainer}
                  imageStyle={styles.profileBackground}
                >
                  <Block flex style={styles.profileCard}>
                    <Block style={{ position: 'absolute', width: width, zIndex: 5, paddingHorizontal: 20 }}>
                      <Block middle style={{ top: 10}}>
                        <Image source={Images.bomokoLogo} style={styles.avatar} />
                      </Block>
                      <Block style={{ top: 15 }}>
                        <Block middle >
                          <Text
                            style={{
                              fontFamily: 'montserrat-bold',
                              marginBottom: theme.SIZES.BASE / 2,
                              fontWeight: '900',
                              fontSize: 26
                            }}
                            color='#ffffff'
                            >
                            {group.nom_group}
                          </Text>

                          <Text
                            size={16}
                            color="white"
                            style={{
                              marginTop: 5,
                              fontFamily: 'montserrat-bold',
                              lineHeight: 20,
                              fontWeight: 'bold',
                              fontSize: 18,
                              opacity: .8
                            }}
                          >
                            Credit individuel: {group.somme} $
                          </Text>
                        </Block>
                        <Block style={styles.info}>
                          <Block row space="around">

                            <Block middle>
                              <Text
                                size={18}
                                color="white"
                                style={{ marginBottom: 4, fontFamily: 'montserrat-bold' }}
                              >
                                10
                              </Text>
                              <Text style={{ fontFamily: 'montserrat-regular' }} size={14} color="white">
                                Membres
                              </Text>
                            </Block>

                            <Block middle>
                              <Text
                                color="white"
                                size={18}
                                style={{ marginBottom: 4, fontFamily: 'montserrat-bold' }}
                              >
                                200 $
                              </Text>
                              <Text style={{ fontFamily: 'montserrat-regular' }} size={14} color="white">
                                Valides
                                </Text>
                            </Block>

                            <Block middle>
                              <Text
                                color="white"
                                size={18}
                                style={{ marginBottom: 4, fontFamily: 'montserrat-bold' }}
                              >
                                100 $
                              </Text>
                              <Text style={{ fontFamily: 'montserrat-regular' }} size={14} color="white">
                                En attente
                              </Text>
                            </Block>

                          </Block>
                        </Block>
                      </Block>

                    </Block>


                    <Block
                      middle
                      row
                      style={{ position: 'absolute', width: width, top: height * 0.3 - 22, zIndex: 99}}
                    >
                      <Button
                      onPress={_ => this._adhesion(group.id, group.nom_group, group.somme, group.nbr_jour, group.cat == 30? "mois": "semaines")}         

                      style={{ width: 114, height: 44, marginHorizontal: 5, elevation: 5}} 
                      textStyle={{ fontSize: 16 }} round>
                        Adherer
                      </Button>
                      
                      <Button 
                      color="default"
                      style={{ width: 150, height: 44, marginHorizontal: 5, elevation: 5 }} 
                      textStyle={{ fontSize: 16 }} round>
                        Demander credit
                      </Button>
                       <GaButton
                        round
                        onlyIcon
                        shadowless
                        icon="info"
                        iconFamily="Font-Awesome"
                        iconColor={nowTheme.COLORS.WHITE}
                        iconSize={nowTheme.SIZES.BASE * 1.375}
                        color={'#888888'}
                        style={[styles.social, styles.shadow]}
                      />
                      {/*<GaButton
                        round
                        onlyIcon
                        shadowless
                        icon="info"
                        iconFamily="Font-Awesome"
                        iconColor={nowTheme.COLORS.WHITE}
                        iconSize={nowTheme.SIZES.BASE * 1.375}
                        color={'#888888'}
                        style={[styles.social, styles.shadow]}
                      /> */}
                    </Block>
                  </Block>
                </ImageBackground>


              </Block>
              <Block />
              <Block flex={0.4} style={{zIndex:1, padding: theme.SIZES.BASE, marginTop: 10}}>
                <Block>
                  <Block flex style={{ marginTop: 20 }}>
                    <Block middle>
                      <Text
                       style={group.etat ==1 ? styles.etatE: styles.etatS}
                        
                      >
                        {group.etat == 0? "EN COURS" : "VALIDE"}

                          </Text>
                      <Text
                        size={16}
                        muted
                        style={{
                          textAlign: 'center',
                          fontFamily: 'montserrat-regular',
                          zIndex: 2,
                          lineHeight: 25,
                          color: '#9A9A9A',
                          paddingHorizontal: 15
                        }}
                      >
                        {group.details}
                          </Text>
                    </Block>
                    
                    <Block style={styles.container} row>
                      {/* <Text bold size={16} color="#2c2c2c" style={{ marginTop: 3 }}>
                        DATE DE DEBUT:
                      </Text>
                      <Text bold muted size={16}  style={{ marginTop: 1 }}>
                        {new Date(parseFloat(group.date_debut)).toDateString()}
                      </Text> */}


                      <View style={styles.cellContainer}>
                        <Text style={styles.titleText}>Date debut</Text>
                        <Text style={styles.amountText}> {new Date(parseFloat(group.date_debut)).toDateString()}</Text>
                      </View>
                      <View style={styles.cellContainer}>
                        <Text style={styles.titleText}>Date fin</Text>
                        <Text>{new Date(parseFloat(group.date_fin)).toDateString()}</Text>
                      </View>
                      {/* <View style={styles.cellContainer}>
                        <Text style={styles.titleText}>Status</Text>
                        <Text>Dans 1 jrs</Text>
                      </View> */}
                      
                    </Block>

                    <Block row style={{ paddingVertical: 8, paddingHorizontal: 15 }} space="between">
                      <Text bold size={16} color="#2c2c2c" style={{ marginTop: 3 }}>
                        Les adhesions se cloturent dans :
                       

                      </Text>
                      <Text bold muted size={16}  style={{ marginTop: 1 }}>
                        {(new Date(parseFloat(group.date_debut))).getDate()  - (new Date()).getDate() } jours
                       
                      </Text>
                      
                    </Block>

{/* 
                    <Block style={{ paddingBottom: -HeaderHeight * 2, paddingHorizontal: 15}}>
                      <Block row space="between" style={{ flexWrap: 'wrap' }}>
                        {Images.Viewed.map((img, imgIndex) => (
                          <Image
                            source={img}
                            key={`viewed-${img}`}
                            resizeMode="cover"
                            style={styles.thumb}
                          />
                        ))}
                      </Block>
                    </Block> */}

                    <Block flex>

                    {this.state.clients.map((item, index) => {
                      return <Block key={index} flex row>
                      <ListCLient item={item} horizontal/>
                    </Block>
                    })}   

                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
          </ScrollView>














              </Block>
            </Block>
          </ImageBackground>
        </Block>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  imageBackground: {
    width: width,
    height: height
  },
  registerContainer: {
    marginTop: 55,
    width: width * 0.9,
    height: height < 812 ? height * 0.8 : height * 0.8,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden'
  },
  socialConnect: {
    backgroundColor: nowTheme.COLORS.WHITE
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  




  profileContainer: {
    justifyContent: 'center',// unitile
    alignSelf: 'center',
    width,
    height: height * 0.3,
    padding: 0,
    zIndex: 120
  },
  profileBackground: {
    width,
    height: height * 0.3
  },

  info: {
    marginTop: 10,
    paddingHorizontal: 10,
    height: height * 0.8
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -30
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: 'center',
    zIndex: 99,
    marginHorizontal: 5,
    elevation: 5
  },


  profileCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  etatS:{
    color: '#a11',
    fontWeight: 'bold',
    fontSize: 19,
    fontFamily: 'montserrat-bold',
    marginTop: 15,
    marginBottom: 30,
    zIndex: 2
  },
  etatE:{
    color: '#080',
    fontWeight: 'bold',
    fontSize: 19,
    fontFamily: 'montserrat-bold',
    marginTop: 15,
    marginBottom: 30,
    zIndex: 2
  },


  container: {
    fontFamily: 'montserrat-bold',
    paddingVertical: 8,
    marginTop:7,
    marginBottom:7,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: nowTheme.COLORS.TABS,
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,

  },
  cellContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    color: 'gray',
  },
  amountText: {
    fontSize: 15,
  },
});

export default DetailGroup;
