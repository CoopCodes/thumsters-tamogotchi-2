import { Ref } from 'react';
import { Image, ImageSourcePropType } from 'react-native'

// Body parts
import arm from "./assets/resources/Monsters/1/Arm.png";
import body from "./assets/resources/Monsters/1/Body.png";
import eyes from "./assets/resources/Monsters/1/Eye.png";
import foot from "./assets/resources/Monsters/1/Foot.png";
// import head from "./assets/resources/Monsters/1/Head.png"
import mouth from "./assets/resources/Monsters/1/Mouth.png";

import ImageNotImplemented from "./assets/resources/images/ImageNotImplemented.png"

export const bodyImage = body;

interface ITheme {
    default: { [key: string]: string };
}

export const theme: ITheme = {
  default: {
    "backgroundColor": '#8053FF',
    "interactionPrimary": '#9F53FF',
    "interactionShadow": '#713BB2',
    "health": "rgba(255, 72, 72, 1)",
    "hunger": "rgba(243, 173, 97, 1)",
    "happiness": "rgba(2, 217, 160, 1)",
    "energy": "rgba(245, 216, 0, 1)",
  },
};


// Types:

export class BodyPart {
  node: [number, number]; // The Nodes position, this is where the body part connects to the body.
  image: ImageSourcePropType; // Image path
  
  constructor(node: [number, number], image: ImageSourcePropType) {
    this.node = node;
    this.image = image;
  }
}

export type bodyPartInfo = {
  bodyPart: BodyPart,
  ref: Ref<Image> | undefined // User defined
}

export interface IBodyPartNodes {
  leftarm: bodyPartInfo;
  rightarm: bodyPartInfo;
  leftleg: bodyPartInfo;
  rightleg: bodyPartInfo;
  eyes: bodyPartInfo;
  head: bodyPartInfo | undefined; // Some bodies do not have heads
  mouth: bodyPartInfo;
}

const emptyBodyPartInfo: bodyPartInfo = {
  bodyPart: new BodyPart([0, 0], ImageNotImplemented),
  ref: undefined,
}

const emptyBodyPartNodes: IBodyPartNodes = {
  leftarm: emptyBodyPartInfo,
  rightarm: emptyBodyPartInfo,
  leftleg: emptyBodyPartInfo,
  rightleg: emptyBodyPartInfo,
  eyes: emptyBodyPartInfo,
  head: emptyBodyPartInfo,
  mouth: emptyBodyPartInfo,
}


export class Body {
  nodes: IBodyPartNodes;
  bodyImage: ImageSourcePropType | undefined;
  
  constructor(nodes: IBodyPartNodes = emptyBodyPartNodes, bodyImage: ImageSourcePropType | undefined) {
    this.nodes = nodes;
    this.bodyImage = bodyImage;
  }
}

// Assets: right now it is loading only the first monster, but this needs to be changed so it is dynamic.
export const bodyParts: {[key: number]: IBodyPartNodes} = {
  1: {
    leftarm: { bodyPart: new BodyPart([0, 0], arm), ref: undefined},
    rightarm: { bodyPart: new BodyPart([0, 0], arm), ref: undefined},
    leftleg: { bodyPart: new BodyPart([0, 0], foot), ref: undefined},
    rightleg: { bodyPart: new BodyPart([0, 0], foot), ref: undefined},
    eyes: { bodyPart: new BodyPart([0, 0], eyes), ref: undefined},
    head: undefined,
    mouth: { bodyPart: new BodyPart([0, 0], mouth), ref: undefined},
  }
}