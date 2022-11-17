
from fastapi import Request, APIRouter
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os.path
import markdown
from app.routes.auth import *

import shutil
from pydantic.main import BaseModel

router = APIRouter()
templates = Jinja2Templates(directory="../templates")

def openfile(filename):
    filepath = os.path.join("pages/", filename)
    with open(filepath, "r", encoding="utf-8") as input_file:
        text = input_file.read()

    html = markdown.markdown(text)
    data = {
        "text": html
    }
    return data

@router.get("/login", response_class=HTMLResponse)
async def home(request: Request):
    data = openfile("home.md")
    return templates.TemplateResponse("login.html", {"request": request, "data": data})
