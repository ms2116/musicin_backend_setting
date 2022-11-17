from datetime import datetime
from fastapi import APIRouter
from starlette.responses import Response
import os
from fastapi import UploadFile
import sys
import shutil
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
import json


# backgroundmattingv2 모듈
from app.BackgroundMattingV2.inference_utils import HomographicAlignment
from app.BackgroundMattingV2.dataset import VideoDataset, ZipDataset
from app.BackgroundMattingV2.dataset import augmentation as A
from app.BackgroundMattingV2.model import MattingBase, MattingRefine
import cv2

# ffmpeg 모듈
import ffmpeg
import io
import time
import subprocess
from typing import List

# requests 를 위한
import httpx
import asyncio


router = APIRouter()



@router.get("/")
def index():
    """
    ELB 상태 체크용 API
    :return:
    """
    current_time = datetime.utcnow()
    return Response(f"Notification API (UTC: {current_time.strftime('%Y.%m.%d %H:%M:%S')})")


def createDirectory(directory):
    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print("Error: Failed to create the directory.")


STATIC_DIR ='static/'
BASE_DIR = "static/upload/DB/"

user_name = 'yth' # 이부분 데이터베이스로 변경

USER_DIR = f'{user_name}/'
os.makedirs(USER_DIR, exist_ok=True)
TEMP_DIR = 'temp/'
os.makedirs(USER_DIR+TEMP_DIR, exist_ok=True)

UPLOAD_DIR = os.path.join(BASE_DIR, USER_DIR)
IMG_DIR = os.path.join(STATIC_DIR,'images/')


save_dir = os.path.join(UPLOAD_DIR, TEMP_DIR)
createDirectory(save_dir)

## gpu  서버 연결 파트
gpu_URL = "http://localhost:8070/test"

@router.post('/remove_background2/bg')
async def remove_background_bg(files: List[UploadFile]):

    currentTime = datetime.now().strftime("%Y%m%d%H%M%S")

    # 받은 파일 일단 저장하기
    for file in files:
        save_filename = f'{currentTime}_{file.filename}'
        save_location_name = os.path.join(save_dir, save_filename)
        with open(save_location_name, "wb+") as file_object:
            # shutil.copyfileobj(file.file, file_object) # 둘다 가능
            file_object.write(file.file.read()) # 둘다 가능
#
        print("save at : ", save_location_name)
        if file.filename.endswith(".json"):
            video_json = save_location_name
        elif file.filename.endswith(".webm") or file.filename.endswith(".mp4"):
            org_video = save_location_name
            framevideofilename = f'{currentTime}_{file.filename}'
        else:
            '다시업로드좀'

    tmpDict = {"video_json": video_json, "org_video": org_video, "framevideofilename": framevideofilename}
    bgJson = json.dumps(tmpDict)
    print("bgJson is ", bgJson)
    print("bgJson type is ", type(bgJson))
    async with httpx.AsyncClient() as client:
        # response = await client.post(gpu_URL)
        response = await client.post(gpu_URL, json={"bgjson": bgJson})
    print(response)
    await client.aclose()

    return "editor"
