import { useRef, useState, useContext } from "react";
import { BodyPart, theme, OnRemoveType, nodeRangeThreshold, vw } from "../global";
import { Animated, PanResponder, View, Image, StyleSheet } from "react-native";
import { MonsterContext } from "../Contexts/MonsterContext";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  bodypart: BodyPart;
  OnRemove: OnRemoveType;
  OnPress: React.Dispatch<React.SetStateAction<BodyPart | undefined>>;
}

const ListBodyPart = ({ bodypart, OnPress }: Props) => {
  // console.log([
  //   100 * bodypart.aspectRatio[0],
  //   100 * bodypart.aspectRatio[1],
  // ])
  return (
    <GestureHandlerRootView>
      <TouchableOpacity style={[styles.parent, {
        height: 100 * bodypart.aspectRatio[1],
        // backgroundColor: 'black'
      }]} onPress={() => { OnPress(bodypart); console.log(bodypart + " listbodypart was pressed") }}>
          <Image
            style={[
              {
                width: vw(33),
                height: '100%',
              },
              styles.image,
            ]}
            source={
              (!bodypart.badContrast)? 
                bodypart.image : 
                (bodypart.imageBadContrast !== undefined)?
                  bodypart.imageBadContrast : bodypart.image
            }
          />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  parent: {
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
