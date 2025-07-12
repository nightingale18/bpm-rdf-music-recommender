from fastapi import APIRouter
from bpm.generator import get_next_bpm
from bpm.graph_query import get_song_info

router = APIRouter()

@router.get("/heartbeat")
async def heartbeat():
    bpm = get_next_bpm()
    song_info = get_song_info(bpm)
    print(bpm)
    return {
        "randBMP": bpm,
        "genre": song_info.get("genre"),
        "songURI": song_info.get("songURI")
    }