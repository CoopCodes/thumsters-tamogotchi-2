import { createContext } from "react";

const ShowAttributesContext = createContext<{
  showAttributesBar: boolean;
  setShowAttributeBar: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  showAttributesBar: true,
  setShowAttributeBar: () => {},
});

export default ShowAttributesContext;
