import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React from "react";

const StyledBox = styled(Box)(({ theme }) => ({
  width: 200,
  padding: theme.spacing(10),
  backgroundColor: "white",
  borderRadius: 10,
  boxShadow: "0 0 30px rgba(255, 98, 0, 0.6)",
}));

const LogoApp: React.FC = () => {
  return (
    <StyledBox>
      <Image
        alt="Logo"
        src="/RMponterosso.png"
        width={180}
        style={{ height: "auto" }}
      />
    </StyledBox>
  );
};

export default LogoApp;
