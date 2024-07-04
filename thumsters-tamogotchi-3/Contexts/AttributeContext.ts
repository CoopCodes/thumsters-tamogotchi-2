import { createContext, Reducer, Ref, Dispatch } from 'react';
import { Image } from 'react-native'
import { IBodyPartNodes } from '../global';

type attributesAction = {
    attribute: string;
    operation: string;
    perk: number;
};

type attributesInformation = {
    attributes: {[x: string]: number} | undefined,
    attributesDispatch: Dispatch<attributesAction> | undefined
}

const initial: attributesInformation = {
    attributes: undefined, 
    attributesDispatch: undefined
}

export const AttributesContext = createContext<attributesInformation>(initial);
