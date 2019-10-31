URL = window.URL
let userAudioStream;
let soundInput;
let recorderObj;
let recording = false;

console.log(window.URL);

//GET CONTROLS
const stopBtn = document.getElementById('stop');
const pauseButton = document.getElementById('pause');
const recordButton = document.getElementById('record');


//ADD EVENT LISTENERS
stopBtn.addEventListener('click', () => stopRecording())
pauseButton.addEventListener('click', () => pauseRecording())
recordButton.addEventListener('click', () => pressedRecord())

stopBtn.disabled = true;
pauseButton.disabled = true;
recordButton.disabled = false;


// GET AUDIO STREAM ON RECORD

const pressedRecord = () => {
  stopBtn.disabled = false;
  recordButton.disabled = true;
  pauseButton.disabled = false;

  recording = true;
  alertFunction();

  navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    })
    .then(stream => {
      console.log("We are getting the stream hold up, initializing")

      userAudioStream = stream;

      let audioContext = new AudioContext;

      soundInput = audioContext.createMediaStreamSource(stream)

      recorderObj = new Recorder(soundInput)

      recorderObj.record()
      console.log('Recording is started')

      recordButton.innerHTML = 'Record'


    })
    .catch(err => {
      console.log(err);
      recordButton.disabled = false;
      pauseButton.disabled = false;
      stopBtn.disabled = false;

    })
}

const stopRecording = () => {
  recording = false;
  alertFunction();

  recordButton.disabled = false;
  stopBtn.disabled = true;
  pauseButton.disabled = true;

  recorderObj.stop()

  userAudioStream.getAudioTracks()[0].stop();

  recorderObj.exportWAV(createDownloadLink);



}



const createDownloadLink = (blob) => {

  console.log('...Creating download link')

  let url = URL.createObjectURL(blob);

  const audioTag = document.createElement('audio');
  const audioLi = document.createElement('li');
  const link = document.createElement('a');

  audioTag.src = url;
  audioTag.controls = true;

  link.href = url;
  link.download = new Date().toISOString() + '.wav'
  link.innerHTML = 'Download'
  link.classList.add("btn", "btn-dark", "mb-5", "ml-3");


  console.log(link.download)

  audioLi.appendChild(audioTag)
  audioLi.appendChild(link)

  const myRecordings = document.getElementById('my-recordings')

  myRecordings.appendChild(audioLi);
  const alerts = document.getElementById('alertFlash')

  alerts.innerHTML = 'Audio File Ready'
  alerts.classList.add('alert-success')
  alerts.classList.remove('alert-danger')

}

const pauseRecording = () => {
  recording = false;
  alertFunction()
  recordButton.disabled = false;
  stopBtn.disabled = true;
  pauseButton.disabled = true;

  if (recorderObj.recording === true) {

    recorderObj.stop()
    recordButton.innerHTML = 'Resume'

  } else {

    recorderObj.record()
    recordButton.innerHTML = 'Record'

  }

  recordButton.InnerHTML = 'Record'

}




const alertFunction = () => {

  const alerts = document.getElementById('alertFlash')
  console.log(alerts.classList)

  if (!recording) {

    alerts.classList.add('alert-danger');
    alerts.innerHTML = 'Not Recording';


  } else {

    alerts.classList.remove('alert-danger')
    alerts.classList.add('alert-success');
    alerts.innerHTML = 'Recording';

  }

}