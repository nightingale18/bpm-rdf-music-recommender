import React, { useEffect, useRef } from "react";

export default function SongDescButton({ genre, audioSource, playerOn }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (playerOn && audioSource && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioSource;
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.warn("Audio play was prevented:", err);
      });
    }
  }, [audioSource, playerOn]);

  if (!playerOn || !audioSource) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: "bold", marginBottom: 4 }}>
        Song Recommendation:
      </div>
      <div style={{ fontStyle: "italic", marginBottom: 8 }}>{genre}</div>
      <audio ref={audioRef} controls autoPlay style={{ width: "100%" }} />
    </div>
  );
}
