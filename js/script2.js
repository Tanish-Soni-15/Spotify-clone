let playerlist = document.querySelector("#table");
const playButton = document.querySelector("#play-button")
const previousButton = document.querySelector("#previous-button")
const nextButton = document.querySelector("#next-button");
const playbarInfo = document.querySelector(".playbar-info")

var audio = new Audio();
let songsTitle = [];
let songs_href = [];

async function getsong() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");


    let n = 1;
    for (let i = 0; i < as.length; i++) {

        let element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs_href.push(element.href);
            songsTitle.push(element.title);
            playerlist.innerHTML += ` <tr>
            <td class="track">${n}</td>
            <td>
                <div class="td-flex">
                    <img src="music.svg" alt="">
                    ${element.title}
                </div>
            </td>
            <td class="play-now">Play Now <button id="play-button" class="play-button">
                    <img src="play.svg" alt="">
                </button> </td>
        </tr>`
            n++;
        }

    }


}

getsong();
console.log(songsTitle);
    console.log(songs_href);
function playsong(track) {
    console.log(track)
    console.log(songsTitle);
    console.log(songs_href);
    audio.src = songs_href[track];
    audio.play();
    playButton.querySelector("img").src = "paused.svg";
    playbarInfo.innerHTML = songsTitle[track];

}



let tr = Array.from(document.querySelector("#table").getElementsByTagName("tr"));
tr.forEach((e) => {
    e.addEventListener("click", () => {
        let track = e.querySelector(".track").innerHTML - 1;
        console.log(track)
        playsong(track);
    })
})

playButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playButton.querySelector("img").src = "paused.svg"
    }
    else {
        audio.pause();
        playButton.querySelector("img").src = "play.svg"
    }
})
