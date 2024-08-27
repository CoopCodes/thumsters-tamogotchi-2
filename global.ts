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
  category: "Body" | "Head" | "Eyes" | "Mouth" | "Arm" | "Leg" | undefined;

  badContrast: boolean; // IF listed as a ListBodyPart: adds a white background to increase contrast.

  bodySet: number; // What bodySet it belongs too, (one bodySet could be the harold)


  constructor(
    category: "Body" | "Head" | "Eyes" | "Mouth" | "Arm" | "Leg" | undefined,
    bodySet: number,
    badContrast: boolean
  ) {
    this.category = category;

    this.bodySet = bodySet;

    // this.id = Math.random().toString(36).substring(2, 10) + (Math.random() * 100000000).toString(36);
    
    this.badContrast = badContrast || false;
  }
}

export class Body {
  bodypartnodes: IBodyPartNodes;
  bodyArtboard: string

  constructor(
    bodypartnodes: IBodyPartNodes = emptyBodyPartNodes,
    bodyArtboard: string
  ) {
    this.bodypartnodes = bodypartnodes;
    this.bodyArtboard = bodyArtboard;
  }
}


export interface IBodyPartNodes {
  leftarm: BodyPart;
  rightarm: BodyPart;
  leftleg: BodyPart;
  rightleg: BodyPart;
  eyes: BodyPart;
  head: BodyPart | undefined; // Some bodies do not have heads
  mouth: BodyPart;
}

export const bodySets: {
  [key: string]: { bodyparts: IBodyPartNodes };
} = {
  "Harold": {
    bodyparts: {
      leftarm: ,
      rightarm: ,
      leftleg: ,
      rightleg: ,
      eyes: ,
      head: undefined,
      mouth: ,
    },
  },
  "Toddler": {
    bodyparts: {
      leftarm: ,
      rightarm: ,
      leftleg: ,
      rightleg: ,
      eyes: ,
      head: undefined,
      mouth: ,
    },
  },
  "AAAH": {
    bodyparts: {
      leftarm: ,
      rightarm: ,
      leftleg: ,
      rightleg: ,
      eyes: ,
      head: undefined,
      mouth: ,
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

export interface ITransforms {
  x: number;
  y: number;
  scale: number;
}

export const nodeRangeThreshold = 0;

export type OnRemoveType = (bodyPartToRemove: BodyPart) => void;

// export const emptyBody: Body = new Body(
//   undefined,
//   undefined,
//   [0, 0],
//   { x: 0, y: 0, scale: 1 },
//   undefined
// );

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
