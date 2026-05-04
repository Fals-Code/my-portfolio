import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Falah.dev - Backend Architect";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to right bottom, #0C0C0F, #131318)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              background: "rgba(0, 229, 160, 0.1)",
              border: "1px solid rgba(0, 229, 160, 0.2)",
              borderRadius: "50px",
            }}
          >
            <span style={{ color: "#00E5A0", fontSize: 24, fontWeight: "bold" }}>HTTP 200 OK</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 80,
              color: "#F0EEE8",
              margin: "20px 0",
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            Ahmad Mathlaul Falah
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 40,
              color: "#A1A1AA",
              margin: 0,
            }}
          >
            Backend Architect & API Specialist
          </p>

          <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
            <span style={{ color: "#4D9CFF", fontSize: 30 }}>Laravel</span>
            <span style={{ color: "#A1A1AA", fontSize: 30 }}>·</span>
            <span style={{ color: "#FFB347", fontSize: 30 }}>MySQL</span>
            <span style={{ color: "#A1A1AA", fontSize: 30 }}>·</span>
            <span style={{ color: "#00E5A0", fontSize: 30 }}>Clean Architecture</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#00E5A0", fontSize: 30, fontWeight: "bold" }}>Falah.dev</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
