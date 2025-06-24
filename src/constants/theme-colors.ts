import { TipoTrasferta } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";
import {
  brown,
  green,
  grey,
  indigo,
  lightBlue,
  orange,
  purple,
  red,
} from "@mui/material/colors";

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

export type TipoTrasfertaButton =
  | "km_autista_button"
  | "fuori_sede_button"
  | "in_sede_button"
  | "not_defined";

export const TipoTrasfertaColors: Record<
  TipoTrasferta | TipoTrasfertaButton,
  ThemeColors
> = {
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
  km_autista_button: {
    dark: {
      main: green[900],
      hover: green[800],
    },
    light: {
      main: green[300],
      hover: green[400],
    },
  },
  fuori_sede_button: {
    dark: {
      main: lightBlue[900],
      hover: lightBlue[800],
    },
    light: {
      main: lightBlue[300],
      hover: lightBlue[400],
    },
  },
  in_sede_button: {
    dark: {
      main: red[900],
      hover: red[800],
    },
    light: {
      main: red[300],
      hover: red[400],
    },
  },
  // CARDS
  in_sede: {
    dark: {
      main: red[900],
      hover: red[800],
    },
    light: {
      main: red[300],
      hover: red[400],
    },
  },
  in_giornata: {
    dark: {
      main: lightBlue[900],
      hover: lightBlue[800],
    },
    light: {
      main: lightBlue[300],
      hover: lightBlue[400],
    },
  },
  in_giornata_dopo_21: {
    dark: {
      main: indigo[900],
      hover: indigo[800],
    },
    light: {
      main: indigo[300],
      hover: indigo[400],
    },
  },
  fuori_sede_andata: {
    dark: {
      main: brown[50],
      hover: brown[100],
    },
    light: {
      main: brown[900],
      hover: brown[800],
    },
  },
  fuori_sede_ritorno_in_giornata: {
    dark: {
      main: brown[900],
      hover: brown[800],
    },
    light: {
      main: brown[300],
      hover: brown[400],
    },
  },
  fuori_sede_ritorno_dopo_21: {
    dark: {
      main: orange[900],
      hover: orange[800],
    },
    light: {
      main: orange[500],
      hover: orange[600],
    },
  },
  ancora_in_trasferta_0: {
    dark: {
      main: purple[900],
      hover: purple[800],
    },
    light: {
      main: purple[100],
      hover: purple[50],
    },
  },
  ancora_in_trasferta_10: {
    dark: {
      main: purple[700],
      hover: purple[600],
    },
    light: {
      main: purple[300],
      hover: purple[200],
    },
  },
  ancora_in_trasferta_20: {
    dark: {
      main: purple[500],
      hover: purple[400],
    },
    light: {
      main: purple[500],
      hover: purple[400],
    },
  },
  ancora_in_trasferta_30: {
    dark: {
      main: purple[300],
      hover: purple[200],
    },
    light: {
      main: purple[700],
      hover: purple[600],
    },
  },
  ancora_in_trasferta_40: {
    dark: {
      main: purple[50],
      hover: purple[100],
    },
    light: {
      main: purple[900],
      hover: purple[800],
    },
  },
  step1_km_autista: {
    dark: {
      main: green[900],
      hover: green[800],
    },
    light: {
      main: green[300],
      hover: green[400],
    },
  },
};
