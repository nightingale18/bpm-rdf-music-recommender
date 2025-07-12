import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from rdflib import Graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

randBMP = 60
pulse_active = True

def get_next_heart_rate(randBMP: int) -> int:
    randBMP += random.randint(-5, 10)
    randBMP = max(50, min(randBMP, 200))

    return randBMP

@app.get("/")
async def root():
    return "Hello from response"

@app.get("/thingDescription")
async def thing_description():
    td = {
        "@context": "https://www.w3.org/2022/wot/td/v1.1",
        "id": "urn:uuid:300f4c4b-ca6b-484a-88cf-fd5224a9a61d",
        "title": "Heart Rate Monitor",
        "@type": "saref:LightSwitch",
        "securityDefinitions": {"nosec_sc": {"scheme": "nosec"}},
        "security": "nosec_sc",
        "properties": {},
        "actions": {},
        "events": {
            "currentHeartRate": {
                "data": {"type": "object"},
                "forms": [{"href": "http://localhost:3001/heartbeat"}]
            }
        }
    }
    return JSONResponse(td)

@app.post("/start")
def start_pulse():
    global pulse_active
    pulse_active = True
    return {"status": "started"}

@app.post("/stop")
def stop_pulse():
    global pulse_active
    pulse_active = False
    return {"status": "stopped"}

@app.get("/heartbeat")
def heartbeat():
    global pulse_active, randBMP
    if not pulse_active:
        return {"randBMP": None}
    randBMP = get_next_heart_rate(randBMP)
    return {"randBMP": randBMP}

@app.get("/recommend")
def recommend(bpm: int):
    g = Graph()
    g.parse("../data/music.ttl", format="turtle")
    g.parse("../data/music_data.ttl", format="turtle")
    bucket = round(bpm / 10) * 10
    q = f'''
    PREFIX music: <http://localhost:3000/#>
    PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>
    SELECT ?song ?genre ?uri WHERE {{
      ?song music:suggestedRate "{bucket}"^^xsd:integer .
      ?song rdf:type      ?musicGenre .
      ?musicGenre rdfs:subClassOf music:MusicGenre .
      ?musicGenre rdfs:label      ?genre .
      ?song rdf:seeAlso           ?uri .
    }} LIMIT 1
    '''
    results = list(g.query(q))
    if results:
        song, genre, uri = results[0]
        return {"genre": str(genre), "audioUrl": str(uri)}
    else:
        return {"genre": None, "audioUrl": None}
