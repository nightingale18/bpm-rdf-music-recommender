from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/thingDescription")
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
