import { createContext } from "react";
import { Colors } from "../global";

type colorInformation = {
  color: Colors,
  setColor: React.Dispatch<React.SetStateAction<Colors>> | undefined
}

export const colorInitial: colorInformation = {
  color: 'Blue', 
  setColor: undefined
}


const ColorContext = createContext<colorInformation>(colorInitial);
export default ColorContext

// ** const { color, setColor } = useContext(ColorContext); ** //