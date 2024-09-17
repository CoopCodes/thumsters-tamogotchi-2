import React, { ReactHTMLElement, RefObject, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { View, Image, StyleSheet, Text, LayoutChangeEvent } from "react-native";
import { Body, BodyPart, bodySets, categories, moodInputs, stateMachineName, usePrevious } from "../global";
import { SvgProps } from "react-native-svg";
import MoodContext from "../Contexts/MoodContext";
import Node from "../assets/resources/Monsters/1/Nodenode.svg";
import Animated, { Easing, Keyframe, runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Rive, { Fit, RiveRef } from "rive-react-native";
import ColorContext from "../Contexts/ColorContext";
import { MonsterContext, MonsterInfo, RiveAnimation } from "../Contexts/MonsterContext";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";


// Displays a +1 above the monster
export interface IPerk {
  attribute: string;
  amount: number;
  operation: string; // +, -
  color: string;
}

interface Props {
  scaleFactor: number; // Changes in LockerRoom
  state?: string;
  perk?: IPerk;
}

const Monster = ({ scaleFactor = 0.3, state = "", perk = undefined }: Props) => {

  const { color, setColor } = useContext(ColorContext);

  const { mood, setMood } = useContext(MoodContext);

  // const { monster, monsterDispatch, monsterUpdated, setMonsterUpdated } = useContext(MonsterContext);

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

  const MonsterRef = (monster.RiveRef as RefObject<RiveRef>)

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  // useEffect(() => {
  //   if (monsterUpdated) {
  //     console.log('monsterUpdated', monsterUpdated)
  //     forceUpdate();
  //   }
  // }, [monsterUpdated])
  
  const isFocused = useIsFocused();
  
  useEffect(() => {
    console.log("stuff changed")
    // forceUpdate();
  }, [isFocused]);

  // Set color
  useEffect(() => {
    Object.values(monster.Body.bodyparts).map((bodypart: BodyPart, index: number) => {
      if (bodypart !== undefined) {
        let colorInput = bodypart.colorInputs.find((c: string) => c === color);
  
        if (
          bodypart.category !== undefined &&
          bodypart.colorInputs.length >= 1,
          colorInput !== undefined
        ) {
          if (bodypart.category !== undefined) {            
            MonsterRef?.current?.setInputStateAtPath(
              colorInput, // "Blue" for example
              true,
              bodypart.artboardName // The path to the nested artboard
            );
          }
        }
      }
    })
  }, [color])

  // Set Mood
  useEffect(() => {
    if (MonsterRef === undefined || MonsterRef.current === null) return;

    if (mood !== undefined) {
      mood.split(" ").map((m: string) => {
        if (moodInputs.includes(m)) {
          MonsterRef.current?.setInputState(stateMachineName, m, true);
        }
      })
    } 
    if (prevMood !== undefined && mood !== prevMood) {
      prevMood.split(" ").map((m: string) => {
        if (moodInputs.includes(m)) {
          MonsterRef.current?.setInputState(stateMachineName, m, false);
          setMonsterUpdated(true);
        }
      })  
    }    
  }, [mood])

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  let containerHeightOriginal: number = 0;

  return (
    <View style={[styles.container, { bottom: 10 }]} onLayout={(event) => {
      setContainerWidth(event.nativeEvent.layout.width);
      setContainerHeight(event.nativeEvent.layout.height);
      containerHeightOriginal = event.nativeEvent.layout.height;
    }}>
      {/* <Text style={{display: "none"}}>{updateVal}</Text> */}
      { perk !== undefined ? (
        <Animated.View style={[styles.perkContainer]} entering={perkStartKeyframe.duration(1200)}>
          <Text style={[styles.perk, { color: perk.color }]}>{perk.operation + "" + perk.amount}</Text>
        </Animated.View>
      ) : (<></>) }
        <RiveAnimation ref={monster.RiveRef} />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    transform: [{ translateY: 10 }],
    position: "relative",
    width: "100%",
    height: "100%",
  },
  body: {
    width: "100%",
    height: "100%",
    flex: 1,
    // height: 500,
    // width: 500
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