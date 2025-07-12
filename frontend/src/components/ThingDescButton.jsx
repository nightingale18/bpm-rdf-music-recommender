import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SongDescButton from "./SongDescButton";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ThingDescButton() {
  const [device, setDevice] = useState("");
  const [randBMP, setRandBMP] = useState(null);
  const [playerOn, setPlayerOn] = useState(false);
  const [genre, setGenre] = useState('');
  const [audioSource, setAudioSource] = useState('');
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
          params: { bpm: newBpm }
        });
        setGenre(recRes.data.genre);
        setAudioSource(recRes.data.audioUrl);

      } catch (err) {
        console.error("Error fetching BPM or recommendation:", err);
      }
    };

    // Initial fetch
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


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import SongDescButton from "./SongDescButton";
// import { useSongDesc } from '../hooks/useSongDesc';

// const API_BASE = "http://localhost:3001";

// export default function ThingDescButton() {
//   const [device, setDevice] = useState("");
//   const [randBMP, setRandBMP] = useState(null);
//   const [playerOn, setPlayerOn] = useState(false);
//   const { audioSource, genre } = useSongDesc(randBMP);
//   const intervalRef = useRef(null);
//   const [bpmUrl, setBpmUrl] = useState(null);

//   // Fetch Thing Description once to get bpmUrl when component mounts or on Start click
//   const getTD = async () => {
//     try {
//       const tdResponse = await axios.get(`${API_BASE}/thingDescription`);
//       const td = tdResponse.data;
//       const bpmUrl = td.events.currentHeartRate.forms[0].href;
//       setBpmUrl(bpmUrl);
//       setPlayerOn(true);
//     } catch (err) {
//       console.error("Error fetching Thing Description:", err);
//     }
//   };

//   // Poll bpmUrl every 5 seconds once bpmUrl is set
//   useEffect(() => {
//     if (!bpmUrl) return;

//     const fetchBpm = async () => {
//       try {
//         const response = await axios.get(bpmUrl);
//         setRandBMP(response.data.randBMP);
//       } catch (err) {
//         console.error("Error fetching BPM:", err);
//       }
//     };

//     // Initial fetch
//     fetchBpm();

//     // Set interval for polling every 5 seconds
//     intervalRef.current = setInterval(fetchBpm, 5000);

//     // Cleanup on unmount or bpmUrl change
//     return () => clearInterval(intervalRef.current);
//   }, [bpmUrl]);

//   return (
//     <div>
//       <div id="startButton">
//         <input
//           value={device}
//           onChange={(e) => setDevice(e.target.value)}
//           placeholder="enter URI desc (not used now)"
//         />
//         <button className="beautiful-button" onClick={getTD}>
//           Start
//         </button>
//       </div>

//       {randBMP !== null && (
//         <div className="result-container">
//           <p className="result-label">Current BPM:</p>
//           <p className="result-value">{randBMP}</p>
//         </div>
//       )}

//       {playerOn && (
//         <div className="result-container">
//           <SongDescButton
//             audioSource={audioSource}
//             genre={genre}
//             playerOn={playerOn}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState } from "react";
// import axios from "axios";
// import SongDescButton from "./SongDescButton";
// import { useSongDesc } from '../hooks/useSongDesc';

// const API_BASE = "http://localhost:3001";

// export default function ThingDescButton() {
//   // const { audioSource, genre } = useSongDesc(randBMP);
//   const [device, setDevice] = useState("");
//   const [randBMP, setRandBMP] = useState(null);
//   // const [audioSource, setAudioSource] = useState(null);
//   const [playerOn, setPlayerOn] = useState(false);
//   // const [genre, setGenre] = useState(null);
//   const { audioSource, genre } = useSongDesc(randBMP);

//   const getTD = async () => {
//     try {
//       // 1. Fetch the Thing Description
//       const tdResponse = await axios.get(`${API_BASE}/thingDescription`);
//       const td = tdResponse.data;
      
//       // 2. Extract event endpoint
//       const bpmUrl = td.events.currentHeartRate.forms[0].href;

//       // 3. Call the event endpoint (simulate subscription with polling)
//       const response = await axios.get(bpmUrl);
//       const { randBMP } = response.data;
  

//       setRandBMP(randBMP);
      
//       // await useSongDesc();
//       // console.log("td: ", response.data)
//       setPlayerOn(true);
//     } catch (err) {
//       console.error("Error fetching TD or BPM:", err);
//     }
//   };

//   return (
//     <div>
//       <div id="startButton">
//         <input
//           value={device}
//           onChange={(e) => setDevice(e.target.value)}
//           placeholder="enter URI desc (not used now)"
//         />
//         <button className="beautiful-button" onClick={getTD}>
//           Start
//         </button>
//       </div>

//       {randBMP !== null && (
//         <div className="result-container">
//           <p className="result-label">Current Value:</p>
//           <p className="result-value">{randBMP}</p>
//         </div>
//       )}

//       {playerOn && (
//         <div className="result-container">
//           <SongDescButton
//             audioSource={audioSource}
//             genre={genre}
//             playerOn={playerOn}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SongDescButton from "./SongDescButton";
// import { useSongDesc } from "../hooks/useSongDesc";

// const API_BASE = "http://localhost:3001";

// export default function ThingDescButton() {
//   const [device, setDevice] = useState("");
//   const [randBMP, setRandBMP] = useState(null);
//   const [pollingActive, setPollingActive] = useState(false);

//   // Custom hook returns updated song info based on current randBMP
//   const { audioSource, genre } = useSongDesc(randBMP);

//   // Fetch Thing Description and get BPM endpoint URL
//   const [bpmUrl, setBpmUrl] = useState(null);

//   // On Start button: fetch TD and set bpmUrl, start polling
//   const startPolling = async () => {
//     try {
//       const tdResponse = await axios.get(`${API_BASE}/thingDescription`);
//       const td = tdResponse.data;
//       const bpmEndpoint = td.events.currentHeartRate.forms[0].href;
//       setBpmUrl(bpmEndpoint);
//       setPollingActive(true);
//     } catch (err) {
//       console.error("Error fetching Thing Description:", err);
//     }
//   };

//   // Poll BPM every 5 seconds, update randBMP state
//   useEffect(() => {
//     if (!pollingActive || !bpmUrl) return;

//     let intervalId = null;

//     const fetchBpm = async () => {
//       try {
//         const response = await axios.get(bpmUrl, { headers: { "Cache-Control": "no-cache" } });
//         setRandBMP(response.data.randBMP);
//       } catch (err) {
//         console.error("Error fetching BPM:", err);
//       }
//     };

//     fetchBpm(); // initial fetch immediately
//     intervalId = setInterval(fetchBpm, 5000); // then every 5 seconds

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [pollingActive, bpmUrl]);

//   return (
//     <div>
//       <div id="startButton">
//         <input
//           value={device}
//           onChange={(e) => setDevice(e.target.value)}
//           placeholder="enter URI desc (not used now)"
//         />
//         <button className="beautiful-button" onClick={startPolling}>
//           Start
//         </button>
//       </div>

//       {randBMP !== null && (
//         <div className="result-container">
//           <p className="result-label">Current Value (BPM):</p>
//           <p className="result-value">{randBMP}</p>
//         </div>
//       )}

//       {genre && audioSource && (
//         <div className="result-container">
//           <SongDescButton audioSource={audioSource} genre={genre} playerOn={true} />
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState } from "react";
// import axios from "axios";
// import SongDescButton from "./SongDescButton";
// import { useSongDesc } from '../hooks/useSongDesc';

// const API_BASE = "http://localhost:3001";

// export default function ThingDescButton() {
//   // const { audioSource, genre } = useSongDesc(randBMP);
//   const [device, setDevice] = useState("");
//   const [randBMP, setRandBMP] = useState(null);
//   // const [audioSource, setAudioSource] = useState(null);
//   const [playerOn, setPlayerOn] = useState(false);
//   // const [genre, setGenre] = useState(null);
//   const { audioSource, genre } = useSongDesc(randBMP);

//   const getTD = async () => {
//     try {
//       // 1. Fetch the Thing Description
//       const tdResponse = await axios.get(`${API_BASE}/thingDescription`);
//       const td = tdResponse.data;
      
//       // 2. Extract event endpoint
//       const bpmUrl = td.events.currentHeartRate.forms[0].href;

//       // 3. Call the event endpoint (simulate subscription with polling)
//       const response = await axios.get(bpmUrl);
//       const { randBMP } = response.data;
  

//       setRandBMP(randBMP);
      
//       // await useSongDesc();
//       // console.log("td: ", response.data)
//       setPlayerOn(true);
//     } catch (err) {
//       console.error("Error fetching TD or BPM:", err);
//     }
//   };

//   return (
//     <div>
//       <div id="startButton">
//         <input
//           value={device}
//           onChange={(e) => setDevice(e.target.value)}
//           placeholder="enter URI desc (not used now)"
//         />
//         <button className="beautiful-button" onClick={getTD}>
//           Start
//         </button>
//       </div>

//       {randBMP !== null && (
//         <div className="result-container">
//           <p className="result-label">Current Value:</p>
//           <p className="result-value">{randBMP}</p>
//         </div>
//       )}

//       {playerOn && (
//         <div className="result-container">
//           <SongDescButton
//             audioSource={audioSource}
//             genre={genre}
//             playerOn={playerOn}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function ThingDescButton({ onHeartRate }) {
//   const [randBMP, setRandBMP] = useState(null);
//   const API_BASE = "http://localhost:3001";

//   useEffect(() => {
//     let polling = true;

//     const fetchHeartRate = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE}/currentBPM`);
//         setRandBMP(data.randBMP);
//         if (onHeartRate) onHeartRate(data.randBMP);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     const startPolling = async () => {
//       while (polling) {
//         await fetchHeartRate();
//         await new Promise((r) => setTimeout(r, 5000)); // wait 5 seconds between calls
//       }
//     };

//     startPolling();

//     return () => {
//       polling = false; // stop polling on unmount
//     };
//   }, [onHeartRate]);

//   return (
//     <div>
//       {randBMP !== null && (
//         <div className="result-container">
//           <p className="result-label">Current Value:</p>
//           <p className="result-value">{randBMP}</p>
//         </div>
//       )}
//     </div>
//   );
// }

