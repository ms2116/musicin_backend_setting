const modal = document.querySelector(".modal");
const closeBtn = modal.querySelector(".close-area")
const btnOpenPopup = document.querySelector('.btn-open-popup');

closeBtn.addEventListener("click", e => {
    modal.style.visibility = "hidden";
    if (modal.classList.contains('show')){
        modal.classList.remove('show');
        modal.style.visibility = "visible";
        modal_original();
    }
});
//
// btnOpenPopup.addEventListener('click', () => {
//     modal.classList.toggle('show');
//     // openWebcam();
// });
//
// modal.addEventListener('click', (event) => {
//     if (event.target === modal) {
//         modal.classList.toggle('show');
//     }
// });


<!--&lt;!&ndash;영상 녹화 부분 &ndash;&gt;-->
<!--&lt;!&ndash;영상 녹화 부분 &ndash;&gt;-->
<!--&lt;!&ndash;영상 녹화 부분 &ndash;&gt;-->

<!--&lt;!&ndash;<script>&ndash;&gt;-->

<!--&lt;!&ndash;영상 녹화 부분 &ndash;&gt;-->

<!--<script>-->
    //DOM
const recordButton =document.querySelector(".record-button");
const stopButton = document.querySelector(".stop-button");
const playButton = document.querySelector(".play-button");
const downloadButton = document.querySelector(".download-button");
const setDone = document.querySelector(".setdone-button");

const openwebcam = document.querySelector("#open_webcam");
const previewPlayer = document.querySelector("#preview");
const recordingPlayer = document.querySelector("#recording");
const recordtmp = document.querySelector(".recordtmp")
const modalDiv1 = document.querySelector("#modal_div1")
const recordingName = modalDiv1.querySelector(".recording_name")
const modal_bottom_menu = document.querySelector(".modal_bottom_menu");
const modal_camera_recording = document.querySelector(".modal_camera_recording");
const modal_div2 = document.querySelector("#modal_div2");
const modal_camera_edit = document.querySelector(".modal_camera_edit");

const setRecordTime = document.querySelector(".setRecordTime");
const set30Time = setRecordTime.querySelector(".s30");
const set20Time = setRecordTime.querySelector(".s20");
const set15Time = setRecordTime.querySelector(".s15");
const set10Time = setRecordTime.querySelector(".s10");
const setInfinityTime = setRecordTime.querySelector(".infinity");
// const recordButton2 =document.querySelector(".record-button");

// const set60Time = document.getElementById("sixty");
//카메라 녹화 시간 설정

let recordSetting = 10000;
let recorder;
let recordedChunks;
let recordedBlob = new Blob();

function recording_setting() {
    modalDiv1.style.display = "none";
    recordingName.style.display="none";
    // modal_camera_recording.style.bottom = '10%';
    // modal_camera_recording.style.width = '100%';
    modal_camera_recording.style.display = 'flex';
    modal_camera_recording.style.zIndex = '200';
}
function camera_edit_setting(){
    modal_div2.style.display = "none";
    modal_camera_recording.style.display = 'none';
    modal_camera_edit.style.display = 'flex';
    modal_camera_edit.style.width = '100%';
    modal_camera_edit.style.zIndex = '200';
    recordtmp.style.display = "none";
}
//functions
function openWebcam() {
    navigator.mediaDevices.getUserMedia({ audio:true, video:{width:720, height: 1280, frameRate: 100} })
    .then(stream => {
        openwebcam.srcObject = stream;
    })
}
function videoStart() {
    openwebcam.srcObject.getTracks().forEach(track => track.stop());
    openwebcam.style.display = 'none';
    constraints = {
        audio: true,
        video: {
            // frameRate : {min: 24, ideal:24, max:25},
            width:720, height: 1280
        }
    };
    console.log('이거 왜안됨?');

    // navigator.mediaDevices.getUserMedia({ audio:true, video:{width:720, height: 1280, frameRate: 100} })
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        previewPlayer.srcObject = stream;
        startRecording(previewPlayer.captureStream())
    })
}
function camera_edit(){
    modal_bottom_menu.style.display = "none";
}
function modal_original(){
    modal_bottom_menu.style.display = "flex";
    modal_camera_recording.display = "none";
    modal_camera_edit.style.display = "none";
    recordtmp.style.display = "flex";
}
function camera_recording(){
    modal_bottom_menu.style.display = "none";
    recordtmp.style.display = "none";
        console.log('hi');

}
function startRecording(stream) {
    // openwebcam.srcObject.getTracks().forEach(track => track.stop());
    // openwebcam.style.display = 'none';
    camera_recording();
    recording_setting();
    previewPlayer.style.display = 'block';
    recordingPlayer.style.display = 'none';
    recordedChunks=[];
    // recorder = new MediaRecorder(stream, {mimeType: "video/webm; codecs=vp9"})
    recorder = new MediaRecorder(stream, {mimeType: "video/webm; codecs=vp9"})
    recorder.ondataavailable = (e)=>{ recordedChunks.push(e.data) }
    recorder.start(100);


    let progressBar = document.querySelector(".circular-progress");
    let valueContainer = document.querySelector(".value-container");
    let progressValue = 0;
    let progressEndValue = recordSetting/100
    let speed = 100;
    let progress = setInterval(() =>{
        progressValue ++,
        // valueContainer.textContent =  `${progressValue}TT`;
        progressBar.style.background = `conic-gradient(
            red ${progressValue * 360/progressEndValue}deg,
            pink ${progressValue * 360/progressEndValue}deg)`
        if (progressValue > progressEndValue){
            progressValue =0;
            clearInterval(progress);
            stopRecording();
        }
    }, speed)
}

function stopRecording() {
    camera_edit_setting();
    previewPlayer.srcObject.getTracks().forEach(track => track.stop());
    previewPlayer.style.display = 'none';
    recorder.stop();
    progressValue = 360;
    setTimeout(() => playRecording(), 300);
}
function playRecording() {
    recordedBlob = new Blob(recordedChunks, {type:"video/webm"});
    // previewPlayer.style.display = 'none';
    recordingPlayer.style.display = 'block';
    recordingPlayer.src=URL.createObjectURL(recordedBlob);
    setTimeout(() => recordingPlayer.play(), 300);
    setTimeout(() => recordingPlayer.pause(), 400);
}

btnOpenPopup.addEventListener('click', () => {
    modal.classList.toggle('show');
    openWebcam();
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.toggle('show');
    }
});

//시간설정 부분
set30Time.onclick = e =>{
    recordSetting = 30000;
    console.log(recordSetting);
};
set20Time.onclick = e =>{
    recordSetting = 20000;
    console.log(recordSetting);
};
set15Time.onclick = e =>{
    recordSetting = 15000;
    console.log(recordSetting);
};
set10Time.onclick = e =>{
    recordSetting = 10000;
    console.log(recordSetting);
};
setInfinityTime.onclick = e =>{
    recordSetting = 0;
    console.log(recordSetting);
};

// record_time_setting();
recordButton.addEventListener("click",videoStart);
stopButton.addEventListener("click",stopRecording);
// playButton.addEventListener("click",playRecording);

/////////////////////////////////
// 시작, 끝 지점 확인 코드

// 설정 변수

const setting = {
    startTime: 0,
    endTime: 0,
    bgTime:0,
    vidDuration:0
};

// DOM 로드
// const btnSetRepeat = document.getElementById("btn-set-repeat");
const btnSetStart = document.getElementById("btn-set-start");
const btnSetEnd = document.getElementById("btn-set-end");
const debug = document.getElementById("debug");
const btnSetbg = document.getElementById("btn-set-bg");
const tmpbg = document.getElementById('tmp-bg');
let imageBlob = new Blob();
const videoLoading = document.querySelector("#loading-div");

// 배경 캡쳐를 위한 함수 생성

function takeASnap(vid){
  const canvas = document.createElement('canvas'); // create a canvas
  const ctx = canvas.getContext('2d'); // get its context
  canvas.width = vid.videoWidth; // set its size to the one of the video
  canvas.height = vid.videoHeight;
  ctx.drawImage(vid, 0, 0);
  imageBlob =new Promise((res, rej)=>{
    canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
  })
  return new Promise((res, rej)=>{
    canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
  })
}

function download(blob){
    tmpbg.src = URL.createObjectURL(blob);
    tmpbg.style.display = "block";
    tmpbg.style.animation = "fadeout 4s";
    tmpbg.style.zIndex = "1000";
    imageBlob = blob;
    setTimeout(() => {
        // tmpbg.style.animation = "fadeout 3s";
        tmpbg.style.display = 'none';
    }, 3000);
}

// 배경 캡쳐 함수 끝
function downLoadMake(){
    console.log('이거 클릭됨');
    const webmShare = document.createElement("a");
    const webmUrl = window.URL.createObjectURL(recordedBlob);
    webmShare.href= webmUrl
    webmShare.download =`recording_${new Date()}.webm`
    document.body.appendChild(webmShare);
    webmShare.click();
    setTimeout(function() {
    document.body.removeChild(webmShare);
    window.URL.revokeObjectURL(webmUrl);
  }, 100);
}
function linkMoving(data){
    const linkdata = document.createElement("a");
    videoLoading.style.display = "none";
    linkdata.href = data;
    linkdata.click();
}
// 비디오 메타 데이터가 로드되었을 때
recordingPlayer.addEventListener("loadedmetadata", e => {
  setting.endTime = e.target.duration;
  console.log(setting.endTime);
}, false)

// 버튼 클릭 이벤트(시작, 끝)
btnSetStart.onclick = e => {
  if(setting.endTime <= recordingPlayer.currentTime){
    debug.innerHTML = "시작 시간은 끝 시간보다 크거나 같으면 안됩니다."
  } else {
    // setting.startTime = Math.floor(recordingPlayer.currentTime);
    setting.startTime = recordingPlayer.currentTime.toFixed(1);
    debug.innerHTML = `시작: ${setting.startTime} / 끝: ${setting.endTime} / 배경: ${setting.bgTime}`
    // 구간반복 ON 상태에서 시작 버튼 클릭하면 구간반복이 OFF되도록 함 (UX 측면)
  }
}
btnSetEnd.onclick = e => {
  if(setting.startTime >= recordingPlayer.currentTime){
    debug.innerHTML = "끝 시간은 시작 시간보다 작거나 같으면 안됩니다."
  } else {
    setting.endTime = recordingPlayer.currentTime.toFixed(1);
    debug.innerHTML = `시작: ${setting.startTime} / 끝: ${setting.endTime} / 배경: ${setting.bgTime}`;
    // console.log(progress.)
    // 구간반복 OFF 상태에서 끝 버튼 클릭하면 구간반복이 ON되도록 함 (UX 측면)
  }
}
btnSetbg.onclick = e => {
    setting.bgTime = recordingPlayer.currentTime.toFixed(1);
    debug.innerHTML = `시작: ${setting.startTime} / 끝: ${setting.endTime} / 배경: ${setting.bgTime}`;
    takeASnap(recordingPlayer)
        .then(download);
}

setDone.onclick = e=>{
    setting.vidDuration = recordingPlayer.duration;
    const uploadJson = new Blob([JSON.stringify(setting)], {type:"application/json"});
    console.log("image", imageBlob);
    let UploadFormData = new FormData();
    UploadFormData.append("files", recordedBlob, "video.webm");
    UploadFormData.append("files", uploadJson, "Upload.json");
    // UploadFormData.append("files", imageBlob, "bg.jpg");
    videoLoading.style.display="block";
    videoLoading.classList.toggle('blink');

    fetch('/remove_background2/bg',{
        method:'POST',
        cache: 'no-cache',
        body: UploadFormData
    })
        .then((response) => response.json())
        .then((data)=>{
            // linkMoving(data)
            console.log('이거언제됨..')
            console.log('data', data);
        });

    console.log('uploadformdata', UploadFormData);
}
downloadButton.onclick = e =>{
    downLoadMake();
}

