import { useRef, useState, useContext } from "react";
import { BodyPart, theme, OnRemoveType, nodeRangeThreshold, vw, ChangeBodyPart } from "../global";
import { Animated, PanResponder, View, Image, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { MonsterContext } from "../Contexts/MonsterContext";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  bodypart: BodyPart;
  OnRemove: OnRemoveType;
  OnPress: ChangeBodyPart;
  // OnPress: React.Dispatch<React.SetStateAction<BodyPart | undefined>>;
}

const ListBodyPart = ({ bodypart, OnPress }: Props) => {
  // console.log([
  //   100 * bodypart.aspectRatio[0],
  //   100 * bodypart.aspectRatio[1],
  // ])

  let bodyPartReflected: "left" | "right" | "" = (bodypart.category === undefined || ["Eyes", "Mouth", "Head", "Body"].includes(bodypart.category))? "" : (!bodypart.reflected)? "right" : "left";
  // console.log(bodyPartReflected)

  return (
    <View>
      <GestureHandlerRootView>
          <TouchableOpacity style={[styles.parent, {
            height: 100 * bodypart.aspectRatio[1]
          }]} onPress={() => { OnPress(bodypart, bodyPartReflected); console.log("PRESSED: ", bodypart) }}>{/* Checks whether it is on the left or right */}
              <bodypart.image
                style={[
                  {
                    width: vw(33),
                    height: '100%',
                    transform: [{ scaleX: (bodypart.reflected)? -1 : 1 }],
                  },
                  styles.image,
                ]}
                // source={
                //   (!bodypart.badContrast)? 
                //     bodypart.image : 
                //     (bodypart.imageBadContrast !== undefined)?
                //       bodypart.imageBadContrast : bodypart.image
                // }
              />
          </TouchableOpacity>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    // backgroundColor: "white",
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
