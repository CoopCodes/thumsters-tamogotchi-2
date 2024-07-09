import React, { Component, useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  ImageStyle,
  Pressable,
} from "react-native";
import { theme } from "../global";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  AnimationCallback,
  runOnJS,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

interface Props {
  title?: string;
  Image?: React.FC<SvgProps>;
  onPress?: (event: GestureResponderEvent) => void;
  width?: number;
  height?: number;
  key?: number; // for when the component is being called from a loop
  buttonInnerStyles: StyleProp<ViewStyle>;
  imageInnerStyles?: StyleProp<ImageStyle>;
  selectable?: boolean; // Changes the style
  activeIndex?: number;
  index?: number; // The index of the button in the list of buttons
  fill?: string;
}

const PrimaryButton = ({
  title,
  Image,
  onPress,
  width,
  height,
  buttonInnerStyles,
  imageInnerStyles,
  selectable = false,
  activeIndex,
  index,
  fill = ""
}: Props) => {
  const [active, setActive] = useState(false);

  const buttonOffset = useSharedValue(-5.5);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: buttonOffset.value,
    };
  });

  const AnimateButton = (amount: number, finished?: AnimationCallback) => {
    buttonOffset.value = withSpring(amount, {
      duration: 500,
      dampingRatio: .6,
      stiffness: 100,
    }, finished);
  }

  async function OnPressHandler (event: GestureResponderEvent) {
    if (!selectable) {
      AnimateButton(0);
      setTimeout(() => {
        AnimateButton(-5.5);
      }, 500)
    }
    if (onPress) {
      onPress(event);
    }
  };

  useEffect(() => {
    if (selectable) {
      if (activeIndex === index) {
        setActive(true);
        AnimateButton(0);
      } else {
        setActive(false);
        AnimateButton(-5.5);
      }
    }
  }, [activeIndex]);

  const styles = StyleSheet.create({
    button: {
      minWidth: width,
      height: height,
      justifyContent: "center",
    },
    shadow: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 5,
      backgroundColor: theme.default.interactionShadow,
    },
    main: {
      ...StyleSheet.absoluteFillObject,
      position: "relative",
      borderRadius: 5,
      // top: (!active)? -5.5 : 0,
      backgroundColor: theme.default.backgroundColor,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.default.interactionShadow,
      fontFamily: "Poppins_900Black",
    },
  });

  return (
    <Pressable
      style={[styles.button, buttonInnerStyles]}
      onPress={OnPressHandler}
    >
      <View style={styles.shadow} />
      <Animated.View style={[styles.main, animatedStyle]}>
        {title !== undefined ? (
          <Text style={styles.buttonText}>{title}</Text>
        ) : Image !== undefined ? (
          // <Image style={imageInnerStyles} source={image}></Image>
          <Image style={imageInnerStyles} fill={fill}/>
        ) : (
          <></>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default PrimaryButton;
