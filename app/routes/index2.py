
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request
import markdown
import os.path
import random
import glob

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def openfile(filename):
    filepath = os.path.join("pages/", filename)
    with open(filepath, "r", encoding="utf-8") as input_file:
        text = input_file.read()
    html = markdown.markdown(text)
    data = {
        "text": html
    }
    return data

@router.get("/index", response_class=HTMLResponse)
async def home(request: Request):
    # data = openfile("home.md")
    data = '왜'

    # file_webm_path = '../static/videos/'
    # users = 'yth/'
    # file_webm_list = glob.glob(os.path.join(file_webm_path, users, '*'))
    # file_webm_list.sort()
    #
    # numtmp = len(file_webm_list) - 1
    # num = random.randint(0, numtmp)
    # video_data = file_webm_list[num]
    # data = os.listdir(os.getcwd())
    # print(video_data)
    # print(data)
    # data = "static/videos/yth/result_20221109185421.webm"
    data = "hi"
    # video_data = StreamingResponse(video_stream('static/mp4/video.mp4'), media_type="video/mp4")

    return templates.TemplateResponse("page.html",
                                      {"request": request,
                                       "data": data,
                                       # "video_data": data,
                                       # 'test': test}
                                       })
@router.get("/editor", response_class=HTMLResponse)
async def editor(request: Request):
    bg_DB_path = 'static/background/*'
    bg_DB_list = glob.glob(bg_DB_path)

    file_webm_path = 'static/videos/'
    users = 'yth/'
    file_webm_list = glob.glob(os.path.join(file_webm_path, users, '*'))
    file_webm_list.sort()

    return templates.TemplateResponse("page_editor.html",
                                      {"request": request,
                                       "bg_DB_list": bg_DB_list, "process_DB_list": file_webm_list
                                       # 'test': test}
                                       })
@router.get("/editortmp", response_class=HTMLResponse)
async def editortmp(request: Request):
    return templates.TemplateResponse("editor_tmp.html",
                                      {"request": request,
                                       })



@router.get("/index/register", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("register.html",
                                      {"request": request,
                                       # "video_data": video_data,
                                       # 'test': test}
                                       })
# @router.get("/index_custom_bg", response_class=HTMLResponse)
# async def index_custom_bg(request: Request):
#     return templates.TemplateResponse("index_custom_bg.html",
#                                       {"request": request})


