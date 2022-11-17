from datetime import datetime
from fastapi import APIRouter
from starlette.responses import Response
import os
from fastapi.responses import FileResponse
from fastapi import UploadFile, File
import sys
import shutil
from uuid import UUID
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import torch
from torchvision import transforms as T
from torch.utils.data import DataLoader
from torchvision.transforms.functional import to_pil_image
from torch import nn
from threading import Thread
from tqdm import tqdm
from PIL import Image
import numpy as np
import datetime

BASE_DIR = "C:/Users/82104/PycharmProjects/musicin_backend_setting/"
BASE_DIR2 = "C:/Users/82104/PycharmProjects/musicin_backend_setting/app/DB/"
VIDEO_DIR = os.path.join(BASE_DIR2,'processed_video/')
USER_DIR = 'yth/'
STATIC_DIR = os.path.join(BASE_DIR,'static/')
IMG_DIR = os.path.join(STATIC_DIR,'images/')
SERVER_IMG_DIR = os.path.join('http://localhost:8080/','static/','images/')


router = APIRouter()

@router.post('/upload-images')
async def upload_board(filetest: UploadFile):
    file_urls=[]
    print('sdsd',filetest.filename)
    currentTime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    saved_file_name = f'{currentTime}_testtmp.jpeg'
    # filetest = filetest.read()
    # file_location = os.path.join("C:/Users/82104/PycharmProjects/musicin_backend_setting/app/DB/processed_video/yth", saved_file_name)
    file_location = os.path.join(VIDEO_DIR, USER_DIR, saved_file_name)
    with open(file_location, "wb+") as file_object:
        # shutil.copyfileobj(filetest.file, file_object) # 둘다 가능
        file_object.write(filetest.file.read()) # 둘다 가능
    file_urls = SERVER_IMG_DIR+saved_file_name
    # return