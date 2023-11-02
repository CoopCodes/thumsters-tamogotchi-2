import { createContext, Reducer, Ref, Dispatch } from 'react';
import { Image, ImageSourcePropType } from 'react-native'
import { IBodyPartNodes, Body } from '../global';

export type monsterAction = {
    bodyParts: IBodyPartNodes | undefined,
    bodyImage: string | undefined,
    body: Body | undefined,
  }

type monsterInformation = {
    monster: Body | undefined,
    monsterDispatch: Dispatch<monsterAction> | undefined
}

const initial: monsterInformation = {
    monster: undefined, 
    monsterDispatch: undefined
}

export const MonsterContext = createContext<monsterInformation>(initial);
