"use client";

import {
  TipoTrasfertaButton,
  TipoTrasfertaColors,
} from "@/constants/theme-colors";
import { TipoTrasferta } from "@/services/api/types/eps-nestjs-orp-eff-cicli-esec";

import Button, { ButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useParams } from "next/navigation";
import React from "react";

interface ButtonTipoTrasfertaProps extends Omit<ButtonProps, "children"> {
  /**
   * Callback function to be called when the button is clicked
   */
  onClickAction: () => void;
  /**
   * Optional children to render inside the button
   */
  icon?: React.ReactNode;
  label?: string | undefined;
  tipoTrasfertaButton?: TipoTrasfertaButton | TipoTrasferta | undefined;
}

export function ButtonTipoTrasferta({
  onClickAction,
  icon,
  label,
  tipoTrasfertaButton,
  ...buttonProps
}: ButtonTipoTrasfertaProps) {
  const theme = useTheme();
  const params = useParams<{
    type: TipoTrasferta;
  }>();
  const tipoTrasferta = params.type || tipoTrasfertaButton;

  const color =
    theme.palette.mode === "dark"
      ? TipoTrasfertaColors[tipoTrasferta as TipoTrasferta].dark
      : TipoTrasfertaColors[tipoTrasferta as TipoTrasferta].light;

  return (
    <Button
      {...buttonProps}
      style={{
        //height: 50,
        fontSize: "1rem",
      }}
      sx={(theme) => ({
        backgroundColor: color.main,
        color: theme.palette.getContrastText(color.main),
        "&:hover": {
          backgroundColor: color.hover,
        },
      })}
      fullWidth
      size="medium"
      variant="outlined"
      onClick={onClickAction}
    >
      {icon}
      {label}
    </Button>
  );
}
