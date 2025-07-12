import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  CssBaseline,
} from "@mui/material";

export default function App() {
  const [bpm, setBpm] = useState(null);
  const [genre, setGenre] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [playerOn, setPlayerOn] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  async function fetchBpmAndSong() {
    try {
      const bpmRes = await axios.get("http://localhost:3001/heartbeat");
      const newBpm = bpmRes.data.randBMP;
      setBpm(newBpm);

      const recRes = await axios.get("http://localhost:3001/recommend", {
        params: { bpm: newBpm },
      });
      setGenre(recRes.data.genre);
      setAudioSrc(recRes.data.audioUrl);
      setPlayerOn(true);
    } catch (err) {
      console.error("Error fetching BPM or recommendation:", err);
    }
  }

  // Optionally notify backend to start/stop simulation
  const startBackend = async () => {
    try {
      await axios.post("http://localhost:3001/start");
    } catch (error) {
      console.error("Error starting backend:", error);
    }
  };
  const stopBackend = async () => {
    try {
      await axios.post("http://localhost:3001/stop");
    } catch (error) {
      console.error("Error starting backend:", error);
    }
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
    setPlayerOn(false);
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
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay prevented:", err);
      });
    }
  }, [audioSrc, playerOn]);

  return (
    <>
      <CssBaseline>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundImage: 'url("/background.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            padding: 0,
          }}
        >
          <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h3" align="center" gutterBottom>
                IoT Music Recommender
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mb: 3 }}
              >
                <Button
                  variant={playerOn ? "contained" : "outlined"}
                  color="primary"
                  size="large"
                  onClick={playerOn ? stopPolling : startPolling}
                  sx={{ minWidth: 140 }}
                >
                  {playerOn ? "Stop" : "Start"}
                </Button>
              </Stack>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
                mb={2}
              >
                <Typography variant="h6" color="text.secondary">
                  BPM: <b>{bpm ?? "..."}</b>
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Genre: <b>{genre || "..."}</b>
                </Typography>
              </Box>
              {playerOn && audioSrc && (
                <Box>
                  <audio
                    ref={audioRef}
                    key={audioSrc}
                    src={audioSrc}
                    controls
                    autoPlay
                    style={{ width: "100%", marginTop: 12 }}
                  />
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      </CssBaseline>
    </>
  );
}
