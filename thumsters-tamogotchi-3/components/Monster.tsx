import React, { useContext, useEffect, useMemo, useRef } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Body, BodyPart, bodyPartInfo, bodySets } from "../global";
import { SvgProps } from "react-native-svg";
import MoodContext from "../Contexts/MoodContext";
// import node from "../assets/resources/Monsters/1/Nodenode.png";

/**
 * Moves the body part to the correct position, width, height, and scale. based on the nodes position.
 */
export function updateNativeProps(
  bodypart: bodyPartInfo,
  ref: React.RefObject<any>,
  bodyNodeCoord: number[],
  scaleFactor: number
) {
  // ref.current.setNativeProps({
  //   style:
  return {
    transform: [
      // {
      //   translateX:
      //     // bodyNodeCoord[0] - bodypart.bodyPart.node[0] * scaleFactor,
      // },
      // {
      //   translateY:
      //     // bodyNodeCoord[1] - bodypart.bodyPart.node[1] * scaleFactor,
      // },
      { scaleX: bodypart.bodyPart.reflected ? -1 : 1 },
      {
        scale: bodypart.bodyPart.node[2] ? bodypart.bodyPart.node[2] : 1,
      },
    ],
    // left: Math.abs((bodyNodeCoord[0] * combinedScaleFactor) - bodypart.bodyPart.node[0] * scaleFactor),
    // top: Math.abs((bodyNodeCoord[1] * combinedScaleFactor) - bodypart.bodyPart.node[1] * scaleFactor),
    left:
      bodyNodeCoord[0] * scaleFactor - bodypart.bodyPart.node[0] * scaleFactor,
    top:
      bodyNodeCoord[1] * scaleFactor - bodypart.bodyPart.node[1] * scaleFactor,
    width: bodypart.bodyPart.width * scaleFactor,
    height: bodypart.bodyPart.height * scaleFactor,
    zIndex: bodypart.bodyPart.zIndex,
  };
}

/**
 * Sets the styles for a given body part based on the provided scale factor and index.
 *
 * @param {bodyPartInfo} bodypart - The body part information.
 * @param {number} scaleFactor - The scale factor to apply.
 * @param {number} i - The index of the body part.
 * @return {Object} - The styles object for the body part.
 */
export function setBodyPartStyles(
  bodypart: bodyPartInfo,
  scaleFactor: number,
  i: number,
  state: string
) {
  if (
    bodypart !== undefined &&
    bodypart.ref !== undefined &&
    bodypart.ref !== null &&
    bodypart.bodyPart.node !== undefined &&
    typeof bodypart.ref === "object" &&
    bodypart.ref.current !== undefined
  ) {
    // const combinedScaleFactor = bodypart.bodyPart.node[2]
    //   ? scaleFactor * bodypart.bodyPart.node[2]
    //   : scaleFactor;

    // if (checkBodyPart(potentialTitle)) {
    // }
    // Returning an array of the all the bodypart titles, as to match it with the current bodypart, and then finds the corresponding node that it should attach to on the body.
    const partTitle = Object.keys(bodySets[1].bodyparts)[i] as
      | "leftarm"
      | "rightarm"
      | "leftleg"
      | "rightleg"
      | "eyes"
      | "head"
      | "mouth";

    const node = bodySets[1].body[partTitle];
    const bodyNodeCoord: Array<number> = node !== undefined ? node : [0, 0];

    return {
      transform: [
        // {
        //   translateX:
        //     // bodyNodeCoord[0] - bodypart.bodyPart.node[0] * scaleFactor,
        // },
        // {
        //   translateY:
        //     // bodyNodeCoord[1] - bodypart.bodyPart.node[1] * scaleFactor,
        // },
        { scaleX: bodypart.bodyPart.reflected ? -1 : 1 },
        {
          scale: bodypart.bodyPart.node[2] ? bodypart.bodyPart.node[2] : 1,
        },
      ],
      // left: Math.abs((bodyNodeCoord[0] * combinedScaleFactor) - bodypart.bodyPart.node[0] * scaleFactor),
      // top: Math.abs((bodyNodeCoord[1] * combinedScaleFactor) - bodypart.bodyPart.node[1] * scaleFactor),
      left:
        bodyNodeCoord[0] * scaleFactor -
        bodypart.bodyPart.node[0] * scaleFactor,
      top:
        bodyNodeCoord[1] * scaleFactor -
        bodypart.bodyPart.node[1] * scaleFactor,
      width: bodypart.bodyPart.width * scaleFactor,
      height: bodypart.bodyPart.height * scaleFactor,
      zIndex:
        state.includes("turned") && bodypart.bodyPart.category !== "Body"
          ? -1
          : bodypart.bodyPart.zIndex,
    };
  }
  // }
  // );
}

interface Props {
  monsterBody: Body;
  state?: string;
  scaleFactor: number; // Changes in LockerRoom
}

const Monster = ({ monsterBody, state = "", scaleFactor = 0.3 }: Props) => {
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

  const maxTop = Object.values(monsterBody.nodes).reduce(
    (max, node: number[]) =>
      (node &&
        Math.max(
          max,
          node[1] || Number.NEGATIVE_INFINITY
        )) ||
      max,
    Number.NEGATIVE_INFINITY
  );

  // function checkBodyPart(part: string): boolean {
  //   return (
  //     part === "leftarm" ||
  //     part === "rightarm" ||
  //     part === "leftleg" ||
  //     part === "rightleg" ||
  //     part === "eyes" ||
  //     part === "head" ||
  //     part === "mouth"
  //   );
  // }

  // useEffect(() => {
  //   let i: number = 0;
  //   Object.values(monsterBody.bodypartnodes).map((bodypart: bodyPartInfo) => {
  //     // if (
  //     //   bodypart !== undefined &&
  //     //   bodypart.ref !== undefined &&
  //     //   bodypart.ref !== null &&
  //     //   bodypart.bodyPart.node !== undefined &&
  //     //   typeof bodypart.ref === "object" &&
  //     //   bodypart.ref.current !== undefined
  //     // ) {
  //     //     const combinedScaleFactor = (bodypart.bodyPart.node[2])? scaleFactor * bodypart.bodyPart.node[2] : scaleFactor

  //     //   // if (checkBodyPart(potentialTitle)) {
  //     //   // }
  //     //   // Returning an array of the all the bodypart titles, as to match it with the current bodypart, and then finds the corresponding node that it should attach to on the body.
  //     //   const partTitle = Object.keys(bodysInfo[1].bodyparts)[i] as
  //     //     | "leftarm"
  //     //     | "rightarm"
  //     //     | "leftleg"
  //     //     | "rightleg"
  //     //     | "eyes"
  //     //     | "head"
  //     //     | "mouth";

  //     //   const node = bodysInfo[1].body[partTitle];
  //     //   const bodyNodeCoord: Array<number> = node !== undefined ? node : [0, 0];
  //     //   console.log(bodyNodeCoord[1] * 1 - bodypart.bodyPart.node[1] * scaleFactor)

  //     //   bodypart.ref.current.setNativeProps({ styles: updateNativeProps(bodypart, bodypart.ref, bodyNodeCoord, scaleFactor) })

  //     // }

  //     i++;
  //   });
  // }, [monsterBody]);

  const {mood, setMood} = useContext(MoodContext);

  return (
    <View style={styles.room}>
      <View style={[styles.body, {paddingBottom: maxTop}]}>
        {monsterBody.bodyImage ? (
          <monsterBody.bodyImage
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
          />
        ) : null}
        {Object.values(monsterBody.bodypartnodes).map(
          (bodypart: bodyPartInfo, i: number) => {
            const partTitle = Object.keys(bodySets[1].bodyparts)[i] as
              | "leftarm"
              | "rightarm"
              | "leftleg"
              | "rightleg"
              | "eyes"
              | "head"
              | "mouth";
            const node = bodySets[1].body[partTitle];
            const bodyNodeCoord: Array<number> =
              node !== undefined ? node : [0, 0];
            if (bodypart)
              return (
                <View
                  style={[
                    styles.bodyPart,
                    setBodyPartStyles(bodypart, scaleFactor, i, state),
                  ]}
                  key={i}
                  ref={bodypart.ref}
                >
                  {(bodypart.bodyPart.moodsImages === undefined || mood === "" || bodypart.bodyPart.moodsImages.filter((moodImage: { [key: string]: React.FC<SvgProps> }) => Object.keys(moodImage).includes(mood)).length === 0) ? (
                    <bodypart.bodyPart.image />
                  ) : (
                    bodypart.bodyPart.moodsImages.map(
                      (moodImage: { [key: string]: React.FC<SvgProps> }, index) => {
                        if (Object.keys(moodImage).includes(mood)) {
                          let MoodImageToUse = moodImage[mood];
                          return <MoodImageToUse key={index}/>
                        }
                      }
                    )
                  )}
                </View>
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
