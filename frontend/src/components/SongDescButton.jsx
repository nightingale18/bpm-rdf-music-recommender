import React, { useEffect, useRef } from 'react';

export default function SongDescButton({ genre, audioSource, playerOn }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (playerOn && audioSource && audioRef.current) {
      // stop any current playback
      audioRef.current.pause();
      // swap in the new source
      audioRef.current.src = audioSource;
      // reload and play
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.warn("Audio play was prevented:", err);
      });
    }
  }, [audioSource, playerOn]);

  if (!playerOn || !audioSource) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
        Song Recommendation:
      </div>
      <div style={{ fontStyle: 'italic', marginBottom: 8 }}>
        {genre}
      </div>
      <audio
        ref={audioRef}
        controls
        autoPlay
        style={{ width: '100%' }}
      />
    </div>
  );
}

// import React, { useEffect, useRef } from 'react';

// export default function SongDescButton({ genre, audioSource, playerOn }) {
//   const audioRef = useRef(null);

//   useEffect(() => {
//     if (playerOn && audioRef.current) {
//       audioRef.current.load();   // Reloads the audio with the new src
//       audioRef.current.play().catch(err => {
//         // Handle autoplay restrictions gracefully
//         console.warn("Audio play was prevented:", err);
//       });
//     }
//   }, [audioSource, playerOn]);

//   if (!playerOn) return null;

//   return (
//     <div style={{ marginBottom: 16 }}>
//       <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
//         Song Recommendation:
//       </div>
//       <div style={{ fontStyle: 'italic', marginBottom: 8 }}>
//         {genre}
//       </div>
//       <audio
//         ref={audioRef}
//         src={audioSource}
//         controls
//         style={{ width: '100%' }}
//       />
//     </div>
//   );
// }
// import React from 'react';

// export default function SongDescButton({ genre, audioSource, playerOn }) {
//   if (!playerOn) return null;

//   return (
//     <div style={{ marginBottom: 16 }}>
//       <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
//         Song Recommendation:
//       </div>
//       <div style={{ fontStyle: 'italic', marginBottom: 8 }}>
//         {genre}
//       </div>
//       <audio
//         src={audioSource}
//         controls
//         autoPlay
//         style={{ width: '100%' }}
//       />
//     </div>
//   );
// }
