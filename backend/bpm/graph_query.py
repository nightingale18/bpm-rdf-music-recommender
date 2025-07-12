import rdflib

def get_song_info(bpm: int) -> dict:
    g = rdflib.Graph()
    g.parse("http://localhost:3000/music.ttl", format="ttl")
    g.parse("http://localhost:3000/music_data.ttl", format="ttl")

    query = f"""
    PREFIX music: <http://localhost:3000/#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?songURI ?genre WHERE {{
      ?song music:suggestedRate {bpm} ;
            rdf:type ?type ;
            rdfs:label ?genre ;
            rdf:seeAlso ?songURI .
    }} LIMIT 1
    """

    result = g.query(query)
    for row in result:
        return {
            "songURI": str(row["songURI"]),
            "genre": str(row["genre"]),
        }

    return {}
