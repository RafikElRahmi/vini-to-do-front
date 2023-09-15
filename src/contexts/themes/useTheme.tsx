"use client";
import React, {
  useContext,
  useState,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import { ClassicLight, MODES } from "./themes";
import { LocalStorage } from "node-localstorage";
import { ThemeMode } from "../../../types/theme";
import { ThemeContextType, UseModeProps } from "@interface/theme";

const ThemeContext = createContext<ThemeContextType | null>(null);

export const UseMode: React.FC<UseModeProps> = ({ children }) => {
  if (typeof localStorage === 'undefined' || localStorage === null ) {
    global.localStorage = new LocalStorage('./scratch');
  }
  const fromStorage: string | null = localStorage.getItem("theme");
  const defaultTheme: any = MODES.includes(fromStorage)
    ? fromStorage
    : () => {
      localStorage.setItem("theme", ClassicLight);
        return ClassicLight;
      };
  const [mode, setmode] = useState<ThemeMode>(defaultTheme);
  const setModeTheme = (modeInput: ThemeMode) => {
    if (MODES.includes(modeInput)) {
      localStorage.setItem("theme", modeInput);
      setmode(modeInput);
    } else {
      localStorage.setItem("theme", ClassicLight);
      setmode(ClassicLight);
    }
  };
  const getModeTheme = (): ThemeMode => {
    return mode;
  };
  return (
    <ThemeContext.Provider value={{ setModeTheme, getModeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = (): ThemeContextType => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error("useTheme must be used within a UseMode provider");
  }
  return themeContext;
};
