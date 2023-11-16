import { Ref, useRef } from 'react';
import { Image, ImageSourcePropType } from 'react-native'

// Body parts
import arm from "./assets/resources/Monsters/1/Arm.png";
import body from "./assets/resources/Monsters/1/Body.png";
import eyes from "./assets/resources/Monsters/1/Eye.png";
import foot from "./assets/resources/Monsters/1/Foot.png";
import eyes2 from "./assets/resources/Monsters/1/eye2.png";
import mouth from "./assets/resources/Monsters/1/Mouth.png";
import node from "./assets/resources/Monsters/1/Nodenode.png";  

import ImageNotImplemented from "./assets/resources/images/ImageNotImplemented.png"

export const bodyImage = body;

export const categories = [
  'Body', 'Head', 'Eyes', 'Mouth', 'Arm', 'Leg'
] as const;

interface ITheme {
    default: { [key: string]: string };
}

export const theme: ITheme = {
  default: {
    "backgroundColor": '#8053FF',
    "interactionPrimary": '#9F53FF',
    "interactionShadow": '#713BB2',
    "customizationBar": '#734CE3',
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
  category: 'Body' | 'Head' | 'Eyes' | 'Mouth' | 'Arm' | 'Leg' | undefined;

  width: number;
  height: number;
  aspectRatio: number[];

  image: ImageSourcePropType; // Image path
  
  constructor(node: number[], image: ImageSourcePropType,
    zIndex: number, category: 'Body' | 'Head' | 'Eyes' | 'Mouth' | 'Arm' | 'Leg' | undefined, dimensions: Array<number>, reflected?: boolean | undefined) {
    this.node = node;
    this.reflected = (reflected === undefined)? false : true;
    this.zIndex = zIndex;
    this.category = category;

    this.width = dimensions[0];
    this.height = dimensions[1];
    this.aspectRatio = [
      this.width / this.height,
      this.height / this.width
    ]

    this.image = image;
  }
}

export type OnNodePress = (bodypart: BodyPart) => void;

export type bodyPartInfo = {
  bodyPart: BodyPart,
  onPress?: OnNodePress,
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
    0: {
      bodyparts: {
        leftarm: { bodyPart: new BodyPart([25, 25, 2], node, 1, undefined,[50, 50], true), ref: undefined },
        rightarm: { bodyPart: new BodyPart([25, 25, 2], node, 1, undefined,[50, 50]), ref: undefined},
        leftleg: { bodyPart: new BodyPart([25, 25, 2], node, 1, undefined,[50, 50]), ref: undefined},
        rightleg: { bodyPart: new BodyPart([25, 25, 2], node, 1, undefined, [50, 50], true), ref: undefined},
        eyes: { bodyPart: new BodyPart([25, 25, 2], node, 1, undefined,[50, 50]), ref: undefined},
        head: undefined,
        mouth: { bodyPart: new BodyPart([25, 25, 2], node, 1, undefined,[50, 50]), ref: undefined},
      },
      body: {
        leftarm: [45, 600],
        rightarm: [752, 600],
      leftleg: [300, 1200],
      rightleg: [490, 1200],
      eyes: [405, 390],
      head: undefined,
      mouth: [405, 765], 
    }
  },
  1: {
    bodyparts: {
      leftarm: { bodyPart: new BodyPart([110, 86], arm, -1, 'Arm', [546, 413], true), ref: undefined },
      rightarm: { bodyPart: new BodyPart([400, 86], arm, -1, 'Arm', [546, 413]), ref: undefined},
      leftleg: { bodyPart: new BodyPart([45, 34], foot, 0, 'Leg', [144, 47]), ref: undefined},
      rightleg: { bodyPart: new BodyPart([45, 34], foot, 0, 'Leg',[144, 47], true), ref: undefined},
      eyes: { bodyPart: new BodyPart([500, 500, 0.5], eyes, 2, 'Eyes',[1000, 1000]), ref: undefined},
      head: undefined,
      mouth: { bodyPart: new BodyPart([25, 25], mouth, 2, 'Mouth',[50, 50]), ref: undefined},
    }, 
    body: {
      leftarm: [65, 600],
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
      leftarm: { bodyPart: new BodyPart([110, 86], arm, -1, 'Arm', [546, 413], true), ref: undefined },
      rightarm: { bodyPart: new BodyPart([400, 86], arm, -1, 'Arm', [546, 413]), ref: undefined},
      leftleg: { bodyPart: new BodyPart([45, 34], foot, 0, 'Leg', [144, 47]), ref: undefined},
      rightleg: { bodyPart: new BodyPart([45, 34], foot, 0, 'Leg',[144, 47], true), ref: undefined},
      eyes: { bodyPart: new BodyPart([500, 500, 0.5], eyes2, 2, 'Eyes',[1000, 1000]), ref: undefined},
      head: undefined,
      mouth: { bodyPart: new BodyPart([170, 138], mouth, 2, 'Mouth', [375, 144]), ref: undefined},
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
}


interface ListBodyPartType {
  key: string;
  bodyPart: BodyPart;
}

// let allbodyparts: ListBodyPartType[] = [];

// let i = 0;
// for (let key in bodysInfo) {
  //   let bodyInfo = bodysInfo[key];
  //   let bodyParts = Object.values(bodyInfo.bodyparts);
  //   allbodyparts = allbodyparts.concat(bodyParts);
  //   i++;
  // }
  // allbodyparts.map((bodypart) => {
    //   console.log(bodypart);
    // })

    const allBodyParts: ListBodyPartType[] = [];
    
// Traverse through each body 
Object.values(bodysInfo).forEach((bodyInfo, index) => {
  // Traverse through bodyparts of each body
  for (const bodyPartKey in bodyInfo.bodyparts) {
    const bodyPartInfo = bodyInfo.bodyparts[bodyPartKey as keyof IBodyPartNodes];
    if (bodyPartInfo !== undefined) { // bodyPartInfo might be undefined
      allBodyParts.push({
        key: ``,
        bodyPart: bodyPartInfo.bodyPart,
      })
    }
  }
});

allBodyParts.map((part, index) => {
  part.key =`${index}`
  // console.log(part)
})

export const AllBodyParts = allBodyParts;

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

const roomDistanceFromVPTop = 150;
export const nodeRangeThreshold = 0;

export class Body {
  bodypartnodes: IBodyPartNodes;
  bodypartnodesRelToVP: IBodyPartNodes;
  nodes: IBodyNodes;
  width: number;
  height: number;
  bodyImage: ImageSourcePropType | undefined;
  transforms: ITransforms;
  
  constructor(bodypartnodes: IBodyPartNodes = emptyBodyPartNodes, nodes: IBodyNodes = emptyNodes, dimensions: Array<number>, transforms: ITransforms, bodyImage: ImageSourcePropType | undefined) {
    this.bodypartnodes = bodypartnodes;
    this.bodypartnodesRelToVP = this.translateNodes(this.bodypartnodes);
    this.nodes = nodes;
    this.bodyImage = bodyImage;
    this.width = dimensions[0];
    this.height = dimensions[1];
    this.transforms = transforms;
  }
  
  translateNodes(nodes: IBodyPartNodes): IBodyPartNodes {
    // let newNodes: IBodyPartNodes = JSON.parse(JSON.stringify(nodes)); // Deep copy
    let newNodes: IBodyPartNodes = Object.assign({}, nodes); // Shallow copy
    if (nodes !== undefined && newNodes !== undefined) {
      Object.values(newNodes).map((bodypart: bodyPartInfo, index: number) => {
        if (bodypart !== undefined && bodypart.bodyPart !== undefined && Object.values(nodes)[index] !== undefined) {
          bodypart.bodyPart.node[1] = bodypart.bodyPart.node[1] + 10;
          Object.values(nodes)[index].bodyPart.node[1] += 2;
          // console.log("New Node: " + bodypart.bodyPart.node[1]);
          // console.log("Old Node: " + Object.values(nodes)[index].bodyPart.node[1])
        }
      })
    }
    return newNodes;
  }
}

export type OnRemoveType = (bodyPartToRemove: BodyPart) => void;

export const emptyBody: Body = new Body(undefined, undefined, [0, 0], {x: 0, y: 0, scale: 1}, undefined)