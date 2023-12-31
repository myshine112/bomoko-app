import React, { useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Keyboard,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Block from './Block';
import Text from './Text';
import { COLORS, FONTS, icons, SIZES } from '../../constants';
import { Button, Card, MD3Colors, Modal, ProgressBar, Snackbar, TextInput } from 'react-native-paper';
import { BottomSheet } from 'react-native-btr';
import { useDispatch, useSelector } from 'react-redux';
import CoutScreen from './CoutScreen';
import { Alert } from 'react-native';
import { addCout } from '../../redux/coutReducer';
import { View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import Slider from '@react-native-community/slider';
import Timeline from 'react-native-timeline-flatlist';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { delProduct, soumettreProduct } from '../../redux/prodReducer';
import { TouchableWithoutFeedback } from 'react-native';

const Details = ({ route, navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const { error, isLoading } = useSelector((state) => state.products);

  const [visible, setVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedAmount, setEditedAmount] = useState('');
  const [totAmount, setTotAmount] = useState(
    route.params.food.couts.reduce((sum, cout) => sum + cout.amount, 0)
  );

  // Get token
  const [token, setToken] = useState(null);

  const [visibleSnackBar , setVisibleSnackBar ] = useState(false);
  const onDismissSnackBar = () => setVisibleSnackBar(false);
  const onToggleSnackBar = () => setVisibleSnackBar(!visibleSnackBar );
  const [expandedMembre, setExpandedMembre] = useState(false);

  const toggleExpansion = () => {
    setExpandedMembre(!expandedMembre);
  };

  const membresToShow = expandedMembre
  ? route.params.food.membres
  : route.params.food.membres.slice(0, 1); // Show the first two users if not expanded

  const [dateStart, setDateStart] = useState(new Date(route.params.food.startDate));
  const [dateEnd, setDateEnd] = useState(new Date(route.params.food.endDate));

  useEffect(() => {
    const getTokenFromAsyncStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('user');
        setToken(storedToken);
       
      } catch (error) {
        // Handle AsyncStorage read error if needed
        console.error('Error reading token from AsyncStorage:', error);
      }
    };

    getTokenFromAsyncStorage();
  }, []);

  useEffect(()=> {
    console.log("owner", route.params.food.membres);
    console.log("token", JSON.parse(token)?.user?.user?.userId,);
  },[])

  const dispatch = useDispatch();

  const handleContactSupport = () => {
    // Replace with your support email or contact form link
    const supportEmail = 'info@alphanewgroup.com';
    Linking.openURL(`mailto:${supportEmail}`);
  };

  // Date Calculation
  const targetStartDate = new Date(route.params.food.startDate);
  const targetEndDate = new Date(route.params.food.endDate);
  const today = new Date();
  const timeDifference = targetStartDate - today;
  const timeTotalExerc = targetEndDate - targetStartDate;
  const timeDiffExerc = targetEndDate - today;

  // Calculate the number of milliseconds in a day
  const millisecondsInDay = 24 * 60 * 60 * 1000;

  // Calculate the number of days left
  const daysLeft = Math.ceil(timeDifference / millisecondsInDay);
  const daysLeftExc = Math.ceil(timeDiffExerc / millisecondsInDay);
  const daysTotalExc = Math.ceil(timeTotalExerc / millisecondsInDay);

  console.log(`Days left: ${daysLeft}`);

  const showToast = () => {
    ToastAndroid.show("Une erreur s'est produite", ToastAndroid.LONG);
  }

  // Timeline
  const outputTimeLine = route.params.food.timeline.map(item => {
    const formattedDate = new Date(item.timestamp).toLocaleDateString('en-GB').replace(/\//g, '-');

    return {
      time: formattedDate,
      title: item.title,
      description: item.details,
      
    };
  });

  // Pushing the additional object to the output array
  const mydateEnd = new Date(targetEndDate);

  outputTimeLine.unshift({
    time:`${mydateEnd.toLocaleDateString('en-GB').replace(/\//g, '-')}`,
    title: 'Fin probable de la Campagne',
    description: `Probablelent la campagne de collecte de fonds prendra fin apres ${daysTotalExc} jours de la date de debut de la collecte`,
    lineColor: COLORS.peach,
    circleSize: 30,
    circleColor: COLORS.peach,
    dotColor: COLORS.black,
    innerCircle: 'dot',
  });

  const [expanded, setExpanded] = useState(false);

  const [sliderValue, setSliderValue] = useState(route.params.food.amount/100);
  // slider * 100 / interet
  const [interet, setInteret] = useState((sliderValue *5 )/100);

  function toggle() {
    setVisible((visible) => !visible);
  }

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Modal Delete P/S
  const [visibleDel, setVisibleDel] = useState(false);
  const showModalDel = () => setVisibleDel(true);
  const hideModalDel = () => setVisibleDel(false);

  const containerStyle = {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 10,
    alignSelf: 'center',
    position:"absolute",
    top:'15%'
  };

  // Modal SOUMETRE
  const [visibleSoumettre, setVisibleSoumettre ] = useState(false);
  const showModalSoumettre = () => setVisibleSoumettre(true);
  const hideModalSoumettre= () => setVisibleSoumettre(false);

   // Modal Demande Adhesion
   const [visibleAdhesion, setVisibleAdhesion] = useState(false);
   const showModalAdhesion = () => setVisibleAdhesion(true);
   const hideModalAdhesion = () => setVisibleAdhesion(false);

    // Modal Demande Quit
    const [visibleQuitter, setVisibleQuitter] = useState(false);
    const showModalQuitter = () => setVisibleQuitter(true);
    const hideModalQuitter = () => setVisibleQuitter(false);

    // Modal Demande Quit
    const [visibleContribuer, setVisibleContribuer] = useState(false);
    const showModalContribuer = () => setVisibleContribuer(true);
    const hideModalContribuer = () => setVisibleContribuer(false);

    
  // Dispaly rating stars
  const stars = (starsNumber) => {
    const totalStars = 5;
    const filledStars = Math.min(starsNumber, totalStars);
  
    return (
      <Block row>
        {[...Array(filledStars).keys()].map((star, index) => (
          <Ionicons color={COLORS.yellow} key={index} size={SIZES.base * 2} name={'star'} />
        ))}
        {[...Array(totalStars - filledStars).keys()].map((star, index) => (
          <Ionicons color={COLORS.yellow} key={index} size={SIZES.base * 2} name={'star-outline'} />
        ))}
      </Block>
    );
  };

  const renderImages = () => {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        {route.params.food.images.map((image, index) => (
          <ImageBackground
            key={index}
            source={{ uri: image}}
            resizeMode="cover"
            style={{ width: SIZES.width, height: 170, justifyContent: 'flex-end' }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 170,
              }}
            ></LinearGradient>
          </ImageBackground>
        ))}
      </ScrollView>
    );
  };

  const handleAmountChange = (text) => {
    setEditedAmount(text);
  };

  const handleNameChange = (text) => {
    setEditedName(text);
  };

  const handleAddCout = async () => {
    try{
      if (!editedName || !editedAmount) {
        // Throw UI error if any field is missing
        Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
        return;
      }

      const coutObj = {
        name: editedName,
        amount: editedAmount,
      };

      dispatch(soumettreProduct({
        ...route.params.food,
        id: route.params.food._id,
        couts: [
          coutObj,
          ...route.params.food.couts,
        ]
      }));

      route.params.food.couts = [
        coutObj,
        ...route.params.food.couts,
      ]

      setEditedName('');
      setEditedAmount('');
      // Check if the member was updated successfully
      if (!error && !isLoading) {
        setTotAmount(totAmount + parseFloat(editedAmount));
      }else {
        console.log('Error ++++++')
        onToggleSnackBar()
      }
    } catch(e){
      console.log('Error //////////', e)
      onToggleSnackBar()
      showToast()
    }
  };

  const handleDelete = async () => {
    dispatch(delProduct({
      id: route.params.food._id
    }));

     // Check if the product was deleted successfully
    if (!error) {
      // Navigate back to the previous screen
      navigation.navigate('Main');
    }else {
      onToggleSnackBar()
    }
  }

  // Push New LIne into timeline array
  // Change Status
  // "PENDING","SUBMITED", "REJECTED", "ACCEPTED", "BANNED"
  
  const handleSoumettre = async () => {

    // Pushing the additional object to the output array
    const today = new Date();

    const outputTimeLineSoum = {
      time:`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear().toString().substr(-2)}`,
      title: 'Soumission',
      details: `Votre ${route.params.food.type} a été soumis à l'équipe African Fintech et est en attente de validation`
    };

    dispatch(soumettreProduct({
      ...route.params.food,
      id: route.params.food._id,
      status: "SUBMITED",
      timeline: [
        outputTimeLineSoum,
        ...route.params.food.timeline,
      ]
    }));

     // Check if the product was deleted successfully
    if (!error) {
      // Navigate back to the previous screen
      navigation.navigate('Main');

    }else {
      onToggleSnackBar()
    }
  };

  const handleAcceptReq = async (myUser) => {
    try{
  
      const updatedMembres = route.params.food.membres.map((membre) => {
        if (membre.user._id === myUser.user._id) {
          return {
            ...membre,
            admission_req: 'ACCEPTED',
          };
        }
        return membre;
      });

      dispatch(soumettreProduct({
        ...route.params.food,
        id: route.params.food._id,
        membres: updatedMembres,
      }));
  
       // Check if the member was updated successfully
      if (!error && !isLoading) {
        // Navigate back to the previous screen
        await navigation.navigate('Main');
  
      }else {
        console.log('Error ++++++')
        onToggleSnackBar()
      }
    } catch(e){
      console.log('Error //////////', e)
      onToggleSnackBar()
      showToast()
    }
  };

  const handleAcceptReject = async (myUser) => {
    try{
      const updatedMembres = route.params.food.membres.map((membre) => {
        if (membre.user._id === myUser.user._id) {
          return {
            ...membre,
            admission_req: 'REJECTED',
          };
        }
        return membre;
      });

      dispatch(soumettreProduct({
        ...route.params.food,
        id: route.params.food._id,
        membres: updatedMembres,
      }));
  
       // Check if the member was updated successfully
      if (!error && !isLoading) {
        // Navigate back to the previous screen
        await navigation.navigate('Main');
  
      }else {
        console.log('Error ++++++')
        onToggleSnackBar()
      }
    } catch(e){
      console.log('Error //////////', e)
      onToggleSnackBar()
      showToast()
    }
  }

  // Add user to prod/serv's memeber array
  // Display "Quitter" button while waiting for Admin Validation
  
  const handleAdhesion = async () => {

    // Push current user to member array

    // Reuse the soumettreProduct function
    dispatch(soumettreProduct({
      ...route.params.food,
      id: route.params.food._id,
      membres: [
        ...route.params.food.membres,
        {
          user: JSON.parse(token)?.user?.user?.userId,
          admission_req: 'PENDING', 
          contribution_amount: 0,
          contribution_status: 'PENDING', 
        }
      ]
    }));

     // Check if the product was deleted successfully
    if (!error) {
      // Navigate back to the previous screen
      navigation.navigate('Main');

    }else {
      onToggleSnackBar()
    }
  };

  const handleUpdateItem = (item,  editedAmount1, editedName1) => {
    // Handle update item event
    try {
      // Throw UI alert for updating an item
      Alert.alert(
        'Attention',
        `Êtes-vous sûr de vouloir mettre à jour ${item.name} ?`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Mettre à jour',
            style: 'default',
            onPress: async () => {
              // Function to execute when the user presses the "Mettre à jour" button
              console.log('Élément mis à jour', item);

              const updatedCouts = route.params.food.couts.map((cout) => {
                if (cout._id === item._id) {
                  return {
                    ...cout,
                    name: editedName1,
                    amount: editedAmount1,
                  };
                }
                return cout;
              });

              dispatch(soumettreProduct({
                ...route.params.food,
                id: route.params.food._id,
                couts: updatedCouts,
              }));
              
              // Check if the item was updated successfully
              if (!error && !isLoading) {
                console.log('Élément mis à jour avec succès');
                setTotAmount(totAmount + parseFloat(editedAmount1) - parseFloat(route.params.food.couts.find(cout => cout._id === item._id).amount));

                route.params.food.couts = updatedCouts;
              } else {
                console.log('Erreur de mise à jour');
                onToggleSnackBar();
              }
            },
          },
        ]
      );
    } catch (e) {
      console.log('Erreur //////////', e);
      onToggleSnackBar();
      showToast();
    }
  };
  
  const handleTrash = (item) => {
    // Handle trash icon click event
    try{
      // Throw UI alert if user want de delete an item
      // Afficher l'alerte avec des boutons de confirmation et d'annulation
      Alert.alert(
        'Attention',
        `Êtes-vous sûr de vouloir supprimer ${item.name} ?`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: async () => {
              // Fonction à exécuter lorsque l'utilisateur appuie sur le bouton "Supprimer"
              console.log('Élément supprimé', item);

                const updatedCouts = route.params.food.couts.filter(cout => cout._id !== item._id);

                dispatch(soumettreProduct({
                  ...route.params.food,
                  id: route.params.food._id,
                  couts: updatedCouts,
                }));
            
                // Check if the couts was updated successfully
                if (!error && !isLoading) {
                  setTotAmount(totAmount - parseFloat(item.amount));

                  route.params.food.couts = updatedCouts;
            
                }else {
                  console.log('Error ++++++')
                  onToggleSnackBar()
                }
              
            },
          },
        ]
      );

    } catch(e){
      console.log('Error //////////', e)
      onToggleSnackBar()
      showToast()
    }
  };


  const renderScrollIndicator = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);

    return (
      <Block
        row
        center
        middle
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          justifyContent: 'center',
        }}
      >
        {route.params.food.images.map((image, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: COLORS.gray,
                opacity,
                marginHorizontal: 4,
              }}
            />
          );
        })}
      </Block>
    );
  };

  const renderFAaddCout = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <Block row center style={styles.floatBlockFA}>
        <TextInput
          label="Description"
          value={editedName}
          onChangeText={handleNameChange}
          mode="outlined"
          style={[styles.input, { width: '45%' }]}
          required
        />

        <TextInput
          label={`Prix tot (${route.params.food.currency})`}
          value={`${editedAmount}`}
          onChangeText={handleAmountChange}
          mode="outlined"
          keyboardType='decimal-pad'
          style={[styles.input, { width: '40%' }]}
          required
        />

      <TouchableOpacity  onPress={() => {
            Keyboard.dismiss();
            handleAddCout();
          }}>
          <Ionicons name="add-circle" size={50} color={COLORS.darkgreen} />
        </TouchableOpacity>
       
      </Block>
      </TouchableWithoutFeedback>
    );
  };

  const renderFloatingBlock = () => {
    return (
      <Block row space="between" style={styles.floatBlock}>
        <Text bold>Les coûts directs et indirects</Text>
        <Button textColor="#fff" elevated buttonColor={COLORS.purple} onPress={toggle}>
          Les coûts
        </Button>
      </Block>
    );
  };

  const renderItem = (item) => (
    <TouchableOpacity
      onPress={() => {
        console.log(item.user);
        // navigation.navigate('Profile', { user: item})
        navigation.navigate('Profile', {
          userId: item.user._id,
          user: item.user
        })
      }}
    >
      <View
        style={{
          marginVertical: SIZES.padding / 3.7,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.white,
          ...styles.shadow,
        }}
      >
        {/* Title */}
        <View
          style={{
            flexDirection: 'row',
            padding: SIZES.padding / 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              width: '60%',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: COLORS.lightGray,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: SIZES.base,
              }}
            >
              

              { item.user.profile_pic  ? (
                <Image
                  source={{ uri: item.user.profile_pic  }}
                  style={{ width: 40, height: 40, borderRadius:20, borderWidth:1,
                  borderColor: COLORS.white}}
                />
              ) : (
                <Image
                  source={icons.investment}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: COLORS.black,
                  }}
                />
              )}

            </View>
            <View>
              <Text numberOfLines={1} style={{ ...FONTS.h3, color: COLORS.black }}>{
                item.admin? item?.name: item?.user?.name 
              } 
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  overflow: 'hidden',
                  ...FONTS.body5,
                  flexWrap: 'wrap',
                  color: COLORS.darkgray,
                }}
              >
                {  item.admin? item?.contribution: item?.contribution_amount }  {route.params.food.currency} 
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
  {(!item.admin && route.params.food.owner._id == JSON.parse(token)?.user?.user?.userId) ? (
    item.admission_req == 'ACCEPTED' ? (
      <>
        <Text style={{ ...FONTS.h5, color: COLORS.red }}>+4% intérêt</Text>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={icons.calendar}
            style={{
              width: 12,
              height: 12,
              tintColor: COLORS.darkgray,
              marginRight: 7,
              marginTop: 3,
            }}
          />
          <Text style={{ marginBottom: SIZES.base, color: COLORS.darkgray, ...FONTS.body5 }}>
            {item.date}
          </Text>
        </View>
      </>
    ) : item.admission_req == 'REJECTED' ? (
      <Text style={{ ...FONTS.h5, color: COLORS.red }}>Rejeté</Text>
    ) : (
      <Block row space="between">
        <TouchableOpacity onPress={() => handleAcceptReject(item)}>
          {isLoading ? (
            <></>
          ) : (
            <Ionicons name="close-circle" size={40} color={COLORS.peach} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleAcceptReq(item)}>
          {isLoading ? (
            <></>
          ) : (
            <Ionicons name="checkmark-circle" size={40} color={COLORS.darkgreen} />
          )}
        </TouchableOpacity>
      </Block>
    )
  ) : item.admission_req == 'PENDING' ? (
    <>
      <Text style={{ ...FONTS.h5, color: COLORS.gray}}>En attente</Text>
    </>
  ) : (
    <>
      <Text style={{ ...FONTS.h5, color: COLORS.red }}>+5% intérêt</Text>
      <View style={{ flexDirection: 'row', marginTop:20 }}>
        <Image
          source={icons.calendar}
          style={{
            width: 12,
            height: 12,
            tintColor: COLORS.darkgray,
            marginRight: 7,
            marginTop: 3,
          }}
        />
        <Text style={{ marginBottom: SIZES.base, color: COLORS.darkgray, ...FONTS.body5 }}>
          {item.date}
        </Text>
      </View>
    </>
  )}
</View>

          
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Block flex={1}>
        <Block style={{ height: 180 }}>
          {renderImages()}
          {renderScrollIndicator()}
        </Block>
        <Block
          p={20}
          style={{
            backgroundColor: 'white',
            marginHorizontal: '5%',
            width: '90%',
            borderRadius: 10,
            elevation: 2,
            marginTop: -20,
          }}
        >
          <Text center numberOfLines={1} size={20} bold>
            {route.params.food.name}
          </Text>
          {
            // "PENDING","SUBMITED", "REJECTED", "ACCEPTED", "BANNED"
            route.params.food.status == "PENDING"?
              <Text color={COLORS.red} center>[Bruillon]</Text>:
            route.params.food.status == "SUBMITED"?
              <Text color={COLORS.red} center>[en attente de validation]</Text>:
              <Text color={COLORS.darkgreen} center>[Validé]</Text>
          }
    
          <Text bold center>Du {dateStart.getDate()}/{dateStart.getMonth() + 1}/{dateStart.getFullYear().toString().substr(-2) } 
          {`  au `} {dateEnd.getDate()}/{dateEnd.getMonth() + 1}/{dateEnd.getFullYear().toString().substr(-2)} </Text>
          <Text center>Prix total</Text>
          <Text bold size={30} center color={COLORS.peach}>
            {route.params.food.amount}  {route.params.food.currency} 
          </Text>

          <Block>
            <Block row space="between">
              <TouchableOpacity onPress={()=> 
                {
                  console.log('Images');
                  navigation.navigate('ShowImages', { images: route.params.food.images})
                }}>
                <Block row center style={styles.round}>
                    <Ionicons name="md-image" color={COLORS.peach} size={20} />
                    <Text style={{marginLeft: 5}} numberOfLines={1}>Voir images</Text>
                </Block>
              </TouchableOpacity>

              <Block row center style={styles.round}>
                <Ionicons name="md-time" color={COLORS.peach} size={20} />
                <Text numberOfLines={1}> 
                {daysLeft > 0? `${daysLeft} Jours restent`:`${-daysLeft} jours de retard`}</Text>
              </Block>
            </Block>

            <Block center m_t={10}>
              <ProgressBar
                progress={0}
                color={MD3Colors.error50}
                style={{ width: SIZES.width / 1.4, height: SIZES.base }}
              />
            </Block>
            <Block m_t={5} row space="between">
              <Text numberOfLines={1} semibold size={16}>
              Montant collecté(
              {((route.params.food.initialAmount + route.params.food.membres
.filter(member => member.contribution_status === "ACCEPTED")
.reduce((sum, member) => sum + member.contribution_amount, 0)) * 100 / route.params.food.amount).toFixed(1)}%)
              </Text>
              <Text numberOfLines={1}>
              {route.params.food.initialAmount} {route.params.food.currency}
              </Text>
            </Block>
            <Block>
              <Block row space="between">
                <Text numberOfLines={1} semibold>
                  Le coût total de production:
                </Text>
                <Text> {totAmount} {route.params.food.currency} </Text>
              </Block>

              <Block row space="between">
                <Text numberOfLines={1} semibold>
                  Le prix d'une part:
                </Text>
                <Text> {route.params.food.amount/100} {route.params.food.currency}</Text>
              </Block>

              <Block row space="between">
                <Text numberOfLines={1} semibold>
                  Les parts disponibles:
                </Text>
                <Text>{(100 - (route.params.food.initialAmount / (route.params.food.amount / 100).toFixed(0))).toFixed(0)} parts</Text>
              </Block>

              {/* <Block row space="between">
                <Text numberOfLines={1} semibold>
                  Le coût total de Revient:
                </Text>
                <Text> 0 {route.params.food.currency} </Text>
              </Block> */}
              <Block row space="between">
                <Text numberOfLines={1} semibold>
                    Taux d'intérêt :
                  </Text>
                  <Text> {route.params.food?.tauxInt} % </Text>
                  </Block>
              </Block>
            {
              JSON.parse(token)?.user.user.username === route.params.food.owner.username? 
              <Block row space="between" m_t={10}>
              {/* owner */}
             {
              route.params.food.status == 'PENDING'?
              <>
                <Button textColor="#fff" elevated buttonColor={COLORS.lightBlue} onPress={()=>
              {
                // console.log("route.params.food", route.params.food);
                 navigation.navigate('EditProduct', { owner: JSON.parse(token)?.user?.user?.userId,
                  username: JSON.parse(token)?.user?.user?.username, productService: route.params.food });
              }}>
                Modifier
              </Button>

              <Button textColor="#fff" elevated buttonColor={COLORS.peach} onPress={()=> showModalDel()}>
                Supprimer
              </Button>

              <Button textColor="#fff" elevated buttonColor={COLORS.darkgreen} onPress={()=> showModalSoumettre()}>
                Soumettre
              </Button>
              </>:<></>
             }
              
            </Block>
            :
            <Block row space="between" m_t={10}>
              {/* other */}
              {
                route.params.food.membres.some(member => member?.user?._id == JSON.parse(token)?.user?.user?.userId)?
              <>
              <Button textColor="#fff" elevated buttonColor={COLORS.peach} onPress={()=> showModalQuitter()}>
                Quitter
              </Button>

              {
                 route.params.food.membres.find(member => member?.admission_req == 'ACCEPTED')? <Button textColor="#fff" elevated buttonColor={COLORS.darkgreen} onPress={()=> showModalContribuer()}>
                  Contribuer
                </Button>:
                <></>
              }

              </> :
               <Button textColor="#fff" elevated buttonColor={COLORS.purple} onPress={()=> showModalAdhesion()} >
               Demande d'Adhesion
             </Button>
              }
             
            </Block>
            }

          </Block>
        </Block>

        <Block p={20} style={{ zIndex: -101 }}>
          <Text color={COLORS.darkgray} numberOfLines={expanded ? undefined : 2} black>
            {route.params.food.detail}
          </Text>
          {route.params.food.detail.length > 50 && (
            <Text bold color={COLORS.blue} onPress={toggleExpanded}>
              {expanded ? 'Voir moins' : 'Voir plus'}
            </Text>
          )}
          <Block mt={5}>
            {stars(route.params.food.stars.length)}
          
          </Block>
        </Block>

        <Block p_l={20} p_r={20}>
          <Text bold numberOfLines={1}>
          MEMBRES ({route.params.food.membres.length + 1})
          </Text>

          {
            renderItem({ admin: true, name: route.params.food.owner.name+" (Admin)", 
            //name: route.params.food.owner._id
            user: {_id: route.params.food.owner._id,  ...route.params.food.owner},
            contribution: route.params.food.initialAmount, 
            date: format(new Date(route.params.food.timestamp), 'dd MMMM yyyy', { locale: fr }) })
          }

          {
            membresToShow.map((membre, index) => renderItem(membre))

          }

          {route.params.food.membres?.length > 1 && ( // Show "Voir plus" only if there are more than 2 users
            <TouchableOpacity onPress={toggleExpansion}>
              <Text bold color={COLORS.blue}>
                {expandedMembre ? 'Voir moins' : 'Voir plus'}
              </Text>
            </TouchableOpacity>
          )}
        </Block>

        <Block p={20}>
          <Text bold numberOfLines={1}>
            CALCUL D'INVESTISSEMENT ({route.params.food.currency})
          </Text>
          <Text>Projection du retour sur investissement</Text>

          <Svg style={{ width: '100%' }}>
            <VictoryChart domainPadding={50} theme={VictoryTheme.material} >
              <VictoryBar
                style={{ 
                  data: {
                    fill: ({ datum }) => {
                      if (datum.x === `Intérêt (${route.params.food.tauxInt}%)`) {
                        return COLORS.primary;
                      } else if (datum.x === `Invest`) {
                        return COLORS.peach;
                      } else if (datum.y > route.params.food.initialAmount) {
                        return COLORS.purple;
                      } else {
                        return COLORS.black;
                      }
                    }
                  }
                 }}
                labels={({ datum }) => `${datum.y} ${route.params.food.currency}`}

                categories={{
                  x: [`Total`, 
                  `Disponible`,
                  `Intérêt (${route.params.food.tauxInt}%)`,
                  `Invest`
                ],
                }}
                data={[
                  { x: `Total`, y: route.params.food.amount },
                  { x:  `Disponible`, y: 
                  (route.params.food.initialAmount+route.params.food.membres
                    .filter(member => member.contribution_status === "ACCEPTED")
                    .reduce((sum, member) => sum + member.contribution_amount, 0))
                  },
                  { x:  `Intérêt (${route.params.food.tauxInt}%)`, y: interet },
                  { x: `Invest`, y: sliderValue },
                ]}
              />
            </VictoryChart>
          </Svg>

          {/*Slider with max, min, step and initial value*/}
          <Slider
            maximumValue={(route.params.food.amount-(route.params.food.initialAmount+route.params.food.membres
              .filter(member => member.contribution_status === "ACCEPTED")
              .reduce((sum, member) => sum + member.contribution_amount, 0)))}
            minimumValue={route.params.food.amount/100}
            minimumTrackTintColor="#307ecc"
            maximumTrackTintColor="#000000"
            step={route.params.food.amount/100}
            value={sliderValue}
            onValueChange={(sliderValue) => {
              setInteret((sliderValue * route.params.food.tauxInt )/100)
              setSliderValue(sliderValue)}
            }
          />

        <Text bold style={{ color: 'black' }}>
          Vous investissez la somme de : {sliderValue} {route.params.food.currency}.
           Ceci équivaut à {sliderValue/(route.params.food.amount/100)} parts de {route.params.food.amount/100} {route.params.food.currency} chacun.
           Et votre Intérêt de (${route.params.food.tauxInt}%) est de {interet} {route.params.food.currency} après l'exercice. </Text>
          
        </Block>

        <Block p_l={20} p_r={20}>
          <Text bold numberOfLines={1}>
            TIMELINE
          </Text>
          <Timeline
            style={styles.list}
            data={outputTimeLine}
            circleSize={20}
            circleColor="rgb(45,156,219)"
            lineColor="rgb(45,156,219)"
            timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
            timeStyle={{
              textAlign: 'center',
              backgroundColor: '#ff9797',
              color: 'white',
              padding: 5,
              borderRadius: 13,
            }}
            descriptionStyle={{ color: 'gray' }}
            options={{
              style: { paddingTop: 5 },
            }}
            columnFormat="single-column-left"
          />

          {/* <Text bold color={COLORS.blue}>
            {expanded ? 'Voir moins' : 'Voir plus'}
          </Text> */}
        </Block>

        <Block p_l={20} p_r={20}>
          <Text bold numberOfLines={1}>
            BESOIN D'AIDE?
          </Text>
        </Block>

        
          
        <Block  p_l={20} p_r={20}   >
          <Text>
            {`Avez-vous des questions sur ce ${route.params.food.type}? Contactez le propriétaire ou notre expert en financement participatif.`}
            </Text>
        <Block row space='between'>

        <View style={styles.columnMembre1}>
            <Image
              source={{uri: route.params.food.owner?.profile_pic}}
              style={styles.imgOwner}
            />
            <Text numberOfLines={2} bold >{route.params.food.owner?.name}</Text>
            <Text numberOfLines={1} style={styles.contentTitle}>Président</Text>
          </View>

         <Block style={{ justifyContent: 'center' }}>
         <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
        <Text style={styles.buttonText}>Contacter l'Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactButton2} onPress={handleContactSupport}>
        <Text style={styles.buttonText}>Contacter le Support</Text>
      </TouchableOpacity>
         </Block>

        </Block>
        </Block>

        <BottomSheet
          visible={visible}
          onBackButtonPress={toggle}
          onBackdropPress={toggle}
          containerStyle={styles.bottomSheetContainer}
        >
          <Block style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Le coût total de production</Text>
            <Text style={styles.bottomSheetText}>
              Il permet de prendre en compte tous les éléments de coût associés à la fabrication,
              l'achat ou la prestation d'un bien ou d'un service.
            </Text>
            <View style={[styles.card,{ marginBottom: route.params.food.owner._id == JSON.parse(token)?.user?.user?.userId? 190 : 100} ]}>
              <ScrollView
                //ref={scrollRef}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
              >
                {
                  route.params.food.couts
                  .map((food, index) => {
                    return <CoutScreen admin={route.params.food.owner._id == JSON.parse(token)?.user?.user?.userId}
                    totAmount={totAmount} handleUpdateItem={handleUpdateItem} handleTrash={handleTrash} currency={route.params.food.currency} key={index} item={food} count={index + 1} />;
                  })}
              </ScrollView>
            </View>
            {
              route.params.food.owner._id == JSON.parse(token)?.user?.user?.userId?
              renderFAaddCout(): <></>
            }
           
          </Block>
        </BottomSheet>
        
      </Block>
      {renderFloatingBlock()}

      {/* Delete Prod/Serv */}
      <Modal
        style={{ zIndex: 99 }}
        visible={visibleDel}
        onDismiss={hideModalDel}
        contentContainerStyle={[containerStyle, { zIndex: 999 }]} // Set a higher value for the z-index
      >
        <Card style={{ padding: 10 }}>
          <Card.Title
            titleStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
            title="ATTENTION!" 
          />
          <Card.Content>
            <Text variant="titleLarge">Voulez-vous vraiment supprimer le {route.params.food.type }
              {" "}{ route.params.food.name}?</Text>
          </Card.Content>
          <Card.Actions style={{ marginTop: 15 }}>
            <Button onPress={hideModalDel}>Annuler</Button>
            <Button buttonColor={COLORS.red}
             onPress={() => {
              hideModalDel()
              handleDelete()
            }} >Supprimer</Button>
          </Card.Actions>
        </Card>
      </Modal>

      {/* Soumettre */}
      <Modal
        style={{ zIndex: 99 }}
        visible={visibleSoumettre}
        onDismiss={hideModalSoumettre}
        contentContainerStyle={[containerStyle, { zIndex: 999 }]} // Set a higher value for the z-index
      >
        <Card style={{ padding: 10 }}>
          <Card.Title
            titleStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
            title="ATTENTION!" 
          />
          <Card.Content>
            <Text variant="titleLarge">Voulez-vous vraiment Soumettre le {route.params.food.type }
              {" "}{ route.params.food.name}?</Text>

              <Text color={COLORS.peach} variant="titleLarge">Ceci implique que votre {route.params.food.type} {" "} 
              sera soumis a l'equipe d'African Fintech sera etudier soigneusement pendant deux ou trois jours avant de 
              de le valider ou le rejeter dans la plateforme!</Text>
          </Card.Content>
          <Card.Actions style={{ marginTop: 15 }}>
            <Button onPress={hideModalSoumettre}>Annuler</Button>
            <Button buttonColor={COLORS.purple}
             onPress={() => {
              hideModalDel()
              handleSoumettre()
            }} >Soummetre</Button>
          </Card.Actions>
        </Card>
      </Modal>


      {/* Adhesion */}
      <Modal
        style={{ zIndex: 99 }}
        visible={visibleAdhesion}
        onDismiss={hideModalAdhesion}
        contentContainerStyle={[containerStyle, { zIndex: 999 }]} // Set a higher value for the z-index
      >

        <Card style={{ padding: 10 }}>
          <Card.Title
            titleStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
            title="ATTENTION!" 
          />
          {
            !token?
          <>
          <Card.Content>
            <Text variant="titleLarge">Vous devez d'abord vous connecter</Text>
          </Card.Content>
          <Card.Actions style={{ marginTop: 15 }}>
            <Button onPress={hideModalAdhesion}>Annuler</Button>
            <Button buttonColor={COLORS.red}
             onPress={() => {
              hideModalAdhesion()
              navigation.navigate('AuthScreen')
            }} >Connecter</Button>
          </Card.Actions>
          </>
              :
            <>
            <Card.Content>
            <Text variant="titleLarge">Voulez-vous vraiment Faire parti des insvesitteurs du {route.params.food.type }
              {" "}{ route.params.food.name}?</Text>

              <Text color={COLORS.peach} variant="titleLarge">Ceci implique que vous pouvez contribuer une somme
              d'argent et ganger apres l'exercice! Votre demande d'adhesion sera validee par le proprietaire du {route.params.food.type }
              {" "}{ route.params.food.name}</Text>
          </Card.Content>
          <Card.Actions style={{ marginTop: 15 }}>
            <Button onPress={hideModalAdhesion}>Annuler</Button>
            <Button buttonColor={COLORS.purple}
             onPress={() => {
              hideModalDel()
              handleAdhesion()
            }} >Adherer</Button>
          </Card.Actions>
            </>
            }
         
        </Card>
      </Modal>


      {/* Quitter */}
      <Modal
        style={{ zIndex: 99 }}
        visible={visibleQuitter}
        onDismiss={hideModalQuitter}
        contentContainerStyle={[containerStyle, { zIndex: 999 }]} // Set a higher value for the z-index
      >
        <Card style={{ padding: 10 }}>
          <Card.Title
            titleStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
            title="ATTENTION!" 
          />
          <Card.Content>
            <Text variant="titleLarge">Voulez-vous vraiment quitter le groupe des insvesitteurs du {route.params.food.type }
              {" "}{ route.params.food.name}?</Text>

             
          </Card.Content>
          <Card.Actions style={{ marginTop: 15 }}>
            <Button onPress={hideModalQuitter}>Annuler</Button>
            <Button buttonColor={COLORS.peach}
             onPress={() => {
              hideModalDel()
              //navigation.navigate('AuthScreen')
            }} >Quitter</Button>
          </Card.Actions>
        </Card>
      </Modal>


      {/* Contribuer */}
      <Modal
        style={{ zIndex: 99 }}
        visible={visibleContribuer}
        onDismiss={hideModalContribuer}
        contentContainerStyle={[containerStyle, { zIndex: 999 }]} // Set a higher value for the z-index
      >
        <Card style={{ padding: 10 }}>
          <Card.Title
            titleStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
            title="ATTENTION!" 
          />
          <Card.Content>
            <Text variant="titleLarge">Voulez-vous vraiment contribuer une somme d'argent et ganger apres l'exercice du {route.params.food.type }
              {" "}{ route.params.food.name}?</Text>

              <Block m_t={15} center >
                <TextInput
                  label="Somme"
                  value={0}
                  //onChangeText={}
                  mode="outlined"
                  style={[styles.input, { width: '100%', marginTop: 10 }]}
                  required
                  inputMode="numeric"
                />

                <TextInput
                  label="Commentaire"
                  value={''}
                  //onChangeText={}
                  mode="outlined"
                  style={[styles.input, { width: '100%' }]}
                  required
                />
              </Block>
             
          </Card.Content>
          <Card.Actions style={{ marginTop: 15 }}>
            <Button onPress={hideModalContribuer}>Annuler</Button>
            <Button buttonColor={COLORS.darkgreen}
             onPress={() => {
              hideModalDel()
              //navigation.navigate('AuthScreen')
            }} >Contribuer</Button>
          </Card.Actions>
        </Card>
      </Modal>

      <Snackbar
          visible={visibleSnackBar}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: COLORS.peach}}
          wrapperStyle={{ bottom: 30 }}
          action={{
            label: 'Annuler',
            onPress: () => {
              // Do something
            },
          }}
        >
          {error}
        </Snackbar>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  round: {
    borderRadius: 10,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.lightGray2,
  },
  input: {
    marginRight: 10,
  },
  detailsD: {
    elevation: 2,
    padding: 10,
  },
  floatBlock: {
    backgroundColor: COLORS.white,
    padding: 10,
    elevation: 5,
    position: 'relative',
    margin: SIZES.base * 2,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },

  floatBlockFA: {
    //backgroundColor: COLORS.white,
    padding: 10,
    position: 'absolute',
    bottom: 0,
    margin: SIZES.base * 2,
    //borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.black,
    borderTopWidth: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 16,
    height: '88%',
    
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bottomSheetText: {
    fontSize: 16,
    marginBottom: 16,
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  buttonSuccess:{
    backgroundColor: COLORS.darkgreen
  },
  buttonError:{
    backgroundColor: COLORS.peach
  },
  imgOwner:{
    width: 100,
    height: 100,
    borderRadius:50,
  },
  contentTitle: {
    fontSize: 13,
    color: COLORS.peach
  },
  columnMembre1: {
    //flex: 1, // Takes 50% width
    marginRight: 8, // Adjust the margin as needed
    paddingVertical:8,
    alignItems:'center',
    justifyContent: 'center'   
  },
  contactButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  contactButton2: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Details;
