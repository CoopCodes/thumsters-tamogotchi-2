import { Ref, RefObject, useEffect, useRef } from "react";
import { Dimensions } from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Body parts

import body from "./assets/resources/Monsters/1/Body.svg";


import Egg from "./assets/resources/images/Food/egg.svg";
import Bread from "./assets/resources/images/Food/bread.svg";
import Apple from "./assets/resources/images/Food/apple.svg";
import Cheese from "./assets/resources/images/Food/cheese.svg";
import Banana from "./assets/resources/images/Food/banana.svg";

import { SvgProps } from "react-native-svg";
import { Poppins_900Black } from "@expo-google-fonts/poppins";
import { RiveRef } from "rive-react-native";
import { MonsterInfo } from "./Contexts/MonsterContext";

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
export interface BodyPartOptions { 
  colorInputs?: string[];
  reflected?: boolean;
  badContrast?: boolean;
}

// Types:
type Categories = "Body" | "Head" | "Eyes" | "Mouth" | "Arm" | "Leg" | undefined;

export class BodyPart {
  category: Categories;
  bodySet: string; // What bodySet it belongs too, (one bodySet could be the harold)
  artboardName: string;
  colorInputs: string[] = [];
  transitionInputName: string | undefined = undefined; // "Lips Mouth" for example
  
  reflected: boolean = false;
  badContrast: boolean = false; // IF listed as a ListBodyPart: adds a white background to increase contrast.

  id: string;

  stateMachineName: string | undefined = undefined;


  constructor(
    category: Categories,
    artboardName: string,
    bodySet: string,
    options: BodyPartOptions = {},
    transitionInputName: string | undefined = undefined,
  ) {
    this.category = category;
    this.bodySet = bodySet;
    this.transitionInputName = transitionInputName || "";

    if (options) {
      this.colorInputs = options.colorInputs || [];
      this.reflected = options.reflected || false;
      this.badContrast = options.badContrast || false;
    }

    this.artboardName = artboardName;
    
    this.id = makeid(6);
  }
}



export class Body {
  bodyparts: IBodyParts;
  bodyArtboard: string;
  bodyColor: string; // Changes all the bodyparts to this color
  bodyTransitionInput: string;

  constructor(
    bodyparts: IBodyParts = emptybodyparts,
    bodyArtboard: string,
    bodyColor: string,
    bodyTransitionInput: string
  ) { 
    this.bodyparts = bodyparts;
    this.bodyArtboard = bodyArtboard;
    this.bodyColor = bodyColor;
    this.bodyTransitionInput = bodyTransitionInput;
  }
  
  isBodyPartOnBody(bodypart: BodyPart): boolean {
    if (bodypart.category === "Body") {
      return this.bodyArtboard === bodySets[bodypart?.bodySet].body.bodyArtboard
    } else {
      return Object.values(this.bodyparts).filter((b: BodyPart) => b?.id === bodypart.id).length === 1;
    }

  }
}


export interface IBodyParts {
  leftarm: BodyPart;
  rightarm: BodyPart;
  leftleg: BodyPart;
  rightleg: BodyPart;
  eyes: BodyPart;
  head: BodyPart | undefined; // Some bodies do not have heads
  mouth: BodyPart;
}

export const moodInputs: string[] = [
  "Happy",
  "Sad",
  "Eat",
]

export const stateMachineName = "State Machine 1";


export type Colors = "Pink" | "Yellow" | "Green" | "Blue" | "Brown"

const standardColors = [
  "Pink",
  "Yellow",
  "Green",
  "Blue",
  "Brown",
];

//   colorInputs?: string[] = [];
//   transitionInputName?: string = undefined;
//   reflected?: boolean = undefined;
//   badContrast?: boolean = undefined;

export const nodeBodyPart: [Categories, string] = [undefined, "Node"]

// If multiple bodysets are using the same bodypart
const defaultMouth: [Categories, string] = ["Mouth", "Mouth"]
const singleEye: [Categories, string] = ["Eyes", "Eye"]


export const bodySets: {
  [key: string]: { body: Body };
} = {
  "Nodes": {
    body: new Body({
      leftarm: new BodyPart("Arm", "Node", "Nodes"),
      rightarm: new BodyPart("Arm", "Node", "Nodes"),
      leftleg: new BodyPart("Leg", "Node", "Nodes"),
      rightleg: new BodyPart("Leg", "Node", "Nodes"),
      eyes: new BodyPart("Eyes", "Node", "Nodes"),
      head: undefined,
      mouth: new BodyPart("Eyes", "Node", "Nodes"),
    }, "Nodes Torso", "", "")
  },
  "Harold": {
    body: new Body({
      leftarm: new BodyPart("Arm", "Harold Arm", "Harold"),
      rightarm: new BodyPart("Arm", "Harold Arm", "Harold", { reflected: true }),
      leftleg: new BodyPart("Leg", "Harold Leg", "Harold"),
      rightleg: new BodyPart("Leg", "Harold Leg", "Harold", { reflected: true }),
      eyes: new BodyPart(...singleEye, "Harold", {
        colorInputs: standardColors,
      }, "Default Eye"),
      head: undefined,
      mouth: new BodyPart(...defaultMouth, "Harold", {
        colorInputs: standardColors,
      }, "Default Mouth"),
    }, "Harold Torso", "Blue", "")
  },
  "Toddler": {
    body: new Body({
      leftarm: new BodyPart("Arm", "Harold Arm", "Toddler"),
      rightarm: new BodyPart("Arm", "Harold Arm", "Toddler", { reflected: true }),
      leftleg: new BodyPart("Leg", "Harold Leg", "Toddler"),
      rightleg: new BodyPart("Leg", "Harold Leg", "Toddler", { reflected: true }),
      eyes: new BodyPart(...singleEye, "Toddler", {
        colorInputs: standardColors,
      }, "Default Eye"),
      head: undefined,
      mouth: new BodyPart("Mouth", "Many Teeth Mouth", "Toddler", {
        colorInputs: standardColors,
      }, "Many Teeth Mouth"),    }, "Yellow Todler Torso", "Yellow", "To Todler")
  },
  "Pinky": {
    body: new Body({
      leftarm: new BodyPart("Arm", "Harold Arm", "Pinky"),
      rightarm: new BodyPart("Arm", "Harold Arm", "Pinky", { reflected: true }),
      leftleg: new BodyPart("Leg", "Harold Leg", "Pinky"),
      rightleg: new BodyPart("Leg", "Harold Leg", "Pinky", { reflected: true }),
      eyes: new BodyPart("Eyes", "Double Eyes", "Pinky", {
        colorInputs: standardColors,
      }, "Double Eyes"),
      head: undefined,
      mouth: new BodyPart("Mouth", "Double Teeth Mouth", "Pinky", {
        colorInputs: standardColors,
      }, "Double Teeth Mouth"),    
    }, "Pinky Torso", "Pink", "To Pinky")
  },
  "Fat Blue": {
    body: new Body({
      leftarm: new BodyPart("Arm", "Harold Arm", "Fat Blue"),
      rightarm: new BodyPart("Arm", "Harold Arm", "Fat Blue", { reflected: true }),
      leftleg: new BodyPart("Leg", "Harold Leg", "Fat Blue"),
      rightleg: new BodyPart("Leg", "Harold Leg", "Fat Blue", { reflected: true }),
      eyes: new BodyPart("Eyes", "Big Glasses", "Fat Blue", {
        colorInputs: standardColors,
      }, "Big Glasses"),
      head: undefined,
      mouth: new BodyPart("Mouth", "Lips Mouth", "Fat Blue", {}, "Lips Mouth"),    
    }, "Fat Blue Torso", "Blue", "To Fat Blue")
  },
  "Long Blue": {
    body: new Body({
      leftarm: new BodyPart("Arm", "Long Blue Arm", "Long Blue"),
      rightarm: new BodyPart("Arm", "Long Blue Arm", "Long Blue", { reflected: true }),
      leftleg: new BodyPart("Leg", "Long Blue Leg", "Long Blue"),
      rightleg: new BodyPart("Leg", "Long Blue Leg", "Long Blue", { reflected: true }),
      eyes: new BodyPart("Eyes", "EyeBrow Eyes", "Long Blue", {
        colorInputs: standardColors,
      }, "EyeBrow Eyes"),
      head: undefined,
      mouth: new BodyPart(...defaultMouth, "Long Blue", {
        colorInputs: standardColors,
      }, "Default Mouth"),   
    }, "Long Blue Torso", "Blue", "To Long Blue")
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

const allBodyParts: BodyPart[] = [];

let keys = Object.keys(bodySets)

Object.values(bodySets).forEach((body, i) => {
  Object.values(body.body.bodyparts).map((bodyPart: BodyPart) => {
    if (bodyPart !== undefined && bodyPart.bodySet !== "Nodes")
      allBodyParts.push(
        bodyPart,
      )
  });

  // Creating the body as a bodypart
  allBodyParts.push(
    new BodyPart("Body", body.body.bodyArtboard, keys[i], {}, body.body.bodyTransitionInput),
  );
});

export const AllBodyParts = allBodyParts;

// Default value for nodes in a Body class, if parameter is undefined
const emptybodyparts: IBodyParts = bodySets["Nodes"].body.bodyparts;

export interface ITransforms {
  x: number;
  y: number;
  scale: number;
}

export const nodeRangeThreshold = 0;

export type OnRemoveType = (bodyPartToRemove: BodyPart) => void;

export const emptyBody: MonsterInfo = {
  Body: bodySets["Nodes"].body,
  RiveRef: undefined,
}


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
    numOwned: 2,
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

function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const intervalDuration = 1000