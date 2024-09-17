import React, {
  createContext,
  Reducer,
  Ref,
  Dispatch,
  ReactNode,
  useReducer,
  RefObject,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo
} from "react";
import { Image, View } from "react-native";
import {
  IBodyParts,
  Body,
  emptyBody,
  bodySets,
  bodyImage,
  BodyPart,
  stateMachineName,
  Colors,
} from "../global";
import { SvgProps } from "react-native-svg";
import Rive, { Fit, RiveRef } from "rive-react-native";
import ColorContext from "./ColorContext";
import { styles } from "../components/Monster";
import { useIsFocused } from "@react-navigation/native";

export interface MonsterInfo {
  Body: Body;
  RiveRef: Ref<RiveRef> | undefined;
}

export type monsterAction = {
  bodyParts?: IBodyParts | undefined;
  bodyPartToChange?: { bodyPartName: string; newValue: BodyPart };
  bodyArtboard?: { newValue: string, transitionInputName: string, bodyColor: string };
  ref?: Ref<RiveRef> | undefined;
  body?: Body | undefined;
};

type monsterInformation = {
  monster: MonsterInfo;
  monsterDispatch: Dispatch<monsterAction | undefined> | undefined;
  monsterUpdated: boolean;
  setMonsterUpdated: Dispatch<React.SetStateAction<boolean>>;
  // RiveAnimation: React.JSX.Element | undefined;
};

const initial: monsterInformation = {
  monster: emptyBody,
  monsterDispatch: undefined,
  monsterUpdated: false,
  setMonsterUpdated: () => {},
  // RiveAnimation: undefined
};

export const MonsterContext = createContext<monsterInformation>(initial);

interface MonsterContextProps {
  children: ReactNode;
}


export const MonsterProvider = ({ children }: MonsterContextProps) => {
  const { color, setColor } = useContext(ColorContext);

  const [monsterUpdated, setMonsterUpdated] = useState(false);

  const monsterReducer = (state: MonsterInfo, action: monsterAction | undefined) => {
    if (action === undefined) return state;
    if (action.bodyParts) state.Body.bodyparts = action.bodyParts;
    if (action.ref) {
      state.RiveRef = action.ref
    }

    if (action.bodyArtboard) {
      state.Body.bodyArtboard = action.bodyArtboard.newValue;
      state.Body.bodyTransitionInput = action.bodyArtboard.transitionInputName;
      state.Body.bodyColor = action.bodyArtboard.bodyColor;
      

      
      setTimeout(() => {
        if (!action.bodyArtboard) return

        (state.RiveRef as RefObject<RiveRef>).current?.setInputState(stateMachineName,
          action.bodyArtboard.transitionInputName, true);

        
        // Update color
        console.log("COlor:", action.bodyArtboard?.bodyColor);
        if (setColor)
          setColor(action.bodyArtboard?.bodyColor as Colors);
      });
    }

    if (action.bodyPartToChange) {
      const bodypartToChange = action.bodyPartToChange;

      let i;
      // x would be leftarm, righarm, etc...
      Object.keys(state.Body.bodyparts).map((x: string, index: number) => {
        // Checking if the passed in bodypart to change is on the body
        // if bodypart is the entered bodypart, then will set i to index
        if (x === bodypartToChange?.bodyPartName) i = index;
        // i is the index of the bodypart to change, in the keys of IBodyParts, for example, leftarm would be i=0.
      });

      if (i) {

        // This line is getting the type of the keys of the state.Body.bodyparts object.
        // For example, if the object is { leftarm: BodyPart, rightarm: BodyPart, etc... }
        // Then the type would be 'leftarm' | 'rightarm' | etc...
        type BodyPartNodes = keyof typeof state.Body.bodyparts;

        const bodyPartToChange = bodypartToChange;

        const bodypartnode = bodyPartToChange.bodyPartName as BodyPartNodes;
        
        console.log("Changing", state.Body.bodyparts[bodypartnode]?.artboardName, "to", bodyPartToChange.newValue.artboardName);

        state.Body.bodyparts[bodypartnode] = bodyPartToChange.newValue;

        // This will trigger a re-render, and thus update the Rive animation to be in sync with the new state.
        
        // Set color on the bodypart as the same as the current body

        const colorInput = bodyPartToChange.newValue.colorInputs.find((c: string) => c === color) as Colors;


        setTimeout(() => {
          if (bodyPartToChange.newValue.transitionInputName) {
            (state.RiveRef as RefObject<RiveRef>)?.current?.setInputState(
              stateMachineName,
              bodyPartToChange.newValue.transitionInputName,
              true
            );
          }
          
          // Changing Color
          (state.RiveRef as RefObject<RiveRef>)?.current?.setInputStateAtPath(
            colorInput, // "Blue" for example
            true,
            bodypartToChange.newValue.artboardName // The path to the nested artboard
          );
        }, 100)
      }
    }

    if (action.body) state.Body = action.body;
    
    console.log("uPDATINGGGG")
    setMonsterUpdated(true)
    
    return state;
  };

  // * On re-render * // 

  // const [, forceUpdate] = useReducer(x => x + 1, 0);

  // let toggle = useRef(false);
  
  // function syncBodyParts() {
  //   setTimeout(() => {
  //     // console.log("syncing bodyparts")
  //     if ((monster.RiveRef as RefObject<RiveRef>) === undefined || (monster.RiveRef as RefObject<RiveRef>).current === null) return;

  //     Object.values(monster.Body.bodyparts).map((bodypart: BodyPart) => {
  //       setTimeout(() => {
  //         if (bodypart === undefined) return;
          
          
  //         if (bodypart.transitionInputName === undefined || bodypart.transitionInputName === "") return;
          
  //         const inputName = bodypart.transitionInputName;
          
  //         // console.log("updating", bodypart.transitionInputName);
  
  //         (monster.RiveRef as RefObject<RiveRef>).current!.setInputState(
  //           stateMachineName, 
  //           inputName, 
  //           true
  //         ); // For bodyparts
  //       }, 100)
  //     });
      
  //     // console.log('Monster Body Sync', monster.Body.bodyTransitionInput);
      
  //     if (monster.Body.bodyTransitionInput === undefined || monster.Body.bodyTransitionInput === "") return;
      
  //     setTimeout(() => {
  //       (monster.RiveRef as RefObject<RiveRef>).current!.setInputState(
  //         stateMachineName, monster.Body.bodyTransitionInput, true
  //       ); // For the body
  //     }, 100)

      
  //     console.log('toggle.current', toggle.current)
  //     if (toggle.current === false) {
  //       forceUpdate();
  //     }
      
  //     toggle.current = !toggle.current;
  //   });
  // }

  // requestAnimationFrame(syncBodyParts)
  // * End Section * //

  useEffect(()=> {
    console.log("monster udpated")
  }, [monsterUpdated])  

  const MonsterRef = useRef<RiveRef>(null)
  
  
  const [monster, monsterDispatch] = useReducer(
    monsterReducer, { Body: bodySets["Harold"].body, RiveRef: MonsterRef }
  );

  return (
    <MonsterContext.Provider
      value={{
        monster: monster,
        monsterUpdated: monsterUpdated,
        monsterDispatch: monsterDispatch,
        setMonsterUpdated: setMonsterUpdated,
      }}
    >
      {children}
    </MonsterContext.Provider>
  );
};

export const RiveAnimation = React.forwardRef(({}, ref: React.Ref<RiveRef>) => {

  // const { monster } = useContext(MonsterContext);

  console.log("IAM RERENDERING BITCH")

  return (
    <Rive
      style={styles.body}
      artboardName="Monster"
      resourceName="monster"
      stateMachineName={stateMachineName}
      autoplay={true}
      animationName="Idle"
      ref={ref}
      fit={Fit.Contain}
    />
  )
})