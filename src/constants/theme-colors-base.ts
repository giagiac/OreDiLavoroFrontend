import { grey, lightGreen } from "@mui/material/colors";

export interface ThemeColors {
  dark: {
    main: string;
    hover: string;
  };
  light: {
    main: string;
    hover: string;
  };
}

export type TipoButton = "not_defined" | "crea_modifica" | "storico";

export const TipoButtonBaseColors: Record<TipoButton, ThemeColors> = {
  // BUTTONS
  not_defined: {
    dark: {
      main: grey[900],
      hover: grey[800],
    },
    light: {
      main: grey[300],
      hover: grey[400],
    },
  },
  crea_modifica: {
    dark: {
      main: lightGreen[900],
      hover: lightGreen[800],
    },
    light: {
      main: lightGreen[300],
      hover: lightGreen[400],
    },
  },
  storico: {
    dark: {
      main: grey[900],
      hover: grey[800],
    },
    light: {
      main: grey[300],
      hover: grey[400],
    },
  },
};
