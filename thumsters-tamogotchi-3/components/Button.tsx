import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { theme } from "../global";

interface Props {
  title?: string;
  image?: ImageSourcePropType;
  onPress?: (event: GestureResponderEvent) => void;
  width?: number;
  height?: number;
  key?: number; // for when the component is being called from a loop
  buttonInnerStyles: StyleProp<ViewStyle>;
  imageInnerStyles?: StyleProp<ImageStyle>;
  selectable?: boolean; // Changes the style
  activeIndex: number;
  index: number; // The index of the button in the list of buttons
}

const PrimaryButton = ({ title, image, onPress, width, height, buttonInnerStyles, imageInnerStyles, selectable = false, activeIndex, index }: Props) => {
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    if (selectable) {
      if (activeIndex === index) {
        setActive(true);
      } else {
        setActive(false);
      }
    }
  }, [activeIndex])
  
  
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
      top: (!active)? -5.5 : 0,
      backgroundColor: theme.default.backgroundColor,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.default.interactionShadow,
      fontWeight: "800",
    },

  });

  return (
    <TouchableOpacity
      style={[styles.button, buttonInnerStyles]}
      onPress={onPress ? onPress : () => {}}
    >
      <View style={styles.shadow} />
      <View style={styles.main}>
        {title !== undefined ? (
          <Text style={styles.buttonText}>{title}</Text>
        ) : image !== undefined ? (
          <Image style={imageInnerStyles} source={image}></Image>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
