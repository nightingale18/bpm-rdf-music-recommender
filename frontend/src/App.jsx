import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function App() {
  const [bpm, setBpm] = useState(null);
  const [genre, setGenre] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [playerOn, setPlayerOn] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  async function fetchBpmAndSong() {
    try {
      const bpmRes = await axios.get('http://localhost:3001/heartbeat');
      const newBpm = bpmRes.data.randBMP;
      setBpm(newBpm);

      const recRes = await axios.get('http://localhost:3001/recommend', {
        params: { bpm: newBpm }
      });
      setGenre(recRes.data.genre);
      setAudioSrc(recRes.data.audioUrl);
      setPlayerOn(true);
    } catch (err) {
      console.error('Error fetching BPM or recommendation:', err);
    }
  }

  // Tell backend to start pulse simulation (optional if your backend needs this)
  const startBackend = async () => {
    try { await axios.post('http://localhost:3001/start'); } catch {}
  };
  // Tell backend to stop pulse simulation
  const stopBackend = async () => {
    try { await axios.post('http://localhost:3001/stop'); } catch {}
  };

  const startPolling = async () => {
    await startBackend();
    fetchBpmAndSong();
    intervalRef.current = setInterval(fetchBpmAndSong, 5000);
    setPlayerOn(true);
  };

  const stopPolling = async () => {
    clearInterval(intervalRef.current);
    await stopBackend();
    setPlayerOn(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (playerOn && audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.warn("Autoplay prevented:", err);
      });
    }
  }, [audioSrc, playerOn]);

  return (
    <div style={{ padding: 20 }}>
      <h1>IoT Music Recommender</h1>
      <button onClick={playerOn ? stopPolling : startPolling}>
        {playerOn ? 'Stop' : 'Start'}
      </button>
      <div>
        <p><strong>BPM:</strong> {bpm ?? '...'}</p>
        <p><strong>Genre:</strong> {genre || '...'}</p>
        {playerOn && audioSrc && (
          <audio
            ref={audioRef}
            key={audioSrc}
            src={audioSrc}
            controls
            autoPlay
            style={{ width: '100%', marginTop: 12 }}
          />
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// export default function App() {
//   const [bpm, setBpm] = useState(null);
//   const [genre, setGenre] = useState('');
//   const [audioSrc, setAudioSrc] = useState('');
//   const [playerOn, setPlayerOn] = useState(false);
//   const intervalRef = useRef(null);
//   const audioRef = useRef(null);

//   async function fetchBpmAndSong() {
//     try {
//       const bpmRes = await axios.get('http://localhost:3001/heartbeat');
//       const newBpm = bpmRes.data.randBMP;
//       setBpm(newBpm);

//       const recRes = await axios.get('http://localhost:3001/recommend', {
//         params: { bpm: newBpm }
//       });
//       setGenre(recRes.data.genre);
//       setAudioSrc(recRes.data.audioUrl);
//       setPlayerOn(true);
//     } catch (err) {
//       console.error('Error fetching BPM or recommendation:', err);
//     }
//   }

//   // Start polling
//   const startPolling = () => {
//     fetchBpmAndSong();
//     intervalRef.current = setInterval(fetchBpmAndSong, 5000);
//     setPlayerOn(true);
//   };

//   // Stop polling and music
//   const stopPolling = () => {
//     clearInterval(intervalRef.current);
//     setPlayerOn(false);
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }
//   };

//   // Cleanup interval on unmount
//   useEffect(() => {
//     return () => clearInterval(intervalRef.current);
//   }, []);

//   // Play automatically when new song loads (after started)
//   useEffect(() => {
//     if (playerOn && audioSrc && audioRef.current) {
//       audioRef.current.src = audioSrc;
//       audioRef.current.load();
//       audioRef.current.play().catch(err => {
//         console.warn("Autoplay prevented:", err);
//       });
//     }
//   }, [audioSrc, playerOn]);

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>IoT Music Recommender</h1>
//       <button onClick={playerOn ? stopPolling : startPolling}>
//         {playerOn ? 'Stop' : 'Start'}
//       </button>
//       <div>
//         <p><strong>BPM:</strong> {bpm ?? '...'}</p>
//         <p><strong>Genre:</strong> {genre || '...'}</p>
//         {playerOn && audioSrc && (
//           <audio
//             ref={audioRef}
//             key={audioSrc}
//             src={audioSrc}
//             controls
//             autoPlay
//             style={{ width: '100%', marginTop: 12 }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// // App.jsx or your component
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function App() {
//   const [bpm, setBpm] = useState(null);
//   const [genre, setGenre] = useState('');
//   const [audioSrc, setAudioSrc] = useState('');
//   const [playerOn, setPlayerOn] = useState(false);

//   async function fetchBpmAndSong() {
//     try {
//       // 1. Get new random BPM
//       const bpmRes = await axios.get('http://localhost:3001/heartbeat');
//       const newBpm = bpmRes.data.randBMP;
//       setBpm(newBpm);

//       // 2. Get song/genre recommendation for this BPM
//       const recRes = await axios.get('http://localhost:3001/recommend', {
//         params: { bpm: newBpm }
//       });
//       setGenre(recRes.data.genre);
//       setAudioSrc(recRes.data.audioUrl);
//       setPlayerOn(true);
//     } catch (err) {
//       console.error('Error fetching BPM or recommendation:', err);
//     }
//   }

//   useEffect(() => {
//     fetchBpmAndSong();
//     const intervalId = setInterval(fetchBpmAndSong, 5000);
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>IoT Music Recommender</h1>
//       <div>
//         <p><strong>BPM:</strong> {bpm ?? '...'}</p>
//         <p><strong>Genre:</strong> {genre || '...'}</p>
//         {playerOn && audioSrc && (
//           <audio
//             key={audioSrc}
//             src={audioSrc}
//             controls
//             autoPlay
//             style={{ width: '100%', marginTop: 12 }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
// import { useState } from 'react'
// import axios from 'axios'
// import './App.css'

// // 1) Import your new IoT components
// import ThingDescButton from './components/ThingDescButton'
// import SongDescButton   from './components/SongDescButton'
// // import KnowledgeGraph   from './components/KnowledgeGraph'

// function App() {
//   // 2) State hooks for bpm, genre, audio URL, and player toggle
//   const [bpm,   setBpm]   = useState(null)
//   const [genre, setGenre] = useState('')
//   const [audioSrc, setAudioSrc] = useState('')
//   const [playerOn, setPlayerOn] = useState(false)

//   // 3) Handler passed to ThingDescButton
//   async function handleHeartRate(randBMP) {
//     setBpm(randBMP)
//     setPlayerOn(false)

//     try {
//       // call your FastAPI /recommend?bpm= endpoint
//       const { data } = await axios.get(`http://localhost:3001/heartbeat`, {
//         params: { bpm: randBMP }
//       })
//       setGenre(data.genre)
//       setAudioSrc(data.audioUrl)
//       setPlayerOn(true)
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   // 4) Render your three components instead of the counter demo
//   return (
//     <div className="App" style={{ padding: 20 }}>
//       <h1>IoT Music Recommender</h1>

//       {/* <ThingDescButton onHeartRate={handleHeartRate} /> */}
//       <ThingDescButton  />

//       {/* <SongDescButton
//         genre={genre}
//         audioSource={audioSrc}
//         playerOn={playerOn}
//       /> */}
//       { audioSrc && genre && (
//       <SongDescButton
//         key={audioSrc}           // ← force React to remake it on each new URL
//         audioSource={audioSrc}
//         genre={genre}
//         playerOn={true}
//       />
//     )}

//       {/* <KnowledgeGraph randBMP={bpm} /> */}
//     </div>
//   )
// }

// export default App

// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import './App.css'

// import ThingDescButton from './components/ThingDescButton'
// import SongDescButton from './components/SongDescButton'

// function App() {
//   const [bpm, setBpm] = useState(null)
//   const [genre, setGenre] = useState('')
//   const [audioSrc, setAudioSrc] = useState('')
//   const [playerOn, setPlayerOn] = useState(false)
//   const [bpmEndpoint, setBpmEndpoint] = useState(null)

//   // 1. Fetch Thing Description once and extract BPM endpoint
//   const fetchThingDescription = async () => {
//     try {
//       const res = await axios.get('http://localhost:3001/thingDescription')
//       const td = res.data
//       const endpoint = td?.events?.currentHeartRate?.forms?.[0]?.href
//       if (endpoint) {
//         setBpmEndpoint(endpoint)
//       }
//     } catch (err) {
//       console.error('Failed to load Thing Description:', err)
//     }
//   }

//   // 2. Fetch BPM + Song Recommendation every 5s
//   useEffect(() => {
//     if (!bpmEndpoint) return

//     const fetchAndPlay = async () => {
//       try {
//         // Step 1: Get random BPM from TD-defined endpoint
//         const bpmRes = await axios.get(bpmEndpoint)
//         const randBMP = bpmRes.data.randBMP
//         setBpm(randBMP)
//         setPlayerOn(false)

//         // Step 2: Get song data (genre + URI) from backend RDF graph logic
//         const recRes = await axios.get('http://localhost:3001/recommend', {
//           params: { bpm: randBMP }
//         })

//         setGenre(recRes.data.genre)
//         setAudioSrc(recRes.data.audioUrl)
//         setPlayerOn(true)
//       } catch (err) {
//         console.error('Error fetching BPM or song recommendation:', err)
//       }
//     }

//     fetchAndPlay() // first run immediately
//     const intervalId = setInterval(fetchAndPlay, 5000)

//     return () => clearInterval(intervalId)
//   }, [bpmEndpoint])

//   return (
//     <div className="App" style={{ padding: 20 }}>
//       <h1>IoT Music Recommender</h1>

//       {/* Button to trigger loading TD */}
//       <ThingDescButton onClick={fetchThingDescription} />

//       {/* Show BPM */}
//       {bpm && (
//         <div className="result-container">
//           <p className="result-label">Current BPM:</p>
//           <p className="result-value">{bpm}</p>
//         </div>
//       )}

//       {/* Song Player */}
//       <SongDescButton genre={genre} audioSource={audioSrc} playerOn={playerOn} />
//     </div>
//   )
// }

// export default App
