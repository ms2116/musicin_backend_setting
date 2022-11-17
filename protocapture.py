import cv2
from datetime import datetime
import time
timetmp = int(datetime.now().timestamp())
cap = cv2.VideoCapture(0)
outputpath = "videosample/"
name = input("이름을 입력해주세요: ")
Video_name = f"{outputpath}/{timetmp}_{name}.mp4"
bgr_name = f"{outputpath}/{timetmp}_{name}.jpg"

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
basic_hw = (1920, 1080)
frame_rate = cap.get(cv2.CAP_PROP_FPS)
out_video = cv2.VideoWriter(Video_name, fourcc, frame_rate, (w, h))

print('width', w)
print('height', h)
print('frame_rate', frame_rate)

bgr = None
while True:
    ret, frame = cap.read()
    if not ret:
        print("비디오 읽기 오류")
        break
    # 비디오 프레임이 정확하게 촬영되었으면 화면에 출력하여줌

    cv2.imshow('bgr',frame)
    # cv2.resizeWindow('bgr', int(w/2), int(h/2))

    key = cv2.waitKey(1)
    if key == ord('b'):
        bgr = frame
        cv2.imwrite(bgr_name, bgr)
        print('배경 화면이 저장되었습니다.: ', bgr_name)
        cv2.destroyWindow('bgr')
        break
    if key == 27:
        print('일단 종료')
        break
print("녹화하려면 s 키를 눌러주세요")

while True:
    ret_video, frame = cap.read()
    if not ret_video:
        break
    cv2.imshow('bgr',frame)
    key = cv2.waitKey(1)
    if key == ord('s'):
        print('녹화시작')
        time.sleep(3)
        break
timenow = time.time()
while True:
    ret_video, frame = cap.read()
    if not ret_video:
        break
    cv2.imshow('bgr',frame)
    out_video.write(frame)
    # cv2.putText(frame, "녹화중", (10, 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    strtime = time.time()
    if strtime-timenow > 15:
        break
    # ESC키값을 입력받으면 녹화종료 메세지와 함께 녹화종료
    k = cv2.waitKey(1)
    if k == 27:
        print('녹화 종료')
        break
# 비디와 관련 장치들을 다 닫아줌.
cap.release()
out_video.release()
cv2.destroyAllWindows()
