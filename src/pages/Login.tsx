import React from "react";

const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "4rem" }}>
      <h1>Welcome to the Chore App!</h1>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          background: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "2rem",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
