import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MonsterContext, monsterAction } from "../../Contexts/MonsterContext";
import { theme } from "../../global";
import { bodySets, Body, bodyImage } from "../../global";
import Monster from "../Monster";

import clothesHanger from "../../assets/resources/images/ClothesHanger.svg";

import PrimaryButton from "../Button";
import LeftBackground from "../../assets/resources/images/Bedroom-Left.svg";
import RightBackground from "../../assets/resources/images/Bedroom-Right.svg";
import Sleep from "../../assets/resources/images/sleep.svg";
import BedroomTopView from "../../assets/resources/images/BedroomTopView.svg";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";


// Bedroom group stack provider:
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { AttributesContext } from "../../Contexts/AttributeContext";
import MoodContext from "../../Contexts/MoodContext";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useLoadFonts } from "../LoadFonts";
import Rive, { } from "rive-react-native";
import { ColorContext } from "../../Contexts/ColorContext";

function Bedroom({navigation}: {navigation: any}) {
  const { monster, monsterDispatch } = useContext(MonsterContext);
  const { attributes, attributesDispatch } = useContext(AttributesContext);
  const { mood, setMood } = useContext(MoodContext);

  const { color, setColor, colorTheme } = useContext(ColorContext); 
  
  // useEffect(() => {
  //   if (setMood)
  //     setMood("happy");
  // }, [])

  const [ turned, setTurned ] = useState(false);
  const [ sleeping, setSleeping ] = useState(false);
  
  // useEffect(() => {
  //   if (monsterDispatch) {
  //     const action: monsterAction = {
  //       bodyParts: bodySets[1].bodyparts,
  //       bodyImage: bodyImage,
  //       body: monster,
  //     };
  //     monsterDispatch(action);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (attributes && attributesDispatch && attributes.energy <= 100) {
  //     setInterval(() => {
  //       if (sleeping)
  //         attributesDispatch({ attribute: "energy", operation: "+", perk: 1 });
  //     }, 2000)
  //   }
  // }, [])

  const topViewOffset = useSharedValue(500);
  const topViewAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: topViewOffset.value
    }
  })

  const monsterOffsetY = useSharedValue(0);
  const monsterAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: monsterOffsetY.value
    }
  })

  const AnimateTopView = (topViewValue: number, monsterValue: number) => {
    topViewOffset.value = withTiming(topViewValue, { duration: 1000, easing: Easing.inOut(Easing.quad) })
    monsterOffsetY.value = withTiming(monsterValue, { duration: 1000, easing: Easing.inOut(Easing.quad) })
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: sleeping ? "white" : "#4D4752" }]}>Bedroom</Text>
        <Animated.View style={[styles.monster, monsterAnimatedStyle]}>
          {monster ? (
            <Monster scaleFactor={0.3} state={`
              ${turned ? "turned" : ""}
              ${sleeping ? "sleeping" : ""}
              `} />
          ) : null}
        </Animated.View>
        <Animated.View style={[styles.bedroomTopView, topViewAnimatedStyle]}>
          <BedroomTopView width="100%" height="100%" />
        </Animated.View>
        <View style={[styles.background]}>
          <View style={styles.topLeft}>
            <LeftBackground preserveAspectRatio="XMinYMin Slice" width="100%" height="60%" style={[styles.leftImage, styles.topImage]}/>
          </View>
          <View style={styles.topRight}>
            <RightBackground
              style={[styles.rightImage, styles.topImage]}
            ></RightBackground>
          </View>
        </View>
        <View style={[styles.nightOverlay, { opacity: sleeping ? 0.98 : 0 }]}/>
      </View>
      <View style={styles.bottom}>
        <View style={[styles.column]}>
          <PrimaryButton
            Image={Sleep}
            width={Dimensions.get("window").width * 0.4}
            height={114}
            buttonInnerStyles={styles.bottomButton}
            imageInnerStyles={styles.buttonImage}
            onPress={() => {
              // Shows the monsters eyes opening after lights turn on
              if (setMood) {
                if (!sleeping) {
                  AnimateTopView(0, -50)
                  setTimeout(() => {
                    setMood("Sleeping");
                    setTimeout(() => {
                      setSleeping(!sleeping);
                    }, 2000);
                  }, 1000)
                }
                else { // Sleeping was true
                  setSleeping(!sleeping);
                  setTimeout(() => {
                    AnimateTopView(500, 0)
                    setTimeout(() => {
                      setMood("");
                    }, 1000);
                  }, 1000);
                }
              }
              // setTimeout(() => {
              //   setSleeping(!sleeping);
              // }, 2000);
            }}
            fill={colorTheme.theme.interactionShadow}
          />
          <Text style={styles.buttonText}>Sleep</Text>
        </View>
        <View style={[styles.column]}>
          <PrimaryButton
            Image={clothesHanger}
            width={Dimensions.get("window").width * 0.4}
            height={114}
            buttonInnerStyles={styles.bottomButton}
            imageInnerStyles={styles.buttonImage}
            onPress={() => {
              console.log('Navigating...')
              navigation.navigate("LockerRoom");
            }}
            fill={colorTheme.theme.interactionShadow}
          />
          <Text style={styles.buttonText}>Dressing{"\n"} Room</Text>
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
    transform: [{ scale: 0.7 }, { translateY: 20 }],
    zIndex: 2,
    marginTop: "auto",
    height: Dimensions.get("window").height * 0.35,
    resizeMode: "contain",
    position: "relative",
  },
  bedroom: {
    position: "absolute",
    top: -150,
    width: "100%",
    zIndex: -1,
  },
  container: {
    position: "relative",
    // flex: 1,
    height: "90%",
  },
  top: {
    position: "relative",
    flex: 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    zIndex: 100,
    fontSize: 30,
    marginTop: Dimensions.get("window").height * 0.03,
    fontFamily: 'Poppins_900Black'
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
    // maxHeight: Dimensions.get("window").width,
    width: "100%",
    height: "100%",

    zIndex: 0,
  },
  bedroomTopView: {
    position: "absolute",
    backgroundColor: "white",
    left: 0,
    right: -12,
    width: "105%",
    height: "100%",
    zIndex: 1,
  },
  background: {
    position: "absolute",
    bottom: 0,
    height: Dimensions.get("window").height,
    width: "100%",
  },
  leftImage: {
  },
  rightImage: {
    // right: 0,
    // bottom: -13,
  },
  topLeft: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    position: "absolute",
    width: "80%",
    height: "100%",
    left: 0,
    bottom: 0,
  },
  topRight: {
    position: "absolute",
    right: 0,
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
    paddingBottom: 10,
    borderTopWidth: 3,
    borderColor: "#E5E7EB",
  },
  bottomButton: {
    position: "relative",
  },
  buttonText: {
    color: theme.default.typographyDark,
    fontSize: 20,
    fontFamily: "Poppins_900Black",
    textAlign: "center",
    lineHeight: 22
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
  nightOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    zIndex: 10,
  },
});

export default Bedroom;
function setState(arg0: boolean): { turned: any; setTurned: any; } {
  throw new Error("Function not implemented.");
}

