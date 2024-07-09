import { createContext } from "react";
import { IFood, AllFoods } from "../global";

type allFoodsInformation = {
  allFoods: IFood[],
  setAllFoods: React.Dispatch<React.SetStateAction<IFood[]>> | undefined
}

export const allFoodsInitial: allFoodsInformation = {
  allFoods: AllFoods, 
  setAllFoods: undefined
}


const AllFoodsContext = createContext<allFoodsInformation>(allFoodsInitial);
export default AllFoodsContext

// ** const { allFoods, setAllFoods } = useContext(allFoodsContext); ** //