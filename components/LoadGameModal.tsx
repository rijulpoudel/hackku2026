"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { listSaves, deleteSave, SaveSlot } from "@/lib/save-game";
import { playSfx } from "@/lib/audio";
import { CharacterType } from "@/types/game";

interface Props {
  onClose: () => void;
}

export function LoadGameModal({ onClose }: Props) {
  const router = useRouter();
  const [saves, setSaves] = useState<SaveSlot[]>([]);

  useEffect(() => {
    setSaves(listSaves());
  }, []);

  function handleLoad(slot: SaveSlot) {
    playSfx("click");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "launch_load_save",
        JSON.stringify(slot.playerState),
      );
      sessionStorage.setItem("launch_character", slot.character);
      sessionStorage.setItem("launch_name", slot.characterName);
    }
    router.push("/game");
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    playSfx("click");
    deleteSave(id);
    setSaves(listSaves());
  }

  // Placeholder images for characters if we don't have exact scene images
  const CHAR_IMAGES: Record<CharacterType, string> = {
    maya: "/your_scence/Grad student.svg",
    alex: "/your_scence/Corporate employee.svg",
    jordan: "/your_scence/Freelance.svg",
    sam: "/your_scence/Side hustler.svg",
  };

  return (
    <main className="landing-main" style={{ zIndex: 10 }}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="landing-content"
          style={{ flexDirection: "column" }}
        >
          <div
            style={{
              position: "relative",
              width: "70vw",
              maxWidth: "1400px",
              marginTop: "120px",
            }}
          >
            {/* Animated elements from landing screen context */}
            <motion.div
              className="landing-butterfly"
              animate={{
                rotate: [0, -3, 0, 3, 0],
                scaleY: [1, 1.05, 1, 0.95, 1],
                filter: [
                  "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))",
                  "brightness(1.3) drop-shadow(0 0 12px rgba(255,255,255,0.6))",
                  "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ bottom: "90%", left: "-10%", width: "15%" }}
            >
              <Image
                src="/landing/butter fly.svg"
                alt="Butterfly"
                width={150}
                height={150}
                className="landing-responsive-img"
              />
            </motion.div>

            <motion.div
              className="landing-constellation"
              animate={{
                opacity: [0.3, 1, 0.3],
                filter: [
                  "brightness(0.8) drop-shadow(0 0 0px rgba(255,255,255,0))",
                  "brightness(1.5) drop-shadow(0 0 20px rgba(255,255,255,0.9))",
                  "brightness(0.8) drop-shadow(0 0 0px rgba(255,255,255,0))",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ bottom: "85%", right: "-12%", width: "25%" }}
            >
              <Image
                src="/landing/CONSETELATION.svg"
                alt="Constellation"
                width={250}
                height={250}
                className="landing-responsive-img"
              />
            </motion.div>

            {/* Notebook container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1.6",
              }}
            >
              <Image
                src="/your_scence/Frame_board.svg"
                alt="Notebook Board"
                fill
                style={{ objectFit: "contain" }}
                priority
              />

              {/* Back to landing overlay button */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "-5%",
                  right: "0%",
                  zIndex: 30,
                  background: "rgba(53, 67, 102, 0.8)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: `'HYWenHei', system-ui, sans-serif`,
                }}
              >
                ← Back to main menu
              </button>

              {/* Notebook Content Layout */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: "7% 6% 8% 6%",
                  display: "flex",
                }}
              >
                {/* Left Panel */}
                <div
                  style={{
                    width: "32%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    textAlign: "center",
                    paddingTop: "6%",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: `'HYWenHei', system-ui, sans-serif`,
                      color: "#344966",
                      fontSize: "clamp(1rem, 1.8vw, 1.8rem)",
                      fontWeight: 400,
                      marginBottom: "40%",
                    }}
                  >
                    Saved Scenes
                  </h2>
                  <div style={{ padding: "0 10%", marginTop: "5%" }}>
                    <p
                      style={{
                        fontFamily: `'HYWenHei', system-ui, sans-serif`,
                        color: "#415779",
                        fontSize: "clamp(0.9rem, 1.4vw, 1.3rem)",
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      This is where all your saved scenes are. Jump in anytime
                      and rewind your scenes!
                    </p>
                  </div>
                </div>

                {/* Right Panel - Saves List */}
                <div
                  className="custom-scrollbar"
                  style={{
                    width: "68%",
                    display: "flex",
                    alignItems: "center",
                    gap: "2vw",
                    paddingLeft: "3vw",
                    overflowX: "auto",
                    paddingBottom: "2rem",
                    paddingTop: "4%",
                  }}
                >
                  {saves.length === 0 ? (
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        color: "#415779",
                        fontSize: "1.2rem",
                        fontFamily: `'HYWenHei'`,
                      }}
                    >
                      No saved scenes yet. Play the game to save your choices!
                    </div>
                  ) : (
                    saves.map((slot) => {
                      const charImage =
                        CHAR_IMAGES[slot.character as CharacterType] || "";
                      return (
                        <motion.div
                          key={slot.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLoad(slot)}
                          style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          {/* Frame Container */}
                          <div
                            style={{
                              position: "relative",
                              width: "clamp(130px, 13vw, 200px)",
                              aspectRatio: "0.8",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {/* Inner Content Container */}
                            <div
                              style={{
                                position: "absolute",
                                top: "12%",
                                bottom: "12%",
                                left: "12%",
                                right: "12%",
                                zIndex: 0,
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#f8fafc",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {charImage ? (
                                <Image
                                  src={charImage}
                                  alt={slot.characterName}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <div style={{ fontSize: "3rem" }}>
                                  {slot.characterEmoji}
                                </div>
                              )}
                            </div>

                            {/* Outer Border Frame */}
                            <Image
                              src="/your_scence/scene_frame.svg"
                              alt="Scene frame"
                              fill
                              style={{
                                objectFit: "contain",
                                zIndex: 10,
                                pointerEvents: "none",
                              }}
                            />
                          </div>

                          {/* Title Underneath */}
                          <p
                            style={{
                              marginTop: "0.8rem",
                              fontFamily: `'HYWenHei', system-ui, sans-serif`,
                              color: "#537292",
                              fontSize: "clamp(1rem, 1.3vw, 1.5rem)",
                              fontWeight: 800,
                            }}
                          >
                            Story: {slot.characterName.split(" ")[0]}
                          </p>

                          {/* Delete Save Button */}
                          <button
                            onClick={(e) => handleDelete(e, slot.id)}
                            style={{
                              position: "absolute",
                              top: "-8%",
                              right: "-8%",
                              zIndex: 20,
                              background: "#ef4444",
                              color: "#fff",
                              border: "2px solid rgba(255,255,255,0.8)",
                              borderRadius: "50%",
                              width: "2rem",
                              height: "2rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.9rem",
                              cursor: "pointer",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#dc2626")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "#ef4444")
                            }
                          >
                            ✕
                          </button>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
