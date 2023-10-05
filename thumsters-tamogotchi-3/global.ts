import { Ref, useRef } from 'react';
import { Image, ImageSourcePropType } from 'react-native'

// Body parts
import arm from "./assets/resources/Monsters/1/Arm.png";
import body from "./assets/resources/Monsters/1/Body.png";
import eyes from "./assets/resources/Monsters/1/Eye.png";
import foot from "./assets/resources/Monsters/1/Foot.png";
import eyes2 from "./assets/resources/Monsters/1/eye2.png"
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
  node: number[]; // The Nodes position, this is where the body part connects to the body.
  reflected: boolean;
  zIndex: number;

  width: number;
  height: number;

  image: ImageSourcePropType; // Image path
  
  constructor(node: number[], image: ImageSourcePropType,
    zIndex: number, dimensions: Array<number>, reflected?: boolean | undefined) {
    this.node = node;
    this.reflected = (reflected === undefined)? false : true;
    this.zIndex = zIndex;

    this.width = dimensions[0];
    this.height = dimensions[1];

    this.image = image;
  }
}

export type bodyPartInfo = {
  bodyPart: BodyPart,
  ref: Ref<any> | undefined //  User defined
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

export interface IBodyNodes {
  leftarm: Array<number>;
  rightarm: Array<number>;
  leftleg: Array<number>;
  rightleg: Array<number>;
  eyes: Array<number>;
  head: Array<number> | undefined; // Some bodies do not have heads
  mouth: Array<number>;
}

// const emptyBodyPartInfo: bodyPartInfo = {
//   bodyPart: new BodyPart([0, 0], arm, 0, [0, 0]),
//   ref: undefined,
// }



// Assets: right now it is loading only the first monster, but this needs to be changed so it is dynamic.
export const bodysInfo: { [key: number]: { bodyparts: IBodyPartNodes; body: IBodyNodes } } = {
  1: {
    bodyparts: {
      leftarm: { bodyPart: new BodyPart([110, 86], arm, -1, [546, 413], true), ref: undefined },
      rightarm: { bodyPart: new BodyPart([400, 86], arm, -1, [546, 413]), ref: undefined},
      leftleg: { bodyPart: new BodyPart([45, 34], foot, 0, [144, 47]), ref: undefined},
      rightleg: { bodyPart: new BodyPart([45, 34], foot, 0, [144, 47], true), ref: undefined},
      eyes: { bodyPart: new BodyPart([167.5, 167.5], eyes, 2, [335, 335]), ref: undefined},
      head: undefined,
      mouth: { bodyPart: new BodyPart([170, 138], mouth, 2, [375, 144]), ref: undefined},
    }, 
    body: {
      leftarm: [33, 600],
      rightarm: [752, 600],
      leftleg: [300, 1200],
      rightleg: [490, 1200],
      eyes: [405, 390],
      head: undefined,
      mouth: [405, 765],
    }
  },
  2: {
    bodyparts: {
      leftarm: { bodyPart: new BodyPart([110, 86], arm, -1, [546, 413], true), ref: undefined },
      rightarm: { bodyPart: new BodyPart([400, 86], arm, -1, [546, 413]), ref: undefined},
      leftleg: { bodyPart: new BodyPart([45, 34], foot, 0, [144, 47]), ref: undefined},
      rightleg: { bodyPart: new BodyPart([45, 34], foot, 0, [144, 47], true), ref: undefined},
      eyes: { bodyPart: new BodyPart([500, 500, 0.5], eyes2, 2, [1000, 1000]), ref: undefined},
      head: undefined,
      mouth: { bodyPart: new BodyPart([170, 138], mouth, 2, [375, 144]), ref: undefined},
    },
    body: {
      leftarm: [33, 600],
      rightarm: [752, 600],
      leftleg: [300, 1200],
      rightleg: [490, 1200],
      eyes: [405, 390],
      head: undefined,
      mouth: [405, 765],
    }
  }
}

const emptyBodyPartNodes: IBodyPartNodes = {
  leftarm: bodysInfo[1].bodyparts.leftarm,
  rightarm: bodysInfo[1].bodyparts.rightarm,
  leftleg: bodysInfo[1].bodyparts.leftleg,
  rightleg: bodysInfo[1].bodyparts.rightleg,
  eyes: bodysInfo[1].bodyparts.eyes,
  head: bodysInfo[1].bodyparts.head,
  mouth: bodysInfo[1].bodyparts.mouth,
}

const emptyNodes: IBodyNodes = {
  leftarm: [0, 0],
  rightarm: [0, 0],
  leftleg: [0, 0],
  rightleg: [0, 0],
  eyes: [0, 0],
  head: [0, 0],
  mouth: [0, 0],
}

export interface ITransforms {
  x: number,
  y: number,
  scale: number
}

export class Body {
  bodypartnodes: IBodyPartNodes;
  nodes: IBodyNodes;
  width: number;
  height: number;
  bodyImage: ImageSourcePropType | undefined;
  transforms: ITransforms;
  
  constructor(bodypartnodes: IBodyPartNodes = emptyBodyPartNodes, nodes: IBodyNodes = emptyNodes, dimensions: Array<number>, transforms: ITransforms, bodyImage: ImageSourcePropType | undefined) {
    this.bodypartnodes = bodypartnodes;
    this.nodes = nodes;
    this.bodyImage = bodyImage;
    this.width = dimensions[0];
    this.height = dimensions[1];
    this.transforms = transforms;
  }
}
