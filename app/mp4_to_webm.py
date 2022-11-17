from datetime import datetime

import os
import sys
import shutil
import torch
from torchvision import transforms as T
from torch.utils.data import DataLoader
from torchvision.transforms.functional import to_pil_image
from torch import nn
from threading import Thread
from tqdm import tqdm
from PIL import Image
import numpy as np


# backgroundmattingv2 모듈
from BackgroundMattingV2.inference_utils import HomographicAlignment
from BackgroundMattingV2.dataset import VideoDataset, ZipDataset
from BackgroundMattingV2.dataset import augmentation as A
from BackgroundMattingV2.model import MattingBase, MattingRefine
import cv2

# ffmpeg 모듈
import ffmpeg
import io
import time
import subprocess
# --------------- Main ---------------

current_time = datetime.utcnow()


def making_webm(video_src, name='result', output_dir='./', video_resize=None):
    vid = VideoDataset(video_src)
    h = video_resize[1] if video_resize else vid.height
    w = video_resize[0] if video_resize else vid.height
    framerate = vid.frame_rate
    framecount = vid.frame_count
    with torch.no_grad():
        ################ webm 파일 저장을위한 process 설정 ####################
        process = (
            ffmpeg
            .input('pipe:', format='mp4', pix_fmt='bgr', s='{}x{}'.format(w, h), r=framerate)
            .output(f'{output_dir}/{name}.webm', pix_fmt='bgra', vcodec='libvpx-vp9', r=framerate)
            .overwrite_output()
            .run_async(pipe_stdin=True)
        )
        cap = cv2.VideoCapture(video_src)
        num = 0
        while True:
            num+=1
            ret, frame = cap.read()
            print(num)
            if not ret:
                break
           # 배경색 설정 파트

            ################# png 리스트 만들기
            # rgba_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)
            frame = cv2.resize(frame, (720, 1280))
            rgba_frame = frame
            ############ webm 파일 저장구간 ##################
            process.stdin.write(
                rgba_frame
                .astype(np.uint8)
                .tobytes()
            )
            # if num == framecount-10:
            #     break
        process.stdin.close()
        process.wait()
        ############ webm 파일 저장구간 ##################

    return framerate

video_src = r"C:\Users\82104\PycharmProjects\musicin_backend_setting\app\DB\background\main1bg.mp4"
output_dir = r"C:\Users\82104\PycharmProjects\musicin_backend_setting\app\DB\background"
name = 'webm변환'
save_name = f'{output_dir}/{current_time}_{name}.webm'
video_resize = (720, 1280)
##### webm 파일 변환 #############
framerate = making_webm(video_src,
                        video_resize = video_resize,
                        name=save_name,
                        output_dir=output_dir,
                        )