import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3eee4",
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "6px solid #c73e2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#1d1c1a" }} />
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, color: "#1d1c1a" }}>radiusgame</div>
        <div style={{ fontSize: 32, color: "#8a8479", marginTop: 16 }}>
          Guess the radius. Daily.
        </div>
      </div>
    ),
    { ...size },
  );
}
