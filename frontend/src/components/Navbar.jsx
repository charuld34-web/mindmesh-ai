import React from "react";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px",
        borderRadius: "15px",
        background: darkMode
          ? "#1e1e1e"
          : "white",
        boxShadow:
          "0px 4px 12px rgba(0,0,0,0.1)",
        marginBottom: "30px",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            fontSize: "40px",
          }}
        >
          🧠
        </div>

        {/* TITLE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              lineHeight: "1.2",
            }}
          >
            MindMesh AI Dashboard
          </h1>

          <p
            style={{
              marginTop: "5px",
              marginBottom: 0,
              color: "gray",
              fontSize: "14px",
            }}
          >
            Smart Employee Analytics
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* TROPHY BUTTON */}
        <button
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#ffd700",
            fontWeight: "bold",
          }}
        >
          🏆 Top Team
        </button>

        {/* DARK MODE */}
        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: darkMode
              ? "#444"
              : "#222",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {darkMode
            ? "☀️ Light"
            : "🌙 Dark"}
        </button>

        {/* LOGOUT */}
        <button
          onClick={() => {
  localStorage.removeItem("loggedIn");
  window.location.reload();
}}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#ff4d4d",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;