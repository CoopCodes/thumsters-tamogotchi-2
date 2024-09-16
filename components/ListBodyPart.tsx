import { useRef, useState, useContext } from "react";
import Node from "../assets/resources/Monsters/1/Nodenode.svg";

import { BodyPart, theme, OnRemoveType, nodeRangeThreshold, vw, ChangeBodyPart } from "../global";
import { Animated, PanResponder, View, Image, StyleSheet, ViewStyle, StyleProp, Pressable, GestureResponderEvent } from "react-native";
import { MonsterContext } from "../Contexts/MonsterContext";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import Rive, { Fit } from "rive-react-native";
import { runOnJS } from "react-native-reanimated";

interface Props {
  bodypart: BodyPart;
  OnRemove: OnRemoveType;
  // OnPress: ChangeBodyPart;
  OnPressIn: (e: GestureResponderEvent) => void;
  // OnPress: React.Dispatch<React.SetStateAction<BodyPart | undefined>>;
}

const ListBodyPart = ({ bodypart, OnPressIn }: Props) => {
  let bodyPartReflected: "left" | "right" | "" = (bodypart.category === undefined || ["Eyes", "Mouth", "Head", "Body"].includes(bodypart.category))? "" : !bodypart.reflected ? "right" : "left";

  return (
    <Pressable
      style={[
        styles.parent,
        {
          backgroundColor: bodypart.badContrast ? "white" : "transparent",
        }
      ]}
      onPressIn={(e: GestureResponderEvent) => {
        OnPressIn(e)
      }}
    >
      <Rive
        style={
          {
            width: vw(33),
            height: "100%",
            transform: [{ scaleX: bodypart.reflected ? -1 : 1 }],
            
            position: 'relative',
            zIndex: 10,
            overflow: "visible",
            top: 'auto',
            bottom: 0,
            pointerEvents: "none" // DO NOT REMOVE, YOU WILL BE ANNIHILATED
          }
        }
        fit={Fit.Contain}
        resourceName="monster"
        artboardName={bodypart.artboardName}
        autoplay={false}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  parent: {
    borderRadius: 20,
    marginRight: 20,
    overflow: "visible",
  },
  image: {
    position: 'relative',
    zIndex: 10,
    overflow: "visible",
    top: 'auto',
    bottom: 0,
    objectFit: 'contain'
  },
});

export default ListBodyPart;
