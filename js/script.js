const cardContainer = document.querySelector(".cards");
const playButton = document.querySelector("#play-button")
const previousButton = document.querySelector("#previous-button")
const nextButton = document.querySelector("#next-button");
let playerlist = document.querySelector("#table");
const playbarInfo = document.querySelector(".playbar-info")
function convertSecondsToMinutesSeconds(seconds) {
    // Round down to ignore any decimal places
    seconds = Math.floor(seconds);

    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return formattedMinutes + ':' + formattedSeconds;
}


let index = 0;




var audio = new Audio();
let songsTitle = [];

async function getsong(folder) {

    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    let n = 1;
    songsTitle = [];
    playerlist.innerHTML = '';
    for (let i = 0; i < as.length; i++) {

        let element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
            songsTitle.push(element.title);


            playerlist.innerHTML += ` <tr class="flex">
            <td class="track flex">${n}    </td>        
            <td ><img src="svg/music.svg" alt=""></td>
            <td>
                <div class="td-flex">
                    
                    ${element.title}
                </div>
            </td>
            <td class="play-now">Play Now <button id="play-button" class="play-button">
                    <img src="svg/play.svg" alt="">
                </button> </td>
        </tr>`
            n++;
        }

    }
    playsong(songs[0], 0);
    let tr = Array.from(document.querySelector("#table").getElementsByTagName("tr"));
    tr.forEach((e) => {
        e.addEventListener("click", () => {
            let currentsong = songs[`${e.querySelector(".track").innerHTML}` - 1];
            
            let t = e.querySelector(".track").innerHTML - 1;
            playsong(currentsong, t, 1);
        })
    })

    return songs
}



async function playsong(track, t, a) {
    index = t;
    audio.src = track;
    audio.play();
    if (a == 1) {
        playButton.querySelector("img").src = "svg/paused.svg"

    }
    playbarInfo.innerHTML = songsTitle[t];

}
async function displayAlbmus() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    for (let i = 0; i < as.length; i++) {
        let element = as[i];
        if (element.href.includes("/songs/")) {
            let folder = (element.href.split("/")[4]);
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
          
            cardContainer.innerHTML += `<div class="card" data-folder-name="${folder}">
            <img src="/songs/${folder}/cover.jpg" alt="">
            <button class="folder_song_btn"><svg data-encore-id="icon" role="img" aria-hidden="true"
                    viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE">
                    <path
                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                    </path>
                </svg></button>
            <h2>${response.title}</h2>
            <p>${response.description}</p>

        </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        card.addEventListener("click", async () => {
            if (audio.paused) {

                audio.play();
                playButton.querySelector("img").src = "svg/paused.svg"
            }

            foldername = card.getAttribute("data-folder-name");
            songs = await getsong(foldername);
        })
    })
}
async function main() {
    let songs = await getsong("arjite");
    displayAlbmus();
    playButton.addEventListener("click", () => {
        if (audio.paused) {

            audio.play();
            playButton.querySelector("img").src = "svg/paused.svg"
        }
        else {
            audio.pause();
            playButton.querySelector("img").src = "svg/play.svg"
        }
    })
    document.querySelector("#previous-button").addEventListener("click", () => {
        if (index > 0) {
            let psong = songs[index - 1];

            playsong(psong, index - 1, 1);
        }
    })
    document.querySelector("#next-button").addEventListener("click", () => {
        if (index < songs.length - 1) {
            let nsong = songs[index + 1];

            playsong(nsong, index + 1, 1);
        }
    })
    audio.addEventListener("timeupdate", () => {
        
        document.querySelector(".currenttime").innerHTML = convertSecondsToMinutesSeconds(audio.currentTime);
        document.querySelector(".duration").innerHTML = convertSecondsToMinutesSeconds(audio.duration);
        document.querySelector(".circle").style.left = (audio.currentTime) / (audio.duration) * 100 + "%";
    })
    document.querySelector(".line").addEventListener("click", (e) => {
       
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width * 100 + "%");
        audio.currentTime = (audio.duration * (e.offsetX / e.target.getBoundingClientRect().width * 100) / 100);
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    document.querySelector(".volume").addEventListener("change", (e) => {
        audio.volume = parseInt(e.target.value) / 100;
        let volume_icon = document.querySelector(".volume_icon")
        if (volume_icon.src.includes("mute.svg")) {
            volume_icon.src = volume_icon.src.replace("mute.svg", "volume.svg");
        }
    })

    document.querySelector(".volume_icon").addEventListener("click", (e) => {
       
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            audio.volume = 0;
            document.querySelector(".volume").value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            audio.volume = .50;
            document.querySelector(".volume").value = 50;
        }
    })


}
main();


