import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React from "react";
import imageLogo from "../../public/RMponterosso.png";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "white",
  borderRadius: 10,
  boxShadow: "0 0 30px rgba(255, 98, 0, 0.6)",
  position: "relative",
  left: "50%",
  right: "50%",
}));

const LogoApp: React.FC = () => {
  return (
    <StyledBox>
      <Image
        sizes="100vw"
        // Make the image display full width
        style={{
          width: "100%",
          height: "auto",
        }}
        alt="Logo"
        src={imageLogo}
      />
    </StyledBox>
  );
};

export default LogoApp;
