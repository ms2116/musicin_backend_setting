// editor modal 파트 시작
// const templete_modal = document.querySelectorAll()

const editor_modal = document.querySelector(".editor_modal");
const btnOpenPopup = document.querySelector('.btn-open-popup');
const editorPageMenu  = document.querySelector(".editor_page_menu")
const closeBtnEditor = editor_modal.querySelector(".close-area-editor");
const webmCam = document.querySelector("#webmcam");
const recordingResult = document.querySelector(".recording_result");

let resultChunks;
let webmCamMode = false;
// let webmCamMode = true;

btnOpenPopup.addEventListener('click', () => {
    editorPageMenu.style.display = "none";
    editor_modal.classList.toggle('show');
    webmCamMode = false;
    webmCam.style.display = "none";
    stopCamera();
    render();
});
editor_modal.addEventListener('click', (event) => {
    if (event.target === editor_modal) {
        editor_modal.classList.toggle('show');
    }
});
//

let timerId = 0;
// 배경선택 버튼별 기능구현
// const canvasClearHolo = holo_modal.querySelector("#canvas_clear");
const holoModal = document.querySelector(".holo_modal")
const btnOpenHolo = document.querySelector(".btn-open-holo");
const closeBtnHolo = holoModal.querySelector(".close-area-holo");

btnOpenHolo.addEventListener('click', () => {
    editorPageMenu.style.display = "none";
    holoModal.classList.toggle('show');
    webmCamMode = true;
    webmCam.style.display = "flex";
    capture(mode);
    render();
});
holoModal.addEventListener('click', (event) => {
    if (event.target === holoModal) {
        holoModal.classList.toggle('show');
    }
});

//캔버스관련 버튼
const canvasClear = document.querySelector(".canvas-clear");

// 베경 파일 추가 기능
const addBgFileName = document.querySelector("#bg-video-plus");
let bgAddFile = document.querySelector("#bg-input-form");

function addBgFile(){
    addBgFileName.src = URL.createObjectURL(bgAddFile.files[0]);
    addBgFileName.style.height = "60px" ;
}
// bgAddFile.addEventListener('change', function(e){
// holoModal.addEventListener("")

// 캔버스 파트 시작
const canvas = document.getElementById("canvas_editor");
const ctx = canvas.getContext("2d");
let background = document.createElement("video");

// let background = document.getElementById("bg-video1");
let webmVideo = document.getElementById("webm-video1");
let mode = "user";
let recResult;

const resultRecording = document.getElementById("result-recording");
const resultStop = document.getElementById("result-stop");
const resultDownload = document.getElementById("result-download");

//화면 출력 정의
let recordingTimeOut = document.getElementById("recording-timer");

//

function capture(mode) {
    if (webmCamMode == true) {
    navigator.mediaDevices
        .getUserMedia({
            audio: true,
            video: {
                facingMode: mode
            },
        })
        .then((stream) => {
            webmCam.srcObject = stream;
        });
    }
}
function stopCamera() {
    webmCam.srcObject && webmCam.srcObject.getTracks().forEach((t) => t.stop());
}

function render() {
    const width = background.videoWidth;
    const height = background.videoHeight;
    const ratio = Math.max(720 / width, 1280 / height);

    // const ratio = Math.trunc(((1280/720)*height)/2)
    // const x1tmp = Math.trunc(((1280/720)*height)/2)
    // const x2tmp = Math.trunc(((1280/720)*height)/2)

    ctx.clearRect(0, 0, 720, 1280);
    // ctx.drawImage(background, 0, 0, 1350, 1280);

    if (webmCamMode == false) {
        stopCamera();
        ctx.drawImage(
            background,
            0,
            0,
            width,
            height,
            (720 - width * ratio) / 2,
            (1280 - height * ratio) / 2,
            width * ratio,
            height * ratio
        );
        ctx.drawImage(webmVideo, 0, 0, 720, 1280);
        window.requestAnimationFrame(render);
    }
    if (webmCamMode == true){
        const widthCam = webmCam.offsetWidth;
        const heightCam = webmCam.offsetHeight;
        const ratioCam = Math.max(720 / widthCam, 1280 / heightCam);
        ctx.drawImage(
            webmCam,
            -119,
            0,
            widthCam* ratioCam,
            heightCam* ratioCam,
            (720 - widthCam * ratioCam) / 2,
            (1280 - heightCam * ratioCam) / 2,
            widthCam * ratioCam,
            heightCam * ratioCam
        );
        ctx.drawImage(webmVideo, 360, 640, 360, 640);
        window.requestAnimationFrame(render);
    }
}

capture(mode);
render();
// document.getElementById("switch").addEventListener("click", () => {
//    stopCamera();
//    mode = `${mode === "user" ? "environment" : "user"}`;
//    capture(mode);
// });
[...document.querySelectorAll(".bg_item")].forEach((bg_item) => {
    bg_item.addEventListener("click", (e) => {
        e.target.playsinline = "playsinline";
        background.pause();
        background = e.target;
        background.play();
    });
});
[...document.querySelectorAll(".webm_item")].forEach((webm_item) => {
    webm_item.addEventListener("click", (e) => {
        e.target.playsinline = "playsinline";
        webmVideo.pause();
        webmVideo = e.target;
        webmVideo.play();
    });
});


closeBtnEditor.addEventListener("click", e => {
    if (editor_modal.classList.contains('show')){
        editor_modal.classList.remove('show');
        editorPageMenu.style.display = '';
    }
});
closeBtnHolo.addEventListener("click", e => {
    if (holoModal.classList.contains('show')){
        holoModal.classList.remove('show');
        editorPageMenu.style.display = '';
    }
});

let ResultRecorder = null;
const arrVideoData = [];

resultRecording.addEventListener("click", e =>{
    const CanvasStreamMedia = canvas.captureStream();
    ResultRecorder = new MediaRecorder(CanvasStreamMedia);
    ResultRecorder.ondataavailable = (e) => {
        arrVideoData.push(e.data);
    }

    ResultRecorder.onstop = (e) =>{
        const blob = new Blob(arrVideoData);
        const blobURL = window.URL.createObjectURL(blob);
        const tmpVideoSave = document.createElement('video');
        console.log(blob.size)

        tempA = document.createElement('a');
        document.body.appendChild(tempA);
        tempA.style.display = "none";
        tempA.href = blobURL;
        tempA.download = `result_${new Date()}.webm`
        arrVideoData.splice(0);
        clearInterval(timeRecord);
        timerId = 0;
    }
    ResultRecorder.start();
    const timeRecord = setInterval(() => {
        console.log(++timerId);
        recordingTimeOut.innerHTML = `REC: ${timerId} s`}, 1000);
});
resultStop.addEventListener("click", (e) =>{
    ResultRecorder.stop();
})
resultDownload.addEventListener("click", (e) =>{
    tempA.click();
})



// [... document.querySelector(".canvas-clear").forEach(canvasClear) => {
//
// }]






