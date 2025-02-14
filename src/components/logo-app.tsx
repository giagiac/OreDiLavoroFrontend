import React from "react";

const LogoApp: React.FC = () => {
  return (
    <div
      style={{
        width: 200,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        boxShadow: "0 0 30px rgba(255, 98, 0, 0.6)",
        textAlign: "center",
      }}
    >
      <img
        src="/RMponterosso.png"
        style={{ width: 100 }}
      />
    </div>
  );
};

export default LogoApp;
