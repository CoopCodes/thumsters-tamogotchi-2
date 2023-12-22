import React, { useState, useRef, useEffect, Ref, RefObject } from "react";
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleSheet,
  findNodeHandle,
} from "react-native";
import { theme, Body, bodyPartInfo, bodysInfo } from "../global";
import node from "../assets/resources/Monsters/1/Nodenode.png";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

interface Props {
  monsterBody: Body;
  mood: string;
  scaleFactor: number;
}

const Monster = ({ monsterBody, mood, scaleFactor = 0.3 }: Props) => {
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const eyesRef = useRef();
  const mouthRef = useRef();

  monsterBody.bodypartnodes.leftarm.ref = leftArmRef;
  monsterBody.bodypartnodes.rightarm.ref = rightArmRef;
  monsterBody.bodypartnodes.leftleg.ref = leftLegRef;
  monsterBody.bodypartnodes.rightleg.ref = rightLegRef;
  monsterBody.bodypartnodes.eyes.ref = eyesRef;
  monsterBody.bodypartnodes.mouth.ref = mouthRef;

  function checkBodyPart(part: string): boolean {
    return (
      part === "leftarm" ||
      part === "rightarm" ||
      part === "leftleg" ||
      part === "rightleg" ||
      part === "eyes" ||
      part === "head" ||
      part === "mouth"
    );
  }

  useEffect(() => {
    let i: number = 0;
    Object.values(monsterBody.bodypartnodes).map((bodypart: bodyPartInfo) => {
      if (
        bodypart !== undefined &&
        bodypart.ref !== undefined &&
        bodypart.ref !== null &&
        bodypart.bodyPart.node !== undefined &&
        typeof bodypart.ref === "object" &&
        bodypart.ref.current !== undefined
      ) {
        // if (checkBodyPart(potentialTitle)) {
        // }
        // Returning an array of the all the bodypart titles, as to match it with the current bodypart, and then finds the corresponding node that it should attach to on the body.
        const partTitle = Object.keys(bodysInfo[1].bodyparts)[i] as
          | "leftarm"
          | "rightarm"
          | "leftleg"
          | "rightleg"
          | "eyes"
          | "head"
          | "mouth";

        const node = bodysInfo[1].body[partTitle];
        const bodyNodeCoord: Array<number> = node !== undefined ? node : [0, 0];
        console.log(bodyNodeCoord[1] * 1 - bodypart.bodyPart.node[1] * scaleFactor)


        bodypart.ref.current.setNativeProps({
          style: {
            transform: [
              // {
              //   translateX:
              //     bodyNodeCoord[0] - bodypart.bodyPart.node[0] * scaleFactor,
              // },
              // {
              //   translateY:
              //     bodyNodeCoord[1] * 1 - bodypart.bodyPart.node[1] * scaleFactor,
              // },
              { scaleX: bodypart.bodyPart.reflected ? -1 : 1 },
              {
                scale:
                  bodypart.bodyPart.node[2] !== undefined
                    ? bodypart.bodyPart.node[2]
                    : 1,
              },
            ],
            left: Math.abs(bodyNodeCoord[0] - bodypart.bodyPart.node[0] * scaleFactor),
            top: Math.abs(bodyNodeCoord[1] * 1 - bodypart.bodyPart.node[1] * scaleFactor),
            width: bodypart.bodyPart.width * scaleFactor,
            height: bodypart.bodyPart.height * scaleFactor,
            zIndex: bodypart.bodyPart.zIndex,
          },
        });
      }
      i++;
    });
  }, [monsterBody]);

  return (
    <View style={styles.room}>
      <View style={styles.body}>
        {monsterBody.bodyImage ? (
          <Image
            style={[
              styles.bodyImage,
              {
                width: monsterBody.width * scaleFactor,
                height: monsterBody.height * scaleFactor,
                transform: [
                  { translateX: monsterBody.transforms.x * scaleFactor },
                  { translateY: monsterBody.transforms.y * scaleFactor },
                  { scale: monsterBody.transforms.scale },
                ],
              },
            ]}
            source={monsterBody.bodyImage}
          />
        ) : null}
        {Object.values(monsterBody.bodypartnodes).map(
          (bodypart: bodyPartInfo, i: number) => {
            const partTitle = Object.keys(bodysInfo[1].bodyparts)[i] as
              | "leftarm"
              | "rightarm"
              | "leftleg"
              | "rightleg"
              | "eyes"
              | "head"
              | "mouth";
            const node = bodysInfo[1].body[partTitle];
            const bodyNodeCoord: Array<number> =
              node !== undefined ? node : [0, 0];
            if (bodypart)
              return (
                <Image
                  ref={bodypart.ref}
                  style={[
                    styles.bodyPart,
                  ]}
                  source={bodypart.bodyPart.image}
                />
              );
            else return;
          }
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyPart: {
    backgroundColor: "transparent",
    position: "absolute",
  },
  room: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: "auto",
  },
  body: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  bodyImage: {
    height: "100%",
    width: "100%",
  },
  gestureHandler: {
    height: "100%",
    width: "100%",
  },
  touchable: {
    backgroundColor: "black",
    width: "auto",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Monster;
