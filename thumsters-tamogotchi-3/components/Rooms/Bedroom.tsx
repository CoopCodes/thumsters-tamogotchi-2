import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { MonsterContext, monsterAction } from "../../Contexts/MonsterContext";
import { theme } from "../../global";
import { bodysInfo, Body, bodyImage } from "../../global";
import Monster from "../Monster";
import clothesHanger from "../../assets/resources/images/ClothesHanger.png";
import PrimaryButton from "../Button";
import leftBackground from "../../assets/resources/images/Bedroom-Left.png";
import rightBackground from "../../assets/resources/images/Bedroom-Right.png";
import { useLoadFonts } from "../../global";
import { NavigationContainer } from "@react-navigation/native";


// Bedroom group stack provider:
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import LockerRoom from "./LockerRoom";

// Import or define your screen components

const HomeStack = createStackNavigator();

interface HomeStackProps {
  removeAttributesBar: () => void;
}

function HomeStackScreen({ removeAttributesBar }: HomeStackProps) {
  return (
    <NavigationContainer>
      <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={Bedroom} />
        <HomeStack.Screen name="LockerRoom" component={LockerRoom} initialParams={{
          removeAttributesBar: removeAttributesBar
        }}/>
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

function Bedroom({navigation}: {navigation: any}) {
  const { monster, monsterDispatch } = useContext(MonsterContext);
  useEffect(() => {
    if (monsterDispatch) {
      const action: monsterAction = {
        bodyParts: bodysInfo[1].bodyparts,
        bodyImage: bodyImage,
        body: monster,
      };
      monsterDispatch(action);
    }
  }, []);

  const fontInfo = useLoadFonts();
  if (!fontInfo?.fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Bedroom</Text>
        <View style={styles.monster}>
          {monster ? (
            <Monster scaleFactor={0.3} monsterBody={monster} mood={""} />
          ) : null}
        </View>
        <View style={styles.background}>
          <View style={styles.topLeft}>
            <Image
              style={[styles.leftImage, styles.topImage]}
              source={leftBackground}
            ></Image>
          </View>
          <View style={styles.topRight}>
            <Image
              style={[styles.rightImage, styles.topImage]}
              source={rightBackground}
            ></Image>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={[styles.column]}>
          <PrimaryButton
            image={clothesHanger}
            width={Dimensions.get("window").width * 0.4}
            height={114}
            buttonInnerStyles={styles.bottomButton}
            imageInnerStyles={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Dressing Room</Text>
        </View>
        <View style={[styles.column]}>
          <PrimaryButton
            image={clothesHanger}
            width={Dimensions.get("window").width * 0.4}
            height={114}
            buttonInnerStyles={styles.bottomButton}
            imageInnerStyles={styles.buttonImage}
            onPress={() => {
              console.log('Navigating...')
              navigation.navigate("LockerRoom");
            }}
          />
          <Text style={styles.buttonText}>Dressing Room</Text>
        </View>
      </View>
      {/* <View style={styles.monster}>
          {monster ? (
            <Monster scaleFactor={0.3} monsterBody={monster} mood={""} />
          ) : null}
        </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  monster: {
    transform: [{ scale: 0.7 }, { translateY: -43 }],
    zIndex: 2,
    marginTop: "auto",
    height: Dimensions.get("window").height * 0.35,
    resizeMode: "contain", // change as needed
  },
  bedroom: {
    position: "absolute",
    top: -150,
    width: "100%",
    zIndex: -1,
  },
  container: {
    // flex: 1,
    height: "90%",
  },
  top: {
    flex: 1.5,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    zIndex: 2,
    fontSize: 25,
    fontWeight: "800",
    color: "#4D4752",
    marginTop: Dimensions.get("window").height * 0.03,
    fontFamily: "Poppins-ExtraBold"
  },
  // monster: {
  //   marginTop: "auto",
  //   height: Dimensions.get("window").height * 0.35,
  //   resizeMode: "contain", // change as needed
  //   // backgroundColor: 'black',
  // },
  topImage: {
    position: "relative",
    marginTop: 20,
    // height: Dimensions.get("window").width * 0.5,
    maxHeight: Dimensions.get("window").width,
    zIndex: 0,
    objectFit: "contain"
  },
  background: {
    position: "absolute",
    bottom: 0,
    height: Dimensions.get("window").height,
    width: "100%",
    backgroundColor: "white",
  },
  leftImage: {
    // left: 0,
  },
  rightImage: {
    // right: 0,
    // bottom: -13,
  },
  topLeft: {
    position: "absolute",
    right: -100,
    bottom: 0,
  },
  topRight: {
    position: "absolute",
    left: 50, // Dunno why this is working it shouldn't
    bottom: 0,
  },
  bottom: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
    paddingTop: Dimensions.get("window").height * 0.05,
    borderTopWidth: 3,
    borderColor: "#E5E7EB",
  },
  bottomButton: {
    position: "relative",
  },
  buttonText: {
    fontWeight: "800",
    color: theme.default.typographyDark,
    fontSize: 20,
    fontFamily: "Poppins-ExtraBold"
  },
  buttonImage: {
    width: "50%",
    height: "50%",
    objectFit: "contain"
  },
  column: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 20,
  },
});

export default Bedroom;
