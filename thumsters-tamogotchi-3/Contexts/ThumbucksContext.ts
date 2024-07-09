import { createContext } from "react";

type thumbucksInformation = {
  thumbucks: number,
  setThumbucks: React.Dispatch<React.SetStateAction<number>> | undefined
}

export const thumbucksInitial: thumbucksInformation = {
  thumbucks: 20, 
  setThumbucks: undefined
}


const ThumbucksContext = createContext<thumbucksInformation>(thumbucksInitial);
export default ThumbucksContext

// ** const { thumbucks, setThumbucks } = useContext(ThumbucksContext); ** //