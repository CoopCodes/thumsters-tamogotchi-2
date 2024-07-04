import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
} from "react-native";
import { MonsterContext, monsterAction } from "../../Contexts/MonsterContext";
import { theme } from "../../global";
import { bodySets, bodyImage } from "../../global";
import Monster from "../Monster";
import clothesHanger from "../../assets/resources/images/ClothesHanger.png";
import PrimaryButton from "../Button";
import leftBackground from "../../assets/resources/images/Bedroom-Left.png";
import rightBackground from "../../assets/resources/images/Bedroom-Right.png";
import { useLoadFonts } from "../../global";
import { NavigationContainer } from "@react-navigation/native";
import Toilet from "../../assets/resources/images/Toilet.png";
import Sink from "../../assets/resources/images/Sink.png";
import Shelf from "../../assets/resources/images/BathroomShelf.png";
import Sponge from "../../assets/resources/images/Sponge.png";
// Bedroom group stack provider:
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import LockerRoom from "./LockerRoom";
import Animated from "react-native-reanimated";

// Import or define your screen components

const Bathroom = ({ navigation }) => {
  const { monster, monsterDispatch } = useContext(MonsterContext);
  const [position, setPosition] = useState({ x: 280, y: 83 });
  const [originalPosition] = useState({ x: 280, y: 83 });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        setPosition({
          x: gestureState.moveX - 25, // Adjust for the center of the sponge
          y: gestureState.moveY - 120, // Adjust for the center of the sponge
        });
        console.log(gestureState.moveX, gestureState.moveY)
      },
      onPanResponderRelease: () => {
        setPosition(originalPosition);
      },
      
    })
  ).current;

  useEffect(() => {
    if (monsterDispatch) {
      const action: monsterAction = {
        bodyParts: bodySets[1].bodyparts,
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
        <Text style={styles.title}>Bathroom</Text>
        <View style={styles.monster}>
          {monster ? (
            <Monster scaleFactor={0.3} monsterBody={monster} mood={""} />
          ) : null}
        </View>
        <Animated.View
              {...panResponder.panHandlers}
              style={[styles.sponge, { top: position.y, left: position.x }]}
            >
              <Image source={Sponge} style={styles.spongeImage} />
            </Animated.View>
        <View style={styles.background}>
          <View style={styles.topLeft}>
            <Image style={[styles.shelf, styles.topImage]} source={Shelf} />
            
            <Image style={[styles.leftImage, styles.topImage]} source={Toilet} />
          </View>
          <View style={styles.topRight}>
            <Image style={[styles.rightImage, styles.topImage]} source={Sink} />
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={[styles.column]}></View>
        <View style={[styles.column]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  monster: {
    transform: [{ scale: 0.7 }, { translateY: 10 }],
    zIndex: 2,
    marginTop: "auto",
    height: Dimensions.get("window").height * 0.35,
    resizeMode: "contain", // change as needed
  },
  Bathroom: {
    position: "absolute",
    top: -150,
    width: "100%",
    zIndex: -1,
  },
  container: {
    height: "90%",
  },
  top: {
    position: "relative",
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
    fontFamily: "Poppins-ExtraBold",
  },
  topImage: {
    position: "relative",
    marginTop: 20,
    maxHeight: Dimensions.get("window").width,
    zIndex: 0,
    objectFit: "contain",
  },
  background: {
    position: "absolute",
    bottom: 0,
    height: Dimensions.get("window").height,
    width: "100%",
    backgroundColor: "white",
  },
  sponge: {
    position: "absolute",
    top: -156,
    right: 26,
    zIndex: 50,
  },
  spongeImage: {
    width: 52, // Adjust the width as necessary
    height: 22, // Adjust the height as necessary
    zIndex: 50
  },
  shelf: {
    right: 50,
    top: -100,
  },
  leftImage: {
    left: -60,
    height: 160,
  },
  rightImage: {
    right: 40,
    bottom: -1,
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
    fontFamily: "Poppins-ExtraBold",
  },
  buttonImage: {
    width: "50%",
    height: "50%",
    objectFit: "contain",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 20,
  },
});

export default Bathroom;
