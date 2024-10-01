import React, {
  ReactHTMLElement,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { View, Image, StyleSheet, Text, LayoutChangeEvent } from "react-native";
import {
  Body,
  BodyPart,
  bodySets,
  categories,
  emptyBody,
  intervalDuration,
  moodInputs,
  stateMachineName,
  usePrevious,
} from "../global";
import { SvgProps } from "react-native-svg";
import MoodContext from "../Contexts/MoodContext";
import Node from "../assets/resources/Monsters/1/Nodenode.svg";
import Animated, {
  Easing,
  Keyframe,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Rive, { Fit, RiveRef } from "rive-react-native";
import { ColorContext } from "../Contexts/ColorContext";
import {
  MonsterContext,
  MonsterInfo,
} from "../Contexts/MonsterContext";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";

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
  setSyncBodyParts: (fn: (monster: MonsterInfo) => void) => void;
}

const Monster = ({
  scaleFactor = 0.3,
  state = "",
  setSyncBodyParts,
  perk = undefined,
}: Props) => {
  const { color, setColor } = useContext(ColorContext);

  const { mood, setMood } = useContext(MoodContext);

  const { monster, monsterDispatch} =
    useContext(MonsterContext);

  // useEffect(() => {
  //   console.log("UPDATING ANIMATION", updatingRiveAnimation)
  // }, [updatingRiveAnimation])

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
    },
  });

  const [stateMachines, setStateMachines] = useState<string[]>([]);
  const stateMachinesStatic = {
    Mouth: ["Open"],
    Eyes: ["Sleeping"],
    Arm: ["Happy", "Sad"],
  };

  const prevMood = usePrevious(mood);

  const MonsterRef = useRef<RiveRef>(null);

  useEffect(() => {
    if (monsterDispatch) monsterDispatch({ ref: MonsterRef });
  }, []);

  // * On re-render * //

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function syncBodyParts(currMonster: MonsterInfo)  {
    console.log('\x1b[41m\x1b[30m', "Syncing..." +"\x1b[1m", currMonster.RiveRef, "\x1b[0m");

    if (
      (currMonster.RiveRef as RefObject<RiveRef>) === undefined ||
      (currMonster.RiveRef as RefObject<RiveRef>).current === null
    )
      return;

    Object.values(currMonster.Body.bodyparts).map((bodypart: BodyPart) => {
      
      if (bodypart === undefined) return;
      
      if (
        bodypart.transitionInputName !== undefined &&
        bodypart.transitionInputName !== ""
      ) {
        const inputName = bodypart.transitionInputName;
        
        (currMonster.RiveRef as RefObject<RiveRef>).current!.setInputState(
          stateMachineName,
          inputName,
          true
        ); // For bodyparts
      }
    });


    if (
      currMonster.Body.bodyTransitionInput !== undefined &&
      currMonster.Body.bodyTransitionInput !== ""
    ) {
      console.log("Monster Body Sync", currMonster.Body.bodyTransitionInput);
        (currMonster.RiveRef as RefObject<RiveRef>).current!.setInputState(
        stateMachineName,
        currMonster.Body.bodyTransitionInput,
        true
      ); // For the body
    }
  }

  useEffect(() => {
    setSyncBodyParts(syncBodyParts);
  }, []);

  // * End Section * //

  // requestAnimationFrame(syncBodyParts);

  const isFocused = useIsFocused();

  if (monsterDispatch) monsterDispatch({ ref: MonsterRef });

  useEffect(() => {
    console.log("isFocused", isFocused);

    if (isFocused) if (monsterDispatch) monsterDispatch({ ref: MonsterRef });

    if (monster !== undefined) {
      requestAnimationFrame(() => syncBodyParts(monster));
    }
  }, [isFocused]);

  // Set color
  useEffect(() => {
    Object.values(monster.Body.bodyparts).map(
      (bodypart: BodyPart, index: number) => {
        if (bodypart !== undefined) {
          let colorInput = bodypart.colorInputs.find(
            (c: string) => c === color
          );

          if (
            (bodypart.category !== undefined &&
              bodypart.colorInputs.length >= 1,
            colorInput !== undefined)
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
      }
    );
  }, [color, isFocused]);

  // Set Mood
  useEffect(() => {
    if (MonsterRef === undefined || MonsterRef.current === null) return;

    if (mood !== undefined) {
      mood.split(" ").map((m: string) => {
        if (moodInputs.includes(m)) {
          console.log("Set mood", m);
          MonsterRef.current?.setInputState(stateMachineName, m, true);
        }
      });
    }
    if (prevMood !== undefined && mood !== prevMood) {
      prevMood.split(" ").map((m: string) => {
        if (moodInputs.includes(m)) {
            MonsterRef.current?.setInputState(stateMachineName, m, false);
        }
      });
    }
  }, [mood, isFocused]);

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  let containerHeightOriginal: number = 0;

  return (
    <View
      style={[styles.container, { bottom: 10 }]}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
        setContainerHeight(event.nativeEvent.layout.height);
        containerHeightOriginal = event.nativeEvent.layout.height;
      }}
    >
      {/* <Text style={{display: "none"}}>{updateVal}</Text> */}
      {perk !== undefined ? (
        <Animated.View
          style={[styles.perkContainer]}
          entering={perkStartKeyframe.duration(1200)}
        >
          <Text style={[styles.perk, { color: perk.color }]}>
            {perk.operation + "" + perk.amount}
          </Text>
        </Animated.View>
      ) : (
        <></>
      )}
      <Rive
        style={styles.body}
        artboardName="Monster"
        resourceName="monster"
        stateMachineName={stateMachineName}
        autoplay={true}
        animationName="Idle"
        ref={MonsterRef}
        fit={Fit.Contain}
      />
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
    right: 100,
    zIndex: 100,
  },
  perk: {
    fontSize: 50,
    fontFamily: "Poppins_900Black",
  },
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
