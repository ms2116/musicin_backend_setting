# from fastapi import FastAPI
from fastapi import APIRouter
from starlette.responses import StreamingResponse
from pathlib import Path
from fastapi import Request, Response
from fastapi import Header
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

router = APIRouter()
templates = Jinja2Templates(directory="../templates")

@router.get("/camera_save", response_class=HTMLResponse)
async def camera_save(request: Request):
    data = ''
    return templates.TemplateResponse("camera_page.html",
                                      {"request": request,
                                       "data":data})









