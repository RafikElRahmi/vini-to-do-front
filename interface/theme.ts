'use client'
import { ReactNode } from 'react';
import { ThemeMode } from "../types/theme";

export interface ThemeContextType {
  setModeTheme: (mode: ThemeMode) => void;
  getModeTheme: () => ThemeMode;
}
export interface UseModeProps {
  children: ReactNode;
}