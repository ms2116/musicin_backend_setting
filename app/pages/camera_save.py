from fastapi import FastAPI
from fastapi import APIRouter
from starlette.responses import StreamingResponse
from pathlib import Path
from fastapi import Request, Response
from fastapi import Header
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

router = APIRouter()
templates = Jinja2Templates(directory="../templates")

@router.get("/take_camera", response_class=HTMLResponse)
async def take_camera(request: Request):
    test = '이거 왜 안되냐'
    return templates.TemplateResponse("camera_save.html",
                                      {"request": request,
                                       "test":test
                                       })