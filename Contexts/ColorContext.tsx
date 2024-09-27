import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { Colors } from "../global";


export const colorThemes: IColorThemes = {
  Purple: {
    theme: {
      backgroundColor: "#FFFFFF",
      interactionPrimary: "hsl(266.51162790697674, 100%, 66.27450980392156%)",
      interactionShadow: "hsl(267.2268907563025, 50.210970464135016%, 46.470588235294116%)",
      typographyDark: "#4D4752",
      customizationBar: "#F3F4F6",
      customizationBarStroke: "#E5E7EB",
    }
  },
  Blue: { // hsl(208.5, 100%, 68.62745098039215%)
    theme: {
      backgroundColor: "hsl(208, 100%, 97.09803921568627%)",
      interactionPrimary: "hsl(208, 100%, 66.54901960784314%)",
      interactionShadow: "hsl(208, 100%, 40.54901960784314%)",
      typographyDark: "#4D4752",
      customizationBar: "hsl(208, 100%, 95.09803921568627%)",
      customizationBarStroke: "hsl(208, 100%, 89.99999999999999%)",
    }
  },
  Pink: {
    theme: { // #FF85FF
      backgroundColor: "hsl(282.35294117647055, 36.17021276595744%, 98.7843137254902%)",
      interactionPrimary: "hsl(300, 100%, 66.07843137254902%)",
      interactionShadow: "hsl(300, 70%, 40.07843137254902%)",
      typographyDark: "hsl(300, 7%, 30%)",
      customizationBar: "hsl(300, 100%, 95.88235294117646%)",
      customizationBarStroke: "hsl(300, 100%, 90.98039215686275%)",
    }
  },
  Yellow: { // #FFF385
    theme: {
      backgroundColor: "hsl(54, 100%, 95.88235294117646%)",
      interactionPrimary: "hsl(54, 100%, 66.07843137254902%)",
      interactionShadow: "hsl(54, 100%, 40.07843137254902%)",
      typographyDark: "#4D4752",
      customizationBar: "hsl(54, 100%, 90.88235294117646%)",
      customizationBarStroke: "hsl(54, 100%, 65.98039215686275%)",
    }
  },
  Green: {
    theme: {
      backgroundColor: "#FFFFFF",
      interactionPrimary: "#9F53FF",
      interactionShadow: "#713BB2",
      typographyDark: "#4D4752",
      customizationBar: "#F3F4F6",
      customizationBarStroke: "#E5E7EB",
    }
  },
  Brown: {
    theme: {
      backgroundColor: "#FFFFFF",
      interactionPrimary: "#9F53FF",
      interactionShadow: "#713BB2",
      typographyDark: "#4D4752",
      customizationBar: "#F3F4F6",
      customizationBarStroke: "#E5E7EB",
    }
  },
}


interface IColorThemes {
  [key: string]: { theme: { [key: string]: string } };
}

interface IColorTheme {
  theme: { [key: string]: string }
}

type colorInformation = {
  color: Colors,
  setColor: React.Dispatch<React.SetStateAction<Colors>> | undefined,
  colorTheme: IColorTheme
}

const colorInitial: colorInformation = {
  color: 'Blue', 
  setColor: undefined,
  colorTheme: colorThemes.Purple
}

export const ColorContext = createContext<colorInformation>(colorInitial);

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState<Colors>('Blue');
  const [colorTheme, setColorTheme] = useState<IColorTheme>(colorThemes.Purple);

  // Update the colorTheme with color
  useEffect(() => {
    setColorTheme(colorThemes[color]);
    console.log("first", color, colorThemes[color])
  }, [color])

  return (
    <ColorContext.Provider
      value={{
        color,
        setColor,
        colorTheme
      }}
    >
      {children}
    </ColorContext.Provider>
  )  
}

// ** const { color, setColor, colorTheme } = useContext(ColorContext); ** //