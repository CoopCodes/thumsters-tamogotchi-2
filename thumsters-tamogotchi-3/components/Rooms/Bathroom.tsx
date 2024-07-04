import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
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
import Toilet from "../../assets/resources/images/Toilet.svg";
import Sink from "../../assets/resources/images/Sink.svg";
import Shelf from "../../assets/resources/images/BathroomShelf.svg";
import Sponge from "../../assets/resources/images/Sponge.svg";
import SoapSponge from '../../assets/resources/images/SoapSponge.svg'
import Reflection from '../../assets/resources/images/ProgressReflection.svg'
// Bedroom group stack provider:
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import LockerRoom from "./LockerRoom";

// Import or define your screen components


const Bathroom = ({  }) => {
  const { monster, monsterDispatch } = useContext(MonsterContext);
  const [position, setPosition] = useState({ x: 280, y: 294 });
  const [progressWidth, setProgressWidth] = useState(new Animated.Value(31));
  const [hitBoxPosition, setHitBoxPosition] = useState({ x: 102, y: 0 });
  const [hitBoxDimensions, setHitBoxDimensions] = useState({ width: 150, height: 245 });

  const maxProgressWidth = 280;
  const minProgressWidth = 31;

  const increaseProgress = () => {
    Animated.timing(progressWidth, {
      toValue: maxProgressWidth,
      duration: 10000, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
  };

  const decreaseProgress = () => {
    Animated.timing(progressWidth, {
      toValue: minProgressWidth,
      duration: 40000, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
  };

 const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = {
        x: gestureState.moveX - 25, // Adjust for the center of the sponge
        y: (Dimensions.get("window").height - gestureState.moveY) - 345, // Adjust for the center of the sponge
      };
      setPosition(newPosition);

      // Check if sponge is over hitBox
      if (
        newPosition.x >= hitBoxPosition.x &&
        newPosition.x <= hitBoxPosition.x + hitBoxDimensions.width &&
        newPosition.y >= hitBoxPosition.y &&
        newPosition.y <= hitBoxPosition.y + hitBoxDimensions.height
      ) {
        increaseProgress(); // If inside hitbox, increase progress
      } else {
        decreaseProgress(); // Otherwise, decrease progress
      }
    },
    onPanResponderRelease: () => {
      setPosition(position)
      decreaseProgress(); // Stop progress when touch is released
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
        <View
          style={styles.monster}
          id="hitBox"
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setHitBoxPosition({ x: layout.x, y: layout.y });
            setHitBoxDimensions({ width: layout.width, height: layout.height });
          }}
        >
          {monster ? (
            <Monster scaleFactor={0.3} monsterBody={monster}  />
          ) : null}
        </View>
        <View
          {...panResponder.panHandlers}
          style={[styles.sponge, { bottom: position.y, left: position.x }]}
        >
          <Sponge style={styles.spongeImage} />
        </View>
        <View style={styles.background}>
          <View style={styles.topLeft}>
            <Shelf style={[styles.shelf, styles.topImage]} />
            <Toilet style={[styles.leftImage, styles.topImage]}  />
          </View>
          <View style={styles.topRight}>
            <Sink style={[styles.rightImage, styles.topImage]}  />
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.cleanProgress}>
          <SoapSponge />
          <View style={styles.progressMould}>
            <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
              <Reflection style={styles.reflection}/>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reflection: {},

  progressBar: {
    height: 38,
    backgroundColor: '#54AAFF',
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: 5,
  },

  cleanProgress: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    justifyContent: 'center',
    paddingBottom: 100
  },

  progressMould: {
    width: 280,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#D9D9D9'
  },

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
    // top: -156,
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
