import { useRef, useState, useContext } from "react";
import { BodyPart, theme, OnRemoveType, nodeRangeThreshold } from "../global";
import { Animated, PanResponder, View, Image, StyleSheet } from "react-native";
import { MonsterContext } from "../Contexts/MonsterContext";

interface Props {
  bodypart: BodyPart;
  OnRemove: OnRemoveType;
}

const ListBodyPart = ({ bodypart }: Props) => {
  

  return (
    <View style={styles.parent}>
      <View style={styles.main}>
        <Image
          style={[
            {
              width: `${100 * bodypart.aspectRatio[0]}%`,
              height: `${100 * bodypart.aspectRatio[1]}%`,
            },
            styles.image,
          ]}
          source={bodypart.image}
        />
      </View>
      <View style={styles.shadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: 105,
    width: 105,
    marginRight: 10,
    zIndex: 10,
    overflow: "visible",
  },
  main: {
    position: "relative",
    zIndex: 9,
    backgroundColor: theme.default.interactionPrimary,
    borderRadius: 20,
    overflow: "visible",
  },
  shadow: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: theme.default.interactionShadow,
    borderRadius: 20,
    transform: [{ translateX: 5 }, { translateY: 5 }],
    overflow: "visible",
  },
  image: {
    // position: 'absolute',

    transform: [{ scale: 0.8 }],
    zIndex: 10,
    overflow: "visible",
  },
});

export default ListBodyPart;
