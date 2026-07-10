import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SkillForge AI — Learn Smarter with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "radial-gradient(circle at 20% 15%, rgba(99,91,241,0.35) 0%, transparent 50%), radial-gradient(circle at 85% 10%, rgba(20,184,166,0.3) 0%, transparent 50%), #0b0f1a",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 32,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 72,
                        height: 72,
                        borderRadius: 20,
                        background: "linear-gradient(135deg, #635BF1, #14B8A6)",
                    }}
                >
                    <div style={{ fontSize: 36, color: "white" }}>✦</div>
                </div>
                <div
                    style={{
                        fontSize: 44,
                        fontWeight: 700,
                        color: "white",
                        letterSpacing: "-0.02em",
                    }}
                >
                    SkillForge AI
                </div>
            </div>
            <div
                style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: "white",
                    textAlign: "center",
                    maxWidth: 880,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                }}
            >
                Learn Smarter with AI
            </div>
            <div
                style={{
                    fontSize: 26,
                    color: "rgba(255,255,255,0.65)",
                    marginTop: 24,
                    textAlign: "center",
                    maxWidth: 720,
                }}
            >
                Expert-led courses. An intelligent AI tutor. Real career
                outcomes.
            </div>
        </div>,
        { ...size },
    );
}
