import { Ref, RefObject, useEffect, useRef } from "react";
import { Dimensions } from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Body parts
import arm from "./assets/resources/Monsters/1/Arm.svg";
import body from "./assets/resources/Monsters/1/Body.svg";
import eyes from "./assets/resources/Monsters/1/Eye.svg";
import eyesSleeping from "./assets/resources/Monsters/1/EyesSleeping.svg";
// import eyesBadContrast from "./assets/resources/Monsters/1/Eye_BadContrast.svg";
import foot from "./assets/resources/Monsters/1/Foot.svg";
import eyes2 from "./assets/resources/Monsters/2/eyes.svg";
import mouth from "./assets/resources/Monsters/1/Mouth.svg";
import node from "./assets/resources/Monsters/1/Nodenode.svg";
import arm2 from "./assets/resources/Monsters/2/arm.svg";

import mouthSad from "./assets/resources/Monsters/1/MouthSad.svg";
import eyesHappy from "./assets/resources/Monsters/1/EyesHappy.svg";
import mouthHappy from "./assets/resources/Monsters/1/MouthHappy.svg";
import mouthOpen from "./assets/resources/Monsters/1/MouthEating.svg";

import Egg from "./assets/resources/images/Food/egg.svg";
import Bread from "./assets/resources/images/Food/bread.svg";
import Apple from "./assets/resources/images/Food/apple.svg";
import Cheese from "./assets/resources/images/Food/cheese.svg";
import Banana from "./assets/resources/images/Food/banana.svg";

import { SvgProps } from "react-native-svg";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { RiveRef } from "rive-react-native";

export const bodyImage = body;

export const categories = [
  "Body",
  "Head",
  "Eyes",
  "Mouth",
  "Arm",
  "Leg",
] as const;

interface ITheme {
  default: { [key: string]: string };
}

export const theme: ITheme = {
  default: {
    backgroundColor: "#FFFFFF",
    interactionPrimary: "#9F53FF",
    interactionShadow: "#713BB2",
    typographyDark: "#4D4752",
    customizationBar: "#F3F4F6",
    customizationBarStroke: "#E5E7EB",
    health: "rgba(255, 72, 72, 1)",
    hunger: "rgba(243, 173, 97, 1)",
    happiness: "rgba(2, 217, 160, 1)",
    energy: "rgba(245, 216, 0, 1)",
  },
};

// Usually a boolean, but if number specified, then will add an offset to the left/right/top/bottom/center, if undefined then will do nothing. If number 0, will be taken as undefined.
export interface IAlignments { 
  leftAlign?: boolean | number | undefined;
  rightAlign?: boolean | number | undefined;
  topAlign?: boolean | number | undefined;
  bottomAlign?: boolean | number | undefined;
  
  centerHorizontalAlign?: boolean | number | undefined;
  centerVerticalAlign?: boolean | number | undefined;
}

// Types:

export class BodyPart {
  node: number[]; // The Nodes position, this is where the body part connects to the body.
  // reflected: boolean; // Is the body part reflected (would be if was a left arm, and the image is for right)
  zIndex: number;
  category: "Body" | "Head" | "Eyes" | "Mouth" | "Arm" | "Leg" | undefined;

  width: number; // Determined by dimensions parameter
  height: number; // Determined by dimensions parameter
  scale: number;
  aspectRatio: number[];
  badContrast: boolean; // IF listed as a ListBodyPart: adds a white background to increase contrast.

  image: string | React.FC<SvgProps>; // Image path, if it is a string, then its rive
  imageBadContrast: string | React.FC<SvgProps> | undefined; // IF listed as a ListBodyPart: if specified replaces the default image with this, to increase contrast. Must have the same dimension.

  bodySet: number; // What bodySet it belongs too, (one bodySet could be the harold)

  alignments: IAlignments;

  // moodsImages: { [key: string]: React.FC<SvgProps> }[] | undefined;

  constructor(
    node: number[],
    image: string | React.FC<SvgProps>,
    zIndex: number,
    category: "Body" | "Head" | "Eyes" | "Mouth" | "Arm" | "Leg" | undefined,
    dimensions: Array<number>,
    bodySet: number,
    options?: {
      badContrast?: boolean | undefined,
      imageBadContrast?: string | React.FC<SvgProps> | undefined,
      alignments?: IAlignments | undefined
    }
    // moodsImages: { [key: string]: string | React.FC<SvgProps> }[] | undefined = undefined
  ) {
    this.node = node;
    // this.reflected = reflected === undefined ? false : true;
    // this.reflected = true;
    this.zIndex = zIndex;
    this.category = category;

    this.width = dimensions[0];
    this.height = dimensions[1];
    this.scale = dimensions[2] ? dimensions[2] : 1;
    this.aspectRatio = [this.width / this.height, this.height / this.width];
    this.image = image;
    this.bodySet = bodySet;
    
    if (options !== undefined) {
      this.badContrast = options.badContrast || false;

      this.imageBadContrast = options.imageBadContrast;

      this.alignments = options.alignments ? options.alignments : { leftAlign: undefined, rightAlign: undefined, topAlign: undefined, bottomAlign: undefined, centerHorizontalAlign: undefined, centerVerticalAlign: undefined };
    } else {
      this.badContrast = false;
      this.imageBadContrast = undefined;
      this.alignments = { leftAlign: undefined, rightAlign: undefined, topAlign: undefined, bottomAlign: undefined, centerHorizontalAlign: undefined, centerVerticalAlign: undefined };
    }

    // this.moodsImages = moodsImages;

    // Object.values(bodysInfo).map((body, index) => {
    //   // Object.values(body.bodyparts).filter((bodypart) => { bodypart ===  })
    //   const bodyparts = Object.values(body.bodyparts);
    //   if (bodyparts.includes(this)) {
    //     console.log(index)
    //     this.bodySet = index;
    //   }
    // })
  }
}

export type OnNodePress = (bodypart: BodyPart) => void;

export type bodyPartInfo = {
  // Used in the Monster.tsx Component
  bodyPart: BodyPart;
  moodBodyParts?: { [key: string]: BodyPart }[];
  onPress?: OnNodePress;
  ref: RefObject<any> | undefined; //  User defined
  riveRef: RefObject<RiveRef> | undefined
};

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
  // x and y positions of the nodes on the body, not the actual body parts on the body.
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

const offsetX = -35; // For some reason

// Assets: right now it is loading only the first monster, but this needs to be changed so it is dynamic.
// Loading the bodySets
export const bodySets: {
  [key: number]: { bodyparts: IBodyPartNodes; body: IBodyNodes };
} = {
  0: {
    bodyparts: {
      leftarm: {
        bodyPart: new BodyPart(
          [25, 25, 2],
          node,
          5,
          "Arm",
          [150, 150],
          0, {
            badContrast: true,
          }
        ),
        ref: undefined,
        riveRef: undefined
      },
      rightarm: {
        bodyPart: new BodyPart([25, 25, 2], node, 5, "Arm", [150, 150], 0),
        ref: undefined,
        riveRef: undefined
      },
      leftleg: {
        bodyPart: new BodyPart([25, 25, 2], node, 5, "Leg", [150, 150], 0),
        ref: undefined,
        riveRef: undefined
      },
      rightleg: {
        bodyPart: new BodyPart(
          [25, 25, 2],
          node,
          5,
          "Leg",
          [150, 150],
          0, {
            badContrast: true,
          }
        ),
        ref: undefined,
        riveRef: undefined
      },
      eyes: {
        bodyPart: new BodyPart([0, 100], node, 5, "Eyes", [250, 250], 0,{
          alignments: {
            centerHorizontalAlign: true,
          }
        }),
        ref: undefined,
        riveRef: undefined
      },
      head: undefined,
      mouth: {
        bodyPart: new BodyPart([0, 0], node, 5, "Mouth", [250, 250], 0, {
          alignments: {
            centerHorizontalAlign: true,
          }
        }),
        ref: undefined,
        riveRef: undefined
      },
    },
    body: {
      leftarm: [45, 600],
      rightarm: [752, 600],
      leftleg: [300, 1200],
      rightleg: [490, 1200],
      eyes: [405, 390],
      head: undefined,
      mouth: [405, 765],
    },
  },
  1: {
    bodyparts: {
      leftarm: {
        // bodyPart: new BodyPart([110, 86, 1], arm, -1, "Arm", [546, 413], 1),
        bodyPart: new BodyPart([30, 189.99 * 1.8, 1], "Arm", -1, "Arm", [265 * 1.8, 404 * 1.8], 1),
        ref: undefined,
        riveRef: undefined
      },
      rightarm: {
        // bodyPart: new BodyPart([400, 86], "Arm", -1, "Arm", [546, 413], 1),
        bodyPart: new BodyPart([30, 189.99 * 1.8], "Arm", -1, "Arm", [265 * 1.8, 404 * 1.8], 1),
        ref: undefined,
        riveRef: undefined
      },
      leftleg: {
        bodyPart: new BodyPart([45, 34], foot, 0, "Leg", [144, 47], 1),
        ref: undefined,
        riveRef: undefined
      },
      rightleg: {
        bodyPart: new BodyPart([45, 34], foot, 0, "Leg", [144, 47], 1),
        ref: undefined,
        riveRef: undefined
      },
      eyes: {
        bodyPart: new BodyPart(
          [500, 500],
          "Eye",
          2,
          "Eyes",
          [1000, 1000, 0.33],
          1,
          {
            badContrast: true,
            alignments: { centerHorizontalAlign: true }
          }
        ),
        ref: undefined,
        riveRef: undefined
      },
      head: undefined,
      mouth: {
        // bodyPart: new BodyPart(
        //   [25, 25],
        //   mouth,
        //   2,
        //   "Mouth",
        //   [375, 144, 0.85],
        //   1, undefined, undefined, 
        //   // [
        //   //   { "sad": mouthSad },
        //   //   { "happy": mouthHappy },
        //   // ]
        // ),
        // moodBodyParts: [
        //   { "mouthopen": new BodyPart([-50, -20], mouthOpen, 2, "Mouth", [199, 115, 1.8], 1) }
        // ],
        bodyPart: new BodyPart(
          [93, 80],
          "Mouth",
          3,
          "Mouth",
          [188 * 2, 133 * 2],
          1,
          {
            alignments: {
              centerHorizontalAlign: true
            }
          }
        ),
        ref: undefined,
        riveRef: undefined
      },
    },
    body: {
      leftarm: [65 + offsetX, 600],
      rightarm: [752 + offsetX, 600],
      leftleg: [300 + offsetX, 1150],
      rightleg: [490 + offsetX, 1150],
      eyes: [365, 340],
      head: undefined,
      mouth: [215, 600],
    },
  },
  2: {
    bodyparts: {
      leftarm: {
        // bodyPart: new BodyPart([300, 86, 1], arm, 2, "Arm", [546, 413], 2),
        bodyPart: new BodyPart([110, 86, 1], arm, -1, "Arm", [546, 413], 1),
        ref: undefined,
        riveRef: undefined
      },
      rightarm: {
        bodyPart: new BodyPart([200, 600, 1], arm2, -1, "Arm", [955, 984], 2),
        // bodyPart: new BodyPart([200, 600], arm2, -1, "Arm", [955, 984], 2),
        ref: undefined,
        riveRef: undefined
      },
      leftleg: {
        bodyPart: new BodyPart([45, 34], foot, 0, "Leg", [144, 47], 2),
        ref: undefined,
        riveRef: undefined
      },
      rightleg: {
        bodyPart: new BodyPart([45, 34, 1], foot, 0, "Leg", [144, 47], 2),
        ref: undefined,
        riveRef: undefined
      },
      eyes: {
        bodyPart: new BodyPart(
          [(99*3) / 2, (95*3) / 2],
          eyes2,
          2,
          "Eyes",
          [99*3, 95*3, 1.2],
          2, {
            alignments: { centerHorizontalAlign: true }
          }
        ),
        ref: undefined,
        riveRef: undefined
      },
      head: undefined,
      mouth: {
        bodyPart: new BodyPart([170, 138], mouth, 2, "Mouth", [375, 144], 2, {
          alignments: {
            centerHorizontalAlign: true,
          }
        }
        ),
        ref: undefined,
        riveRef: undefined
      },
    },
    body: {
      leftarm: [33, 600],
      rightarm: [752, 600],
      leftleg: [300, 1200],
      rightleg: [490, 1200],
      eyes: [405, 390],
      head: undefined,
      mouth: [405, 765],
    },
  },
};

export function useLoadFonts() {
    // Fonts Loading
    const [loaded, error] = useFonts({
      Poppins_900Black
    })
    useEffect(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]);
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
// allbodyparts.map((bodypart) =>
//   console.log(bodypart);
// })

// Converting all the bodyparts listed in bodySets, to a list of ListBodyPartType, to be consumed by the Locker Room Component

const allBodyParts: ListBodyPartType[] = [];

// Traverse through each body
Object.values(bodySets).forEach((bodyInfo, index) => {
  // Traverse through bodyparts of each body
  for (const bodyPartKey in bodyInfo.bodyparts) {
    const bodyPartInfo =
      bodyInfo.bodyparts[bodyPartKey as keyof IBodyPartNodes];
    if (bodyPartInfo !== undefined && index !== 0) {
      // bodyPartInfo might be undefined
      allBodyParts.push({
        key: ``,
        bodyPart: bodyPartInfo.bodyPart,
      });
    }
  }
});

allBodyParts.map((part, index) => {
  part.key = `${index}`;
});

export const AllBodyParts = allBodyParts;

// Default value for nodes in a Body class, if parameter is undefined
const emptyBodyPartNodes: IBodyPartNodes = {
  leftarm: bodySets[1].bodyparts.leftarm,
  rightarm: bodySets[1].bodyparts.rightarm,
  leftleg: bodySets[1].bodyparts.leftleg,
  rightleg: bodySets[1].bodyparts.rightleg,
  eyes: bodySets[1].bodyparts.eyes,
  head: bodySets[1].bodyparts.head,
  mouth: bodySets[1].bodyparts.mouth,
};

const emptyNodes: IBodyNodes = {
  leftarm: [0, 0],
  rightarm: [0, 0],
  leftleg: [0, 0],
  rightleg: [0, 0],
  eyes: [0, 0],
  head: [0, 0],
  mouth: [0, 0],
};

export interface ITransforms {
  x: number;
  y: number;
  scale: number;
}

export const nodeRangeThreshold = 0;

export class Body {
  bodypartnodes: IBodyPartNodes;
  nodes: IBodyNodes;
  width: number;
  height: number;
  bodyImage: string | React.FC<SvgProps> | undefined;
  transforms: ITransforms;

  constructor(
    bodypartnodes: IBodyPartNodes = emptyBodyPartNodes,
    nodes: IBodyNodes = emptyNodes,
    dimensions: Array<number>,
    transforms: ITransforms,
    bodyImage: string | React.FC<SvgProps> | undefined
  ) {
    this.bodypartnodes = bodypartnodes;
    this.nodes = nodes;
    this.bodyImage = bodyImage;
    this.width = dimensions[0];
    this.height = dimensions[1];
    this.transforms = transforms;
  }

  // translateNodes(nodes: IBodyPartNodes): IBodyPartNodes {
  //   // let newNodes: IBodyPartNodes = JSON.parse(JSON.stringify(nodes)); // Deep copy
  //   let newNodes: IBodyPartNodes = Object.assign({}, nodes); // Shallow copy
  //   if (nodes !== undefined && newNodes !== undefined) {
  //     Object.values(newNodes).map((bodypart: bodyPartInfo, index: number) => {
  //       if (bodypart !== undefined && bodypart.bodyPart !== undefined && Object.values(nodes)[index] !== undefined) {
  //         bodypart.bodyPart.node[1] = bodypart.bodyPart.node[1] + 10;
  //         Object.values(nodes)[index].bodyPart.node[1] += 2;
  //         // console.log("New Node: " + bodypart.bodyPart.node[1]);
  //         // console.log("Old Node: " + Object.values(nodes)[index].bodyPart.node[1])
  //       }
  //     })
  //   }
  //   return newNodes;
  // }
}

export type OnRemoveType = (bodyPartToRemove: BodyPart) => void;

export const emptyBody: Body = new Body(
  undefined,
  undefined,
  [0, 0],
  { x: 0, y: 0, scale: 1 },
  undefined
);

export type emptyFunction = () => void;

export type ChangeBodyPart = (
  bodyPart: BodyPart,
  side: "left" | "right" | ""
) => void;

// Food stuff

export const foodCategories = ["Misc", "Fruit", "Veges", "Meat"];

export interface IFood {
  name: string;
  perk: number;
  price: number;
  category: (typeof foodCategories)[number];
  image: React.FC<SvgProps>;
  numOwned: number;
}

export const AllFoods: IFood[] = [
  // Apple, banana, bread, cheese, egg
  {
    name: "Egg",
    perk: 3,
    price: 1,
    category: "Misc",
    image: Egg,
    numOwned: 0,
  },
  {
    name: "Cheese",
    perk: 3,
    price: 1,
    category: "Misc",
    image: Cheese,
    numOwned: 0,
  },
  {
    name: "Bread",
    perk: 20,
    price: 1,
    category: "Misc",
    image: Bread,
    numOwned: 0,
  },
  {
    name: "Banana",
    perk: -10,
    price: 1,
    category: "Fruit",
    image: Banana,
    numOwned: 0,
  },
  {
    name: "Apple",
    perk: 3,
    price: 1,
    category: "Fruit",
    image: Apple,
    numOwned: 0,
  },
];

export const vw = (vw: number) => Dimensions.get("window").width * (vw / 100);
export const vh = (vh: number) => Dimensions.get("window").height * (vh / 100);

export function usePrevious(value: any) {
  const ref = useRef<any>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export type bodyPartCategoriesSide = "eyes" | "head" | "leftarm" | "leftleg" | "mouth" | "rightarm" | "rightleg";

export function isBodyPartCategorySide(value: string): value is bodyPartCategoriesSide {
  return ["eyes", "head", "leftarm", "leftleg", "mouth", "rightarm", "rightleg"].includes(value);
}
