const play1 = document.getElementById("play");
const stop1 = document.getElementById("stop");
const ok = document.getElementById("ok");
play1.onclick = () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    mediaRecorder = new mediaRecorder(stream);
    mediaRecorder.start();
    chuck = [];
    mediaRecorder.addEventListener("dataavailable", (e) => {
      chuck.push(e.data);
    });
    mediaRecorder.addEventListener("stop", (e) => {
      blob = new Blob(chuck);
      audio_url = URL.createObjectURL(blob);
      audio = new Audio(audio_url);
      audio.setAttribute("controls", 1);
      ok.appendChild(audio);
    });
  });
};
stop.onclick = () => {
  mediaRecorder.stop();
};
