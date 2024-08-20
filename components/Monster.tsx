import React, { ReactHTMLElement, useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Image, StyleSheet, Text, LayoutChangeEvent } from "react-native";
import { Body, BodyPart, bodyPartInfo, bodySets, categories, usePrevious } from "../global";
import { SvgProps } from "react-native-svg";
import MoodContext from "../Contexts/MoodContext";
import Node from "../assets/resources/Monsters/1/Nodenode.svg";
import Animated, { Easing, Keyframe, runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Rive, { Fit, RiveRef } from "rive-react-native";


/**
 * Moves the body part to the correct position, width, height, and scale. based on the nodes position.
 */
// export function updateNativeProps(
//   bodypart: bodyPartInfo,
//   ref: React.RefObject<any>,
//   bodyNodeCoord: number[],
//   scaleFactor: number
// ) {
//   // ref.current.setNativeProps({
//   //   style:
//   return {
//     transform: [
//       // {
//       //   translateX:
//       //     // bodyNodeCoord[0] - bodypart.bodyPart.node[0] * scaleFactor,
//       // },
//       // {
//       //   translateY:
//       //     // bodyNodeCoord[1] - bodypart.bodyPart.node[1] * scaleFactor,
//       // },
//       { scaleX: bodypart.bodyPart.reflected ? -1 : 1 },
//       {
//         scale: bodypart.bodyPart.scale+1,
//       },
//     ],
//     // left: Math.abs((bodyNodeCoord[0] * combinedScaleFactor) - bodypart.bodyPart.node[0] * scaleFactor),
//     // top: Math.abs((bodyNodeCoord[1] * combinedScaleFactor) - bodypart.bodyPart.node[1] * scaleFactor),
//     left:
//       bodyNodeCoord[0] * scaleFactor - bodypart.bodyPart.node[0] * scaleFactor,
//     top:
//       bodyNodeCoord[1] * scaleFactor - bodypart.bodyPart.node[1] * scaleFactor,
//     width: bodypart.bodyPart.width * scaleFactor,
//     height: bodypart.bodyPart.height * scaleFactor,
//     zIndex: bodypart.bodyPart.zIndex,
//   };
// }

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
  state: string,
  containerWidth: number,
  containerHeight: number
) {
  if (
    bodypart !== undefined &&
    bodypart.ref !== undefined &&
    bodypart.ref !== null &&
    bodypart.bodyPart.node !== undefined &&
    typeof bodypart.ref === "object" &&
    bodypart.ref.current !== undefined
  ) {
    // const combinedScaleFactor = bodypart.bodyPart.scale
    //   ? scaleFactor * bodypart.bodyPart.scale
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
    
    // ** Alignments logic ** //
    
    const alignmentValue = (value: boolean | number) => {
      return typeof value === "boolean" ? 0 : value * scaleFactor;
    }

    let left = bodyNodeCoord[0] * scaleFactor - bodypart.bodyPart.node[0] * scaleFactor;
    let top = bodyNodeCoord[1] * scaleFactor - bodypart.bodyPart.node[1] * scaleFactor;
    
    if (bodypart.bodyPart.alignments !== undefined) {
      
      const alignments = bodypart.bodyPart.alignments;
      
      if (alignments.leftAlign !== undefined && alignments.leftAlign !== 0 && alignments.leftAlign !== false) {
        left = alignmentValue(alignments.leftAlign) * scaleFactor;

      }
      if (alignments.rightAlign !== undefined && alignments.rightAlign !== 0 && alignments.rightAlign !== false) {
        left = containerWidth + alignmentValue(alignments.rightAlign) * scaleFactor;
        
      }
      if (alignments.topAlign !== undefined && alignments.topAlign !== 0 && alignments.topAlign !== false) {
        top = alignmentValue(alignments.topAlign) * scaleFactor;
        
      }
      if (alignments.bottomAlign !== undefined && alignments.bottomAlign !== 0) {
        top = containerHeight + alignmentValue(alignments.bottomAlign) * scaleFactor;
        
      }
      if (alignments.centerHorizontalAlign !== undefined && alignments.centerHorizontalAlign !== 0 && alignments.centerHorizontalAlign !== false) {
        left = ((containerWidth / 2) - ((bodypart.bodyPart.width * scaleFactor) / 2) + alignmentValue(alignments.centerHorizontalAlign));

      }
      if (alignments.centerVerticalAlign !== undefined && alignments.centerVerticalAlign !== 0 && alignments.centerVerticalAlign !== false) {
        top = ((containerHeight / 2) + ((bodypart.bodyPart.height * scaleFactor) / 2) + alignmentValue(alignments.centerVerticalAlign)) * scaleFactor;
      } 
    }
    
    // ** End of Alignments logic ** //
    
    // console.log(bodypart.bodyPart.node.length >= 3, "   ", bodypart.bodyPart.node.length >= 3 ? -1 * left : left)

    return {
      // left: Math.abs((bodyNodeCoord[0] * combinedScaleFactor) - bodypart.bodyPart.node[0] * scaleFactor),
      // top: Math.abs((bodyNodeCoord[1] * combinedScaleFactor) - bodypart.bodyPart.node[1] * scaleFactor),
      // left: left,
      left: bodypart.bodyPart.node.length >= 3 ? left - (bodypart.bodyPart.width - 80) * scaleFactor : left, // Offset
      top: top,
      width: typeof bodypart.bodyPart.image !== "string" ? bodypart.bodyPart.width * scaleFactor : undefined,
      height: typeof bodypart.bodyPart.image !== "string" ? bodypart.bodyPart.height * scaleFactor : undefined,
      transform: [
        { scaleX: bodypart.bodyPart.node.length >= 3 ? -1 : 1 },
        {
          scale: bodypart.bodyPart.scale,
        },
      ],
      // backgroundColor: "black",
      zIndex:
        state.includes("turned") && bodypart.bodyPart.category !== "Body"
          ? -1
          : bodypart.bodyPart.zIndex,
    };
  }
  // }
  // );
}

// Displays a +1 above the monster
export interface IPerk {
  attribute: string;
  amount: number;
  operation: string; // +, -
  color: string;
}

interface Props {
  monsterBody: Body;
  scaleFactor: number; // Changes in LockerRoom
  state?: string;
  perk?: IPerk;
}

const Monster = ({ monsterBody, scaleFactor = 0.3, state = "", perk = undefined }: Props) => {
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const eyesRef = useRef();
  const mouthRef = useRef();

  const leftArmRiveRef = React.useRef<RiveRef>(null);
  const rightArmRiveRef = React.useRef<RiveRef>(null);
  const leftLegRiveRef = React.useRef<RiveRef>(null);
  const rightLegRiveRef = React.useRef<RiveRef>(null);
  const eyesRiveRef = React.useRef<RiveRef>(null);
  const mouthRiveRef = React.useRef<RiveRef>(null);

  monsterBody.bodypartnodes.leftarm.riveRef = leftArmRiveRef;
  monsterBody.bodypartnodes.rightarm.riveRef = rightArmRiveRef;
  monsterBody.bodypartnodes.leftleg.riveRef = leftLegRiveRef;
  monsterBody.bodypartnodes.rightleg.riveRef = rightLegRiveRef;
  monsterBody.bodypartnodes.eyes.riveRef = eyesRiveRef;
  monsterBody.bodypartnodes.mouth.riveRef = mouthRiveRef;

  monsterBody.bodypartnodes.leftarm.ref = leftArmRef;
  monsterBody.bodypartnodes.rightarm.ref = rightArmRef;
  monsterBody.bodypartnodes.leftleg.ref = leftLegRef;
  monsterBody.bodypartnodes.rightleg.ref = rightLegRef;
  monsterBody.bodypartnodes.eyes.ref = eyesRef;
  monsterBody.bodypartnodes.mouth.ref = mouthRef;

  const maxTop: number = Object.values(monsterBody.nodes).reduce(
    (max, node: number[], index) =>
      (node && Math.max(max, node[1] || Number.NEGATIVE_INFINITY)) || max,
    Number.NEGATIVE_INFINITY
  );

  const { mood, setMood } = useContext(MoodContext);

  const perkStartKeyframe = new Keyframe({
    0: {
      easing: Easing.in(Easing.quad),
      transform: [{ translateY: 0 }],
      opacity: 0,
    },
    10: {
      transform: [{ translateY: 0 }],
      opacity: 1,
    },
    100: {
      transform: [{ translateY: -200 }],
      opacity: 0,
    }
  })

  const [stateMachines, setStateMachines] = useState<string[]>([]);
  const stateMachinesStatic = {
    "Mouth": ["Open"],
    "Eye": ["Sleeping"],
    "Arm": ["Happy", "Sad"]
  }

  const prevMood = usePrevious(mood);

  useEffect(() => {
    if (mood !== "") {
      Object.values(monsterBody.bodypartnodes).map((bodypart: bodyPartInfo, index: number) => {
        if (
          bodypart !== undefined &&
          bodypart.bodyPart.category !== undefined &&
          bodypart.riveRef !== undefined &&
          bodypart.riveRef !== null &&
          typeof bodypart.riveRef === "object" &&
          bodypart.riveRef.current !== undefined && 
          bodypart.riveRef.current !== null &&
          Object.keys(stateMachinesStatic).includes(bodypart.bodyPart.category) &&
          Object.values(stateMachinesStatic)[Object.keys(stateMachinesStatic).indexOf(bodypart.bodyPart.category)].includes(mood)
        ) {
          // console.log(bodypart.bodyPart.category, "  ", stateMachinesStatic[stateMachinesStatic.indexOf(bodypart.bodyPart.category)]);
          mood.split(" ").map((m: string) => {
            if (bodypart.bodyPart.category !== undefined)
              bodypart.riveRef?.current?.setInputState(
                bodypart.bodyPart.category,
                m,
                true
              );
          })
        }
      })

      // riveRef.current?.setInputState("Mouth", mood, true);

    } else if (prevMood !== undefined && mood !== prevMood) { // Runs if mood === ""
      Object.values(monsterBody.bodypartnodes).map((bodypart: bodyPartInfo, index: number) => {
        if (
          bodypart !== undefined &&
          bodypart.bodyPart.category !== undefined &&
          bodypart.riveRef !== undefined &&
          bodypart.riveRef !== null &&
          typeof bodypart.riveRef === "object" &&
          bodypart.riveRef.current !== undefined && 
          bodypart.riveRef.current !== null &&
          Object.keys(stateMachinesStatic).includes(bodypart.bodyPart.category) &&
          Object.values(stateMachinesStatic)[Object.keys(stateMachinesStatic).indexOf(bodypart.bodyPart.category)].includes(prevMood)
        ) {
          prevMood.split(" ").map((m: string) => {
            if (bodypart.bodyPart.category !== undefined)
              bodypart.riveRef?.current?.setInputState(
                bodypart.bodyPart.category,
                m,
                false
              );
          })
        }
      })
    }
  }, [mood])

  const [, updateState] = React.useState(0);
  const forceUpdate = React.useCallback(() => updateState(1), []);

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  let containerHeightOriginal: number = 0;

  // eyesRiveRef.current?.setInputState(
  //   "Eyes",
  //   "Sleeping",
  //   true
  // );

  return (
    <View style={[styles.container, { bottom: 10 }]} onLayout={(event) => {
      setContainerWidth(event.nativeEvent.layout.width);
      setContainerHeight(event.nativeEvent.layout.height);
      containerHeightOriginal = event.nativeEvent.layout.height;
    }}>
      { perk !== undefined ? (
        <Animated.View style={[styles.perkContainer]} entering={perkStartKeyframe.duration(1200)}>
          <Text style={[styles.perk, { color: perk.color }]}>{perk.operation + "" + perk.amount}</Text>
        </Animated.View>
      ) : (<></>) }
      <View style={[styles.body, { paddingBottom: containerHeightOriginal + (maxTop * scaleFactor),backgroundColor: "transparent" }]}>
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
            if (bodypart === undefined) return (<View key={i}></View>);
            
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
            
            let BodyPartImage: React.FC<SvgProps> | string = Node;
              
            let moodBodyPart;
            try {
              if (bodypart.moodBodyParts !== undefined && mood != "") {
                moodBodyPart = bodypart.moodBodyParts.filter(
                  (moodBodyPart: { [key: string]: BodyPart }) =>
                    Object.keys(moodBodyPart).includes(mood)
                )[0][mood];
              } else { moodBodyPart = undefined; }
            } catch (e) { 
              console.log(mood)
              moodBodyPart = undefined; 
            }
            
            // Check if the body part has mood images, if so, check if the current mood is empty or if the current mood is not in the mood images array. If so, use the default image. Otherwise, use the image for the current mood.
            
            // if (moodBodyPart !== undefined) {
            //   BodyPartImage = moodBodyPart.image;
            // } else {
            //   if (
            //     bodypart.bodyPart.moodsImages === undefined ||
            //     mood === "" ||
            //     bodypart.bodyPart.moodsImages.filter(
            //       (moodImage: { [key: string]: React.FC<SvgProps> }) =>
            //         Object.keys(moodImage).includes(mood)
            //     ).length === 0
            //   ) {
            //     BodyPartImage = bodypart.bodyPart.image;
            //   } 
            //   else {
            //     BodyPartImage = bodypart.bodyPart.moodsImages.filter(
            //       (moodImage: { [key: string]: React.FC<SvgProps> }) =>
            //         Object.keys(moodImage).includes(mood)
            //     )[0][mood]; 
            //   }
            // }

            // let moodBodyPartInfo: bodyPartInfo | undefined;
            // if (moodBodyPart !== undefined) {
            //   moodBodyPartInfo = {
            //     bodyPart: moodBodyPart,
            //     onPress: bodypart.onPress,
            //     ref: bodypart.ref
            //   }
            // }

            BodyPartImage = bodypart.bodyPart.image;
            
            if (bodypart)
              return (
                <View
                  style={[
                    styles.bodyPart,
                    setBodyPartStyles(bodypart, scaleFactor, i, state, containerWidth, containerHeight),
                  ]}
                  key={i}
                  ref={bodypart.ref}
                  onLayout={() => {
                    forceUpdate()
                  }}
                >
                  {!(typeof BodyPartImage === "string") ? (
                    <BodyPartImage/>
                  ) : (
                    <Rive
                      ref={bodypart.riveRef}
                      style={
                        {
                          backgroundColor: "transparent",
                          width: bodypart.bodyPart.width * scaleFactor,
                          height: bodypart.bodyPart.height * scaleFactor,
                        }
                      }
                      onStateChanged={(stateMachineName, stateName) => {
                        setStateMachines(
                          Array.from([...stateMachines, stateMachineName])
                        );
                      }}
                      fit={Fit.Contain}
                      resourceName="body1"
                      artboardName={BodyPartImage}
                      stateMachineName={bodypart.bodyPart.category}
                      autoplay
                      animationName={mood === "" ? "Idle" : ""}
                    />
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
  container: {
    position: "relative",
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
    width: "auto",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  perkContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,

  },
  perk: {
    fontSize: 50,
    fontFamily: "Poppins_900Black"
  }
});

export default Monster;

// Graveyard

// Determine which image to use
// {(bodypart.bodyPart.moodsImages === undefined || mood === "" || bodypart.bodyPart.moodsImages.filter((moodImage: { [key: string]: React.FC<SvgProps> }) => Object.keys(moodImage).includes(mood)).length === 0) ? (
//   <bodypart.bodyPart.image />
// ) : (
//   bodypart.bodyPart.moodsImages.map(
//     (moodImage: { [key: string]: React.FC<SvgProps> }, index) => {
//       if (Object.keys(moodImage).includes(mood)) {
//         let MoodImageToUse = moodImage[mood];
//         return <MoodImageToUse key={index}/>
//       }
//     }
//   )
// )}

// Stuff
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