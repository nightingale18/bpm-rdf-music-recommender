import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SongDescButton from "./SongDescButton";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ThingDescButton() {
  const [device, setDevice] = useState("");
  const [randBMP, setRandBMP] = useState(null);
  const [playerOn, setPlayerOn] = useState(false);
  const [genre, setGenre] = useState("");
  const [audioSource, setAudioSource] = useState("");
  const intervalRef = useRef(null);
  const [bpmUrl, setBpmUrl] = useState(null);

  // Fetch Thing Description once to get bpmUrl when component mounts or on Start click
  const getTD = async () => {
    try {
      const tdResponse = await axios.get(`${API_BASE}/thingDescription`);
      const td = tdResponse.data;
      const bpmUrl = td.events.currentHeartRate.forms[0].href;
      setBpmUrl(bpmUrl);
      setPlayerOn(true);
    } catch (err) {
      console.error("Error fetching Thing Description:", err);
    }
  };

  // Poll bpmUrl every 5 seconds once bpmUrl is set
  useEffect(() => {
    if (!bpmUrl) return;

    const fetchBpm = async () => {
      try {
        const response = await axios.get(bpmUrl);
        const newBpm = response.data.randBMP;
        setRandBMP(newBpm);

        // Fetch genre and song from backend recommendation endpoint
        const recRes = await axios.get(`${API_BASE}/recommend`, {
          params: { bpm: newBpm },
        });
        setGenre(recRes.data.genre);
        setAudioSource(recRes.data.audioUrl);
      } catch (err) {
        console.error("Error fetching BPM or recommendation:", err);
      }
    };

    fetchBpm();

    // Set interval for polling every 5 seconds
    intervalRef.current = setInterval(fetchBpm, 5000);

    // Cleanup on unmount or bpmUrl change
    return () => clearInterval(intervalRef.current);
  }, [bpmUrl]);

  return (
    <div>
      <div id="startButton">
        <input
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          placeholder="enter URI desc (not used now)"
        />
        <button className="beautiful-button" onClick={getTD}>
          Start
        </button>
      </div>

      {randBMP !== null && (
        <div className="result-container">
          <p className="result-label">Current BPM:</p>
          <p className="result-value">{randBMP}</p>
        </div>
      )}

      {playerOn && genre && audioSource && (
        <div className="result-container">
          <SongDescButton
            audioSource={audioSource}
            genre={genre}
            playerOn={playerOn}
          />
        </div>
      )}
    </div>
  );
}
