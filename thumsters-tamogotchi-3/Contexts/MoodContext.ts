import { createContext } from "react";

type moodInformation = {
  mood: string,
  setMood: React.Dispatch<React.SetStateAction<string>> | undefined
}

const initial: moodInformation = {
  mood: "", 
  setMood: undefined
}


const MoodContext = createContext<moodInformation>(initial);
export default MoodContext