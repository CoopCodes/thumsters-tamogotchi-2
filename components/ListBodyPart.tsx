import { useRef, useState, useContext } from "react";
import { BodyPart, theme, OnRemoveType, nodeRangeThreshold, vw, ChangeBodyPart } from "../global";
import { Animated, PanResponder, View, Image, StyleSheet, ViewStyle, StyleProp, Pressable, GestureResponderEvent } from "react-native";
import { MonsterContext } from "../Contexts/MonsterContext";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import Rive, { Fit } from "rive-react-native";

interface Props {
  bodypart: BodyPart;
  OnRemove: OnRemoveType;
  // OnPress: ChangeBodyPart;
  OnPressIn: (e: GestureResponderEvent) => void;
  // OnPress: React.Dispatch<React.SetStateAction<BodyPart | undefined>>;
}

const ListBodyPart = ({ bodypart, OnPressIn }: Props) => {
  // console.log([
  //   100 * bodypart.aspectRatio[0],
  //   100 * bodypart.aspectRatio[1],
  // ])

  let bodyPartReflected: "left" | "right" | "" = (bodypart.category === undefined || ["Eyes", "Mouth", "Head", "Body"].includes(bodypart.category))? "" : (!(bodypart.node.length <= 3 ? false : true))? "right" : "left";
  // console.log(bodyPartReflected)

  return (
    <Pressable
      style={[
        styles.parent,
        {
          height: 100 * bodypart.aspectRatio[1],
        },
      ]}
      // onPress={() => {
      //   OnPress(bodypart, bodyPartReflected);
      //   console.log("PRESSED: ", bodypart);
      // }}
      onPressIn={(e: GestureResponderEvent) => OnPressIn(e)}
    >
      {/* Checks whether it is on the left or right */}
      {(typeof bodypart.image === "string") ? (
        <Rive
          style={
            {
              width: vw(33),
              height: "100%",
              transform: [{ scaleX: bodypart.node.length >= 3 ? -1 : 1 }],
              
              position: 'relative',
              zIndex: 10,
              overflow: "visible",
              top: 'auto',
              bottom: 0,
            }
          }
          fit={Fit.Contain}
          resourceName="body1"
          artboardName={bodypart.image}
          autoplay={false}
        />
      ) : (
        <bodypart.image
          style={[
            {
              width: vw(33),
              height: "100%",
              transform: [{ scaleX: bodypart.node.length >= 3 ? -1 : 1 }],
            },
            styles.image,
          ]}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  parent: {
    backgroundColor: "white",
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
