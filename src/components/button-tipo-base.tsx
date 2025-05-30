"use client";

import {
  TipoButton,
  TipoButtonBaseColors,
} from "@/constants/theme-colors-base";
import Button, { ButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import React from "react";

interface ButtonBaseProps extends Omit<ButtonProps, "children"> {
  /**
   * Callback function to be called when the button is clicked
   */
  onClickAction: () => void;
  /**
   * Optional children to render inside the button
   */
  icon?: React.ReactNode;
  label?: string | undefined;
  tipoButton?: TipoButton | undefined;
}

export function ButtonTipoBase({
  onClickAction,
  icon,
  label,
  tipoButton,
  ...buttonProps
}: ButtonBaseProps) {
  const theme = useTheme();

  const safeTipoButton = tipoButton ?? "not_defined"; // Replace "default" with a valid key from TipoButtonBaseColors
  const color =
    theme.palette.mode === "dark"
      ? TipoButtonBaseColors[safeTipoButton].dark
      : TipoButtonBaseColors[safeTipoButton].light;

  return (
    <Button
      {...buttonProps}
      style={{
        height: 50,
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
