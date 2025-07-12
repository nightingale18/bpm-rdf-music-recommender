// // import { useState, useEffect } from "react";

// // export function useSongDesc(randBMP) {
// //   const [audioSource, setAudioSource] = useState(null);
// //   const [genre, setGenre] = useState(null);

// //   useEffect(() => {
// //     // Only proceed if randBMP is a number (allow 0)
// //     if (randBMP === null || randBMP === undefined) return;

// //     async function fetchSongDesc() {
// //       try {
// //         // Normalize bpm to nearest 10 (e.g., 187 -> 180)
// //         const bmp = Number(randBMP.toString().slice(0, -1) + "0");
// //         console.log("Fetching song for BPM:", bmp);

// //         const info = await getKGData(bmp);

// //         if (info?.songURI && info?.genre) {
// //           setAudioSource(info.songURI);
// //           setGenre(info.genre);
// //           console.log("Found songURI:", info.songURI, "genre:", info.genre);
// //         } else {
// //           // Reset state if no song found
// //           setAudioSource(null);
// //           setGenre(null);
// //           console.warn("No matching song found for BPM:", bmp);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching song description:", err);
// //         setAudioSource(null);
// //         setGenre(null);
// //       }
// //     }

// //     fetchSongDesc();
// //   }, [randBMP]);
// import { useState, useEffect } from "react";
// import * as $rdf from "rdflib";

// export function useSongDesc(randBMP) {
//   const [audioSource, setAudioSource] = useState(null);
//   const [genre, setGenre] = useState(null);

//   useEffect(() => {
//     // Only proceed if randBMP is a number (allow 0)
//     if (randBMP === null || randBMP === undefined) return;

//     async function fetchSongDesc() {
//       try {
//         // Normalize bpm to nearest 10 (e.g., 187 -> 180)
//         const bmp = Number(randBMP.toString().slice(0, -1) + "0");
//         console.log("Fetching song for BPM:", bmp);

//         const info = await getKGData(bmp);

//         if (info?.songURI && info?.genre) {
//           setAudioSource(info.songURI);
//           setGenre(info.genre);
//           console.log("Found songURI:", info.songURI, "genre:", info.genre);
//         } else {
//           // Reset state if no song found
//           setAudioSource(null);
//           setGenre(null);
//           console.warn("No matching song found for BPM:", bmp);
//         }
//       } catch (err) {
//         console.error("Error fetching song description:", err);
//         setAudioSource(null);
//         setGenre(null);
//       }
//     }

//     fetchSongDesc();
//   }, [randBMP]);

//   async function getKGData(bmp) {
//     const store = $rdf.graph();
//     const fetcher = new $rdf.Fetcher(store, { fetch: window.fetch.bind(window) });

//     const musicOntology = "http://localhost:3000/music.ttl";
//     const musicDataTTL = "http://localhost:3000/music_data.ttl";

//     try {
//       await fetcher.load(musicOntology);
//       await fetcher.load(musicDataTTL);

//       // const queryStr = `
//       //   PREFIX dbo: <http://dbpedia.org/ontology/>
//       //   PREFIX music: <http://localhost:3000/#>
//       //   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//       //   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//       //   SELECT ?song ?genre ?songURI WHERE {
//       //     ?song music:suggestedRate ?bmp .
//       //     ?song rdf:type ?musicGenre.
//       //     ?musicGenre rdfs:label ?genre.
//       //     ?song rdf:seeAlso ?songURI.
//       //     FILTER(?bmp = ${bmp})
//       //   }
//       // `;
//       //   //   ?song music:suggestedRate ?rate .
//       //   //   ?song rdf:type ?musicGenre.
//       //   //   ?musicGenre rdfs:label ?genre.
//       //   //   ?song rdf:seeAlso ?songURI.
//       //   //   FILTER(?rate = ${bmp})
//       //   // } LIMIT 1

//       const queryStr = `
//         PREFIX dbo: <http://dbpedia.org/ontology/>
//         PREFIX music: <http://localhost:3000/#>
//         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//         SELECT ?song ?genre ?songURI WHERE {
//           ?song music:suggestedRate ?rate .
//           ?song rdf:type ?musicGenre .
//           ?musicGenre rdfs:label ?genre .
//           ?song rdf:seeAlso ?songURI .
//           FILTER(?rate = ${bmp})
//         }
//         LIMIT 1
//       `;

// //       let query = $rdf.SPARQLToQuery(queryStr, false, store);
// //       return new Promise((resolve) => {
// //         let songURI = null;
// //         let genre = null;

// //         store.query(
// //           query,
// //           (result) => {
// //             if (!songURI && result["?songURI"] && result["?genre"]) {
// //               songURI = result["?songURI"].value;
// //               genre = result["?genre"].value;
// //               console.log("SPARQL result:", songURI, genre,bmp);
// //             }
// //           },
// //           undefined,
// //           () => {
// //             if (songURI && genre) {
// //               resolve({ songURI, genre });
// //             } else {
// //               resolve({});
// //             }
// //           }
// //         );
// //       });
// //     } catch (error) {
// //       console.error("Error in getKGData:", error);
// //       return {};
// //     }
// //   }


//     const query = $rdf.SPARQLToQuery(queryStr, false, store);

//     store.query(
//       query,
//       (result) => {
//         const songURI = result["?songURI"]?.value;
//         const genre = result["?genre"]?.value;

//         if (songURI && genre) {
//           setAudioSource(songURI);
//           setGenre(genre);
//           console.log("[SPARQL Result]", songURI, genre, bmp);
//         } else {
//           setAudioSource(null);
//           setGenre(null);
//           console.warn("No song found for BPM:", bmp);
//         }
//       },
//       undefined,
//       () => console.log("SPARQL Query complete.")
//     );
//     } catch (err) {
//       console.error("Error in fetchSongDesc:", err);
//       setAudioSource(null);
//       setGenre(null);
//     }
//   }
//   return { audioSource, genre };
// }
// useSongDesc.js
import { useState, useEffect } from "react";
import * as $rdf from "rdflib";

export function useSongDesc(randBMP) {
  const [audioSource, setAudioSource] = useState(null);
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    if (randBMP == null) return;

    // Normalize to nearest 10
    const bucket = Number(randBMP.toString().slice(0, -1) + "0");

    console.log("[useSongDesc] raw BPM =", randBMP, "bucket =", bucket);

    // Async IIFE to fetch graph data
    (async () => {
      try {
        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, { fetch: window.fetch.bind(window) });

        // Load your ontology + data
        await fetcher.load("http://localhost:3000/music.ttl");
        await fetcher.load("http://localhost:3000/music_data.ttl");

        // SPARQL, note ?rate vs JS `bucket`
        // const queryStr = `
        //   PREFIX music: <http://localhost:3000/#>
        //   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        //   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        //   SELECT ?song ?genre ?songURI WHERE {
        //     ?song music:suggestedRate ?rate .
        //     ?song rdf:type ?musicGenre .
        //     ?musicGenre rdfs:label ?genre .
        //     ?song rdf:seeAlso ?songURI .
        //     FILTER(?rate = ${bucket})
        //   } LIMIT 1
        // `;
        const queryStr = `
          PREFIX music: <http://localhost:3000/#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>

          SELECT ?song ?genre ?songURI WHERE {
            ?song music:suggestedRate ?rate .
            ?song rdf:type ?musicGenre .
            ?musicGenre rdfs:subClassOf music:MusicGenre .
            ?musicGenre rdfs:label ?genre .
            ?song rdf:seeAlso ?songURI .
            FILTER(?rate = "80"^^xsd:integer).
          }
        `;
        console.log("bucket = ", bucket);
        const sparqlQuery = $rdf.SPARQLToQuery(queryStr, true, store);

        // Wrap in promise so we only resolve once
        const result = await new Promise((resolve, reject) => {
          let found = false;
          store.query(
            sparqlQuery,
            (res) => {
              if (!found) {
                found = true;
                console.log("res = ", res);
                resolve({
                  songURI: res["?songURI"]?.value,
                  genre: res["?genre"]?.value,
                });
              }
            },
            undefined,
            () => {
              if (!found) resolve({}); // no result
            }
          );
        });
        console.log("results = ", result)
        if (result.songURI && result.genre) {
          console.log("[useSongDesc] Found", result.genre, result.songURI);
          setAudioSource(result.songURI);
          setGenre(result.genre);
        } else {
          console.warn("[useSongDesc] No song for bucket", bucket);
          setAudioSource(null);
          setGenre(null);
        }
      } catch (err) {
        console.error("[useSongDesc] Error:", err);
        setAudioSource(null);
        setGenre(null);
      }
    })();
  }, [randBMP]);

  return { audioSource, genre };
}
