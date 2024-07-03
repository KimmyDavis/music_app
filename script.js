let titleDesc = [...document.querySelectorAll(".song-title")];
let artistDesc = document.querySelector(".song-artist");
let audio = document.querySelector("audio");
let poster = document.querySelector(".poster");
let fullTime = document.querySelector(".full-time");
let volumePercentage = document.querySelector(".volume-percentage");
let playButton = document.querySelector(".play-button");
let progress = document.querySelector(".progress");
let timer = document.querySelector(".time");
let volumeBar = document.querySelector(".volume");
let offCanvasBody = document.querySelector(".offcanvas-body");
let songsParent = document.createElement("ul");
let nextButton = document.querySelector(".next");
let prevButton = document.querySelector(".prev");

nextButton.addEventListener("click", () => prevOrNext("next"));
prevButton.addEventListener("click", () => prevOrNext("prev"));

songsParent.classList.add("list-group", "list-group-flush");
songsParent.classList.add();

for (let i = 0; i < songs.length - 1; i++) {
  let song = songs[i];
  let songContainer = document.createElement("li");
  songContainer.classList.add("list-group-item", "li__song");
  songContainer.setAttribute("role", "button");
  songContainer.addEventListener("click", () => {
    let songLink =
      "./songs/" +
      (song.title + "_" + song.artist).trim().replaceAll(" ", "_") +
      ".mp3";
    let posterLink =
      "./posters/" + song.title.trim().replaceAll(" ", "_") + ".jpg";
    audio.src = songLink;
    poster.src = posterLink;
    playButton.classList.add("fa-pause");
    playButton.classList.remove("fa-play");
    audio.play();
    progress.value = "0";
    localStorage.setItem("currentIndex", i);
    titleDesc.forEach((t) => (t.innerHTML = song.title));
    artistDesc.innerHTML = song.artist;
  });
  songContainer.setAttribute("data-bs-toggle", "offcanvas");
  let songTitle = document.createElement("h3");
  songTitle.classList.add("h3", "text-primary-emphasis");
  songTitle.appendChild(document.createTextNode(song.title));
  songContainer.appendChild(songTitle);
  let songArtist = document.createElement("h6");
  songArtist.classList.add("h6", "px-3");
  songArtist.appendChild(document.createTextNode(song.artist));
  songContainer.appendChild(songArtist);
  songsParent.appendChild(songContainer);
}
offCanvasBody.appendChild(songsParent);

window.onload = initialise;
volumeBar.addEventListener("input", adjustVolume);
window.addEventListener("keydown", (event) => {
  if (event.key == " ") {
    toggleAudio();
  } else if (event.key == "ArrowRight") {
    prevOrNext("next");
  } else if (event.key == "ArrowLeft") {
    prevOrNext("prev");
  } else if (event.key == "ArrowUp") {
    creaseVolume(0.1);
  } else if (event.key == "ArrowDown") {
    creaseVolume(-0.1);
  }
});
playButton.addEventListener("click", toggleAudio);
audio.ontimeupdate = updateSlider;
audio.onended = endEvent;
audio.onpause = pauseEffect;
audio.onplay = playEffect;

progress.addEventListener("input", updateTime);

function initialise() {
  audio.volume = 0.3;
  progress.value = "0";
  volumeBar.value = audio.volume;
  volumePercentage.innerHTML = audio.volume * 100 + "%";
  let currentIndex = localStorage.getItem("currentIndex") || 5;
  let memoryDetails = songs[currentIndex];
  audio.src =
    "./songs/" +
    (memoryDetails.title + "_" + memoryDetails.artist)
      .trim()
      .replaceAll(" ", "_") +
    ".mp3";
  poster.src =
    "./posters/" + memoryDetails.title.trim().replaceAll(" ", "_") + ".jpg";
  titleDesc.forEach((t) => (t.innerHTML = memoryDetails.title));
  artistDesc.innerHTML = memoryDetails.artist;
}
function toggleAudio() {
  if (audio.paused) {
    audio.play();
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
  } else {
    audio.pause();
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
  }
}
function updateSlider() {
  let val = audio.currentTime / audio.duration;
  progress.value = val;
  timer.innerHTML =
    parseTime(audio.currentTime) || 0 + "/" + parseTime(audio.duration) || 0;
  fullTime.innerHTML =
    parseTime(audio.duration) || 0 + "/" + parseTime(audio.duration) || 0;
}
function updateTime() {
  audio.currentTime = (100 * audio.duration * progress.value) / 100;
}
function endEvent() {
  prevOrNext("next");
}
function parseTime(sec) {
  let mins = sec ? Math.floor(sec / 60) : 0,
    rem = sec ? Math.round(sec % 60) : 0;
  if (rem > 59) {
    rem = 0;
    mins++;
  }
  return String(mins + ":" + rem);
}
function pauseEffect() {
  playButton.classList.remove("playing");
}
function playEffect() {
  playButton.classList.add("playing");
}
function adjustVolume() {
  audio.volume = volumeBar.value;
  volumePercentage.innerHTML = Math.round(audio.volume * 100) + "%";
}

function prevOrNext(action) {
  let currentIndex = Number(localStorage.getItem("currentIndex"));
  if (action == "prev") {
    let prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    let prevSong = songs[prevIndex];
    localStorage.setItem("currentIndex", prevIndex);
    audio.src =
      "./songs/" +
      (prevSong.title + "_" + prevSong.artist).trim().replaceAll(" ", "_") +
      ".mp3";
    poster.src =
      "./posters/" + prevSong.title.trim().replaceAll(" ", "_") + ".jpg";
    titleDesc.forEach((t) => (t.innerHTML = prevSong.title));
    artistDesc.innerHTML = prevSong.artist;
  } else if (action == "next") {
    let nextIndex =
      currentIndex < songs.length - 1 ? currentIndex + 1 : songs.length - 1;
    let nextSong = songs[nextIndex];
    localStorage.setItem("currentIndex", nextIndex);
    audio.src =
      "./songs/" +
      (nextSong.title + "_" + nextSong.artist).trim().replaceAll(" ", "_") +
      ".mp3";
    poster.src =
      "./posters/" + nextSong.title.trim().replaceAll(" ", "_") + ".jpg";
    titleDesc.forEach((t) => (t.innerHTML = nextSong.title));
    artistDesc.innerHTML = nextSong.artist;
  }
  audio.play();
  playButton.classList.remove("fa-play");
  playButton.classList.add("fa-pause");
}

function creaseVolume(step) {
  console.log(volumeBar.value);
  let currentVolume = Number(volumeBar.value);
  let newVolume = currentVolume + step / 10;
  if (newVolume <= 0) {
    newVolume = 0;
  } else if (newVolume >= 1) {
    newVolume = 1;
  }
  audio.value = newVolume;
  volumeBar.value = newVolume;
  volumePercentage.innerHTML = Math.round(newVolume * 100) + "%";
}
