import { createContext, Reducer, Ref, Dispatch } from 'react';
import { Image, ImageSourcePropType } from 'react-native'
import { IBodyPartNodes, Body, OnNodePress, bodyPartInfo, emptyBody } from '../global';
import Monster from '../components/Monster';

export type monsterAction = {
    bodyParts?: IBodyPartNodes | undefined,
    bodyPartToChange?: { bodyPartName: string, newValue: bodyPartInfo },
    bodyImage?: ImageSourcePropType | undefined,
    body?: Body | undefined,
    OnNodePress?: OnNodePress
  }

type monsterInformation = {
    monster: Body,
    monsterDispatch: Dispatch<monsterAction> | undefined
}

const initial: monsterInformation = {
    monster: emptyBody, 
    monsterDispatch: undefined
}

export const MonsterContext = createContext<monsterInformation>(initial);
