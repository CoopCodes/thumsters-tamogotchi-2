import React, { ReactHTMLElement, useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Image, StyleSheet, Text, LayoutChangeEvent } from "react-native";
import { Body, BodyPart, bodySets, categories, usePrevious } from "../global";
import { SvgProps } from "react-native-svg";
import MoodContext from "../Contexts/MoodContext";
import Node from "../assets/resources/Monsters/1/Nodenode.svg";
import Animated, { Easing, Keyframe, runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Rive, { Fit, RiveRef } from "rive-react-native";


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
    "Eyes": ["Sleeping"],
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

// Riv eexample
// <Rive
//  ref={bodypart.riveRef}
//  style={
//     {
//       backgroundColor: "transparent",
//       width: bodypart.bodyPart.width * scaleFactor,
//       height: bodypart.bodyPart.height * scaleFactor,
//     }
//   }
//   onStateChanged={(stateMachineName, stateName) => {
//     setStateMachines(
//       Array.from([...stateMachines, stateMachineName])
//     );
//   }}
//   fit={Fit.Contain}
//   resourceName="body1"
//   artboardName={BodyPartImage}
//   stateMachineName={bodypart.bodyPart.category}
//   autoplay
//   animationName={mood === "" ? "Idle" : ""}
// />


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