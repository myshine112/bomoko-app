import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FAB } from 'react-native-paper';

import { COLORS, FONTS, SIZES, icons, images } from '../constants';

import { VictoryPie } from 'victory-native';
import { Svg } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, Card, Modal, Text as MText } from 'react-native-paper';
import { loadCategoriesFromStorage, resetAllCat } from '../redux/catReducer';

const Home = ({ navigation }) => {
  const catList = useSelector((state) => state.categories.categories);
  //console.log('catList', catList);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  const [Cat, setCat] = useState('income');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [visible, setVisible] = useState(false);

  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    //padding: 20,
    width: '85%',
    borderRadius: 10,
    alignSelf: 'center',
  };

  // SELECTED ITEM
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // updatedAsyncStorage();

    setCategories(catList.filter((value, key) => value.cat === 'income'));
    setCat('income');
  }, [catList]);
  const [date, setDate] = useState(new Date());

  const updatedAsyncStorage = async () => {
    dispatch(loadCategoriesFromStorage());
    console.log('test1', catList);
    console.log('test', [].length);
  };

  function renderNavBar() {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingTop: SIZES.base * 5,
          justifyContent: 'space-between',
          //alignItems: 'flex-end',
          paddingHorizontal: SIZES.padding,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{
              //width: 80,
              //justifyContent: 'center',
              //backgroundColor: COLORS.white,
              //borderRadius: 30,
              paddingRight: SIZES.base * 2,
            }}
            onPress={() => {
              console.log('Menu');
              //navigation.navigate(AuthScreen);
              navigation.openDrawer();
            }}
          >
            <Image
              source={icons.menu}
              style={{
                width: SIZES.base * 4,
                height: SIZES.base * 3,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>

          <Text style={{ color: COLORS.white, ...FONTS.h2 }}>African Fintech</Text>
        </View>

        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'flex-end', width: 50 }}
          onPress={() => console.log('search')}
        >
          <Image
            source={icons.search}
            style={{
              width: 30,
              height: 30,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderHeader() {
    return (
      <View
        style={{
          zIndex: 10,
          paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.padding / 2,
          borderBottomColor: COLORS.gray,
          borderBottomWidth: 1,
        }}
      >
        <View style={{ paddingBottom: SIZES.padding * 4 }}>
          <Text style={{ ...FONTS.h3, color: COLORS.gray }}>(Portefeuil electronique)</Text>
        </View>

        <View
          style={{
            margin: SIZES.padding,
            zIndex: 10,
            position: 'absolute',
            top: SIZES.padding * 1.4,
            width: '100%',
            backgroundColor: COLORS.secondary,
            paddingTop: SIZES.padding,
            borderRadius: SIZES.radius,
            ...styles.shadow,
          }}
        >
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
            {renderIncomingExpensesTitle('income')}
            {renderIncomingExpensesTitle('expense')}
          </View>

          <View
            style={{
              borderTopWidth: 1,
              width: '95%',
              alignSelf: 'center',
              marginVertical: SIZES.padding / 2,
              borderColor: COLORS.white,
            }}
          >
            <View
              style={{ marginHorizontal: SIZES.padding / 1, marginVertical: SIZES.padding / 2 }}
            >
              <Text style={{ color: COLORS.white, ...FONTS.body5 }}>
                BALANCE TOTALE AU {date.toLocaleDateString('fr-FR')}
              </Text>
              <Text style={{ ...FONTS.h2, color: COLORS.lightGray }}>{totalSumDC()} USD</Text>
            </View>
          </View>
        </View>

        {/* <View style={{ flexDirection: 'row', marginTop: SIZES.padding, alignItems: 'center' }}>
                    <View style={{
                        backgroundColor: COLORS.lightGray,
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={icons.calendar}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.lightBlue
                            }}
                        />
                    </View>

                    <View style={{ marginLeft: SIZES.padding }}>
                        <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>{date.toLocaleDateString('fr-FR')}</Text>
                        <Text style={{ ...FONTS.body3, color: COLORS.darkgray }}>18% plus que le mois passé</Text>
                    </View>
                </View> */}
      </View>
      // </>
    );
  }

  function renderCategoryHeaderSection() {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: SIZES.padding,
          paddingTop: SIZES.padding * 4.5 + SIZES.padding,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.lightGray2,
          // zIndex: -10,
        }}
      >
        {/* Title */}
        <View>
          <Text
            style={{ color: Cat == 'expense' ? COLORS.secondary : COLORS.darkgreen, ...FONTS.h3 }}
          >
            {Cat == 'income' ? 'Crédit (Entrée)' : 'Débit (Sortie)'}
          </Text>
          <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>{totalSum()} USD</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Cat == 'income' ? COLORS.darkgreen : null,
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
            onPress={() => {
              setCat('income');
              setCategories(catList.filter((value, key) => value.cat === 'income'));
              setSelectedCategory(null);
            }}
          >
            <Image
              source={icons.income}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: Cat == 'income' ? COLORS.white : COLORS.darkgray,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Cat == 'expense' ? COLORS.secondary : null,
              height: 50,
              width: 50,
              borderRadius: 25,
              marginLeft: SIZES.base,
            }}
            onPress={() => {
              setCat('expense');
              setCategories(catList.filter((value, key) => value.cat === 'expense'));
              setSelectedCategory(null);
            }}
          >
            <Image
              source={icons.expense}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: Cat == 'expense' ? COLORS.white : COLORS.darkgray,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderCategoryList() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          setSelectedCategory(item);
          //console.log(item)
        }}
        style={{
          flex: 1,
          flexDirection: 'row',
          margin: 5,
          paddingVertical: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          borderRadius: 5,
          backgroundColor: COLORS.white,
          ...styles.shadow,
        }}
      >
        <Image
          source={item.icon}
          style={{
            width: 20,
            height: 20,
            tintColor: item.color,
          }}
        />
        <Text style={{ marginLeft: SIZES.base, color: COLORS.primary, ...FONTS.h4 }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );

    return (
      <View style={{ paddingHorizontal: SIZES.padding - 5 }}>
        <Animated.View style={{}}>
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}`}
            numColumns={2}
          />
        </Animated.View>
      </View>
    );
  }

  function renderIncomingExpensesTitle(myCat) {
    return (
      <View
        style={{
          borderRadius: 8,
          height: 80,
          backgroundColor: COLORS.white,
          padding: SIZES.padding,
          elevation: 5,
        }}
      >
        {/* Title */}
        <Text style={{ ...FONTS.h3, color: COLORS.primary }}>
          {' '}
          {myCat === 'income' ? 'ENTREES' : 'SORTIES'}{' '}
        </Text>

        <Text style={{ ...FONTS.h4, color: myCat === 'income' ? COLORS.darkgreen : COLORS.red }}>
          {totalSumDCHome(myCat).toFixed(2) && totalSumDCHome(myCat).toFixed(2)} USD
        </Text>
      </View>
    );
  }

  function renderIncomingExpenses() {
    let allExpensesCat = selectedCategory ? selectedCategory.data : [];

    let incomingExpenses = allExpensesCat;

    const renderItem = (item) => (
      <TouchableOpacity
        onPress={() => {
          console.log(item);
          setSelectedItem(item);
          showModal(true);
        }}
      >
        <View
          style={{
            marginRight: SIZES.padding,
            marginLeft: SIZES.padding,
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
                <Image
                  source={selectedCategory.icon}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: selectedCategory.color,
                  }}
                />
              </View>
              <View>
                <Text style={{ ...FONTS.h3, color: selectedCategory.color }}>
                  {selectedCategory && selectedCategory.name}
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
                  {item.description}
                </Text>
              </View>
            </View>

            <View style={{ width: '25%', alignItems: 'flex-end' }}>
              <Text style={{ ...FONTS.h5, color: COLORS.red }}>
                {' '}
                {Cat === 'income' ? '+' : '-'} {item.total.toFixed(2)} USD{' '}
              </Text>
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
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <View>
        {/* {renderIncomingExpensesTitle()} */}

        {incomingExpenses.length > 0 && (
          <View>
            {incomingExpenses.map((value, key) => {
              return renderItem(value, key);
            })}
          </View>
        )}

        {incomingExpenses.length == 0 && renderAllIncomingExpenses()}
      </View>
    );
  }

  function renderAllIncomingExpenses() {
    var fin = [];
    let category = categories.map((v, k) => {
      var el = v.data.map((vv, kk) => {
        return { ...vv, cat: v.cat, color: v.color, icon: v.icon, id: 1, name: v.name };
      });
      fin.push(...el);
      return el[0];
    });

    let incomingExpenses = fin;

    const renderItem = (item, cat) => (
      <TouchableOpacity
        onPress={() => {
          console.log(item);
          setSelectedItem(item);
          showModal(true);
        }}
      >
        <View
          style={{
            marginRight: SIZES.padding,
            marginLeft: SIZES.padding,
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
                <Image
                  source={item.icon}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: item.color,
                  }}
                />
              </View>
              <View>
                <Text style={{ ...FONTS.h3, color: item.color }}>{item && item.name}</Text>
                <Text
                  numberOfLines={1}
                  style={{
                    overflow: 'hidden',
                    ...FONTS.body5,
                    flexWrap: 'wrap',
                    color: COLORS.darkgray,
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </View>

            <View style={{ width: '25%', alignItems: 'flex-end' }}>
              <Text style={{ ...FONTS.h5, color: COLORS.red }}>
                {' '}
                {Cat === 'income' ? '+' : '-'} {item.total.toFixed(2)} USD{' '}
              </Text>
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
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <View>
        {/* {renderIncomingExpensesTitle()} */}

        {incomingExpenses.length > 0 && (
          <View>
            {incomingExpenses.map((value, key) => {
              return renderItem(value, key);
            })}
          </View>
        )}

        {incomingExpenses.length == 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>
              Aucune {Cat == 'expense' ? 'sortie' : 'entrée'} trouvée
            </Text>
          </View>
        )}
      </View>
    );
  }

  const totalSum = () => {
    var tot = 0;
    categories.map((item) => {
      let confirm = item.data; //.filter(a => a.cat == "expense")
      var total = parseFloat(
        confirm.reduce((a, b) => parseFloat(a) + (parseFloat(b.total) || 0), 0)
      );
      tot += total;
      return total;
    });
    // console.log(tot);
    return tot;
  };

  const totalSumDC = () => {
    var totExpense = 0;
    var totIncome = 0;
    catList
      .filter((a) => a.cat == 'expense')
      .map((item) => {
        let confirm = item.data; //.filter(a => a.cat == "expense")
        var total = parseFloat(
          confirm.reduce((a, b) => parseFloat(a) + (parseFloat(b.total) || 0), 0)
        );
        totExpense += total;
        return total;
      });

    catList
      .filter((a) => a.cat == 'income')
      .map((item) => {
        let confirmI = item.data;
        var totalI = parseFloat(
          confirmI.reduce((a, b) => parseFloat(a) + (parseFloat(b.total) || 0), 0)
        );
        totIncome += totalI;
        return totalI;
      });

    return totIncome - totExpense;
  };

  const totalSumDCHome = (myCat) => {
    console.log(myCat);
    var tot = 0;
    catList
      .filter((a) => a.cat == myCat)
      .map((item) => {
        let confirm = item.data;
        var total = parseFloat(
          confirm.reduce((a, b) => parseFloat(a) + (parseFloat(b.total) || 0), 0)
        );
        tot += total;
        return total;
      });
    console.log('tot', tot);
    return tot;
  };

  function processCategoryDataToDisplay() {
    // Filter expenses with "Confirmed" status
    let chartData = categories.map((item) => {
      let confirmExpenses = item.data; //.filter(a => a.cat == "expense")
      var total = confirmExpenses.reduce((a, b) => a + (b.total || 0), 0);

      return {
        name: item.name,
        y: total,
        expenseCount: confirmExpenses.length,
        color: item.color,
        id: item.id,
      };
    });

    // filter out categories with no data/expenses
    let filterChartData = chartData.filter((a) => a.y > 0);

    // Calculate the total expenses
    let totalExpense = filterChartData.reduce((a, b) => a + (b.y || 0), 0);

    // Calculate percentage and repopulate income data
    let finalChartData = filterChartData.map((item) => {
      let percentage = ((item.y / totalExpense) * 100).toFixed(0);
      return {
        label: `${percentage}%`,
        y: Number(item.y),
        expenseCount: item.expenseCount,
        color: item.color,
        name: item.name,
        id: item.id,
      };
    });

    return finalChartData;
  }

  function setSelectCategoryByName(name) {
    let category = categories.filter((a) => a.name == name);
    setSelectedCategory(category[0]);
  }

  function renderChart() {
    let chartData = processCategoryDataToDisplay();
    let colorScales = chartData.map((item) => item.color);
    let totalExpenseCount = chartData.reduce((a, b) => a + (b.expenseCount || 0), 0);

    // console.log('Check Chart');
    //console.log(chartData)

    if (Platform.OS == 'ios') {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* <VictoryPie
                        
                        data={chartData}
                        labels={(datum) => `${datum.y}`}
                        radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? SIZES.width * 0.4 : SIZES.width * 0.4 - 10}
                        innerRadius={70}
                        labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
                        style={{
                            labels: { fill: "white",  },
                            parent: {
                                ...styles.shadow
                            },
                        }}
                        width={SIZES.width * 0.8}
                        height={SIZES.width * 0.8}
                        colorScale={colorScales}
                        events={[{
                            target: "data",
                            eventHandlers: {
                                onPress: () => {
                                    return [{
                                        target: "labels",
                                        mutation: (props) => {
                                            let categoryName = chartData[props.index].name
                                            setSelectCategoryByName(categoryName)
                                        }
                                    }]
                                }
                            }
                        }]}
    
                    /> */}

          <View style={{ position: 'absolute', top: '42%', left: '42%' }}>
            <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
            <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Credits</Text>
          </View>
        </View>
      );
    } else {
      // Android workaround by wrapping VictoryPie with SVG
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZES.width} height={SIZES.width} style={{ width: '100%', height: 'auto' }}>
            <VictoryPie
              standalone={false} // Android workaround
              data={chartData}
              labels={(datum) => `${datum.y}`}
              radius={({ datum }) =>
                selectedCategory && selectedCategory.name == datum.name
                  ? SIZES.width * 0.4
                  : SIZES.width * 0.4 - 10
              }
              innerRadius={70}
              labelRadius={({ innerRadius }) => (SIZES.width * 0.4 + innerRadius) / 2.5}
              style={{
                labels: { fill: 'white' },
                parent: {
                  ...styles.shadow,
                },
              }}
              width={SIZES.width}
              height={SIZES.width}
              colorScale={colorScales}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPress: () => {
                      return [
                        {
                          target: 'labels',
                          mutation: (props) => {
                            let categoryName = chartData[props.index].name;
                            setSelectCategoryByName(categoryName);
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </Svg>
          <View style={{ position: 'absolute', top: '42%', left: '43.5%' }}>
            <Text style={{ ...FONTS.h1, textAlign: 'center' }}>{totalExpenseCount}</Text>
            <Text style={{ ...FONTS.body2, textAlign: 'center' }}>
              {Cat == 'income' ? 'Crédits' : 'Débits'}
            </Text>
          </View>
        </View>
      );
    }
  }

  function renderExpenseSummary() {
    let data = processCategoryDataToDisplay();

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 40,
          paddingHorizontal: SIZES.radius,
          borderRadius: 10,
          backgroundColor:
            selectedCategory && selectedCategory.name == item.name ? item.color : COLORS.white,
        }}
        onPress={() => {
          let categoryName = item.name;
          setSelectCategoryByName(categoryName);
        }}
      >
        {/* Name/Category */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor:
                selectedCategory && selectedCategory.name == item.name ? COLORS.white : item.color,
              borderRadius: 5,
            }}
          />

          <Text
            style={{
              marginLeft: SIZES.base,
              color:
                selectedCategory && selectedCategory.name == item.name
                  ? COLORS.white
                  : COLORS.primary,
              ...FONTS.h3,
            }}
          >
            {item.name}
          </Text>
        </View>

        {/* Expenses */}
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={{
              color:
                selectedCategory && selectedCategory.name == item.name
                  ? COLORS.white
                  : COLORS.primary,
              ...FONTS.h3,
            }}
          >
            {item.y} USD - {item.label}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={{ padding: SIZES.padding }}>
        <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => `${item.id}`} />
      </View>
    );
  }

  return (
    <>
      <ImageBackground
        style={{ flex: 1, position: 'absolute', height: '100%', width: '100%' }}
        source={require('./../assets/login1_bg.png')}
        blurRadius={10}
      ></ImageBackground>
      <View style={{ flex: 1 }}>
        {/* Nav bar section */}
        {renderNavBar()}

        {/* Header section */}
        {renderHeader()}

        <ScrollView
          contentContainerStyle={{
            paddingBottom: 60,
            backgroundColor: COLORS.lightGray2,
            zIndex: 100,
          }}
        >
          <View>
            {/* Category Header Section */}
            {renderCategoryHeaderSection()}

            {renderExpenseSummary()}

            {/* {renderCategoryList()} */}
            {renderIncomingExpenses()}

            {renderChart()}
          </View>
        </ScrollView>
      </View>

      <Modal
        style={{ zIndex: 99 }}
        visible={visible}
        onDismiss={hideModal}
        //contentContainerStyle={containerStyle}
        contentContainerStyle={[containerStyle, { zIndex: 999 }]} // Set a higher value for the z-index
      >
        <Card style={{ padding: 10 }}>
          <Card.Title
            titleStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
            title={selectedItem && selectedItem.name}
            left={() => (
              <Image
                source={selectedItem && selectedItem.icon}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: selectedItem && selectedItem.color,
                }}
              />
            )}
          />
          <Card.Content>
            <Text variant="titleLarge">{selectedItem && selectedItem.description}</Text>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ ...FONTS.h3, color: COLORS.red }}>
                {' '}
                {Cat === 'income' ? '+' : '-'} {selectedItem && selectedItem.total.toFixed(2)} USD{' '}
              </Text>
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
                <Text style={{ marginBottom: SIZES.base, color: COLORS.darkgray, ...FONTS.h3 }}>
                  {selectedItem && selectedItem.date}
                </Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions style={{ marginTop: 15 }}>
            <Button onPress={hideModal}>Annuler</Button>
            <Button buttonColor={COLORS.red}>Modifier</Button>
          </Card.Actions>
        </Card>
      </Modal>

      <FAB.Group
        open={open}
        visible
        variant="tertiary"
        icon={open ? 'close' : 'plus'}
        actions={[
          {
            icon: 'plus-circle',
            label: 'Crédit (Entrée)',
            onPress: () => navigation.navigate('Income', { cat: catList }),
          },
          {
            icon: 'minus-circle',
            label: 'Débit (Sortie)',
            onPress: () => navigation.navigate('Expense', { cat: catList }),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
            console.log('catList', catList);
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
});

export default Home;
