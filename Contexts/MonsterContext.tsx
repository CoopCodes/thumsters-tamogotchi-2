import {
  createContext,
  Reducer,
  Ref,
  Dispatch,
  ReactNode,
  useState,
  useReducer,
} from "react";
import { Image, View } from "react-native";
import {
  IBodyPartNodes,
  Body,
  OnNodePress,
  bodyPartInfo,
  emptyBody,
  bodySets,
  bodyImage,
} from "../global";
import { SvgProps } from "react-native-svg";

export type monsterAction = {
  bodyParts?: IBodyPartNodes | undefined;
  bodyPartToChange?: { bodyPartName: string; newValue: bodyPartInfo };
  bodyImage?: React.FC<SvgProps> | undefined;
  body?: Body | undefined;
  OnNodePress?: OnNodePress;
};

type monsterInformation = {
  monster: Body;
  monsterDispatch: Dispatch<monsterAction | undefined> | undefined;
};

const initial: monsterInformation = {
  monster: emptyBody,
  monsterDispatch: undefined,
};

export const MonsterContext = createContext<monsterInformation>(initial);

interface MonsterContextProps {
  children: ReactNode;
}

export const MonsterProvider = ({ children }: MonsterContextProps) => {
  const monsterReducer = (state: Body, action: monsterAction | undefined) => {
    if (action === undefined) return state;
    if (action.bodyParts) state.bodypartnodes = action.bodyParts;
    if (action.bodyImage) state.bodyImage = action.bodyImage;
    else state.bodyImage = state.bodyImage;

    if (action.bodyPartToChange) {
      let i;
      // x would be leftarm, righarm, etc...
      Object.keys(state.bodypartnodes).map((x: string, index: number) => {
        // Checking if the passed in bodypart to change is on the body
        // if bodypart is the entered bodypart, then will set i to index
        if (x === action.bodyPartToChange?.bodyPartName) i = index;
      });

      if (i) {
        type BodyPartNodes = keyof typeof state.bodypartnodes;
        const bodypartnode = action.bodyPartToChange
          ?.bodyPartName as BodyPartNodes;
        state.bodypartnodes[bodypartnode] = action.bodyPartToChange.newValue;
        // console.log(action.bodyPartToChange.newValue)
        // console.log(state.bodypartnodes[bodypartnode])
        console.log("updating props");

        // This didn't do anything dunno why
        // state.bodypartnodes[bodypartnode]!.ref!.current.setNativeProps({
        //   styles: updateNativeProps(
        //     state.bodypartnodes[bodypartnode]!,
        //     state.bodypartnodes[bodypartnode]!.ref!,
        //     state.bodypartnodes[bodypartnode]!.bodyPart.node !== undefined
        //       ? state.bodypartnodes[bodypartnode]!.bodyPart.node!
        //       : [0, 0],
        //     0.3,
        //   ),
        // });
      }
    }

    if (action.body) state = action.body;

    if (action.OnNodePress) {
      Object.values(state.bodypartnodes).map((bodypart: bodyPartInfo) => {
        if (bodypart) bodypart.onPress = action.OnNodePress;
      });
    }
    return state;
  };

  const [monster, monsterDispatch] = useReducer(
    monsterReducer,
    new Body(
      {
        leftarm: bodySets[1].bodyparts.leftarm,
        rightarm: bodySets[1].bodyparts.rightarm,
        leftleg: bodySets[1].bodyparts.leftleg,
        rightleg: bodySets[1].bodyparts.rightleg,
        eyes: bodySets[1].bodyparts.eyes,
        head: undefined,
        mouth: bodySets[1].bodyparts.mouth,
      },
      bodySets[1].body,
      [757, 1200],
      {
        x: 0,
        y: -200,
        scale: 1.05,
      },
      bodyImage
    )
  );

  return (
    <MonsterContext.Provider
      value={{
        monster: monster,
        monsterDispatch: monsterDispatch,
      }}
    >
      {children}
    </MonsterContext.Provider>
  );
};
