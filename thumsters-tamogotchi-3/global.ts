import { Ref } from 'react';
import { Image, ImageSourcePropType } from 'react-native'

// Body parts
import Arm from "./assets/resources/Monsters/1/Arm.svg"; // Gotta change to svg

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

export const bodyParts: [BodyPart] = [
  new BodyPart(node: [0, 0], ),
]

// Types:

export class BodyPart {
  node: [number, number]; // The Nodes position, this is where the body part connects to the body.
  image: ImageSourcePropType; // Image path
  
  constructor(node: [number, number], image: ImageSourcePropType) {
    this.node = node;
    this.image = image;
  }
}

type bodyPartInfo = {
  coords: {
    x: number;
    y: number;
  }, 
  bodyPart: BodyPart,
  ref: Ref<Image> | null
}

interface IBodyPartNodes {
  leftarm: bodyPartInfo;
  rightarm: bodyPartInfo;
  leftleg: bodyPartInfo;
  rightleg: bodyPartInfo;
  eyes: bodyPartInfo;
  mouth: bodyPartInfo;
}

export class Body {
  nodes: IBodyPartNodes;
  image: ImageSourcePropType;

  constructor(nodes: IBodyPartNodes, image: ImageSourcePropType) {
    this.nodes = nodes;
    this.image = image;
  }
}
