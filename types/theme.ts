import {
  GamingBlue,
  GamingRed,
  GamingGreen,
  ClassicDark,
  ClassicLight,
  FantasyLight,
  FantasyDark,
} from "../src/contexts/themes/themes";

export type ThemeMode =
  | typeof GamingBlue
  | typeof GamingRed
  | typeof GamingGreen
  | typeof ClassicDark
  | typeof ClassicLight
  | typeof FantasyLight
  | typeof FantasyDark;
