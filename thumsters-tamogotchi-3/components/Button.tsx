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
}

const PrimaryButton = ({ title, image, onPress, width, height, key, buttonInnerStyles }: Props) => {
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
      top: -5.5,
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
    image: {
      width: 32,
    },
  });

  return (
    <TouchableOpacity
      key={key}
      style={[styles.button, buttonInnerStyles]}
      onPress={onPress ? onPress : () => {}}
    >
      <View style={styles.shadow} />
      <View style={styles.main}>
        {title !== undefined ? (
          <Text style={styles.buttonText}>{title}</Text>
        ) : image !== undefined ? (
          <Image style={styles.image} source={image}></Image>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
