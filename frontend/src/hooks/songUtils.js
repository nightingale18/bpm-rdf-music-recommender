import * as $rdf from 'rdflib';

export async function useSongDesc(randBMP) {
  try {
    const bmp = Number(randBMP.toString().slice(0, -1) + "0");
    const info = await getKGData(bmp);
    return info; // { songURI, genre }
  } catch (err) {
    console.error("Error in getSongDesc:", err);
    return {};
  }
}

async function getKGData(bmp) {
  const store = $rdf.graph();
  const fetcher = new $rdf.Fetcher(store);

  const musicOntology = "http://localhost:3000/music.ttl";
  const musicDataTTL = "http://localhost:3000/music_data.ttl";

  try {
    await fetcher.load(musicOntology);
    await fetcher.load(musicDataTTL);

    const queryStr = `
      PREFIX music: <http://localhost:3000/#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      SELECT ?song ?genre ?songURI WHERE {
        ?song music:suggestedRate ?bmp .
        ?song rdf:type ?musicGenre.
        ?musicGenre rdfs:label ?genre.
        ?song rdf:seeAlso ?songURI.
        FILTER(?bmp = ${bmp})
      }
    `;

    const query = $rdf.SPARQLToQuery(queryStr, false, store);

    let songURI = null;
    let genre = null;

    store.query(query, (result) => {
      if (!songURI && result["?songURI"] && result["?genre"]) {
        songURI = result["?songURI"].value;
        genre = result["?genre"].value;
      }
    });

    return songURI && genre ? { songURI, genre } : {};
  } catch (error) {
    console.error("Error querying RDF:", error);
    return {};
  }
}
