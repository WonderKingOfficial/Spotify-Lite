let currentSong = new Audio();
let songs;
let currFolder;

function timeConvert(timeInSeconds) {
    // Extract seconds and milliseconds
    var seconds = Math.floor(timeInSeconds);
    var milliseconds = Math.round((timeInSeconds - seconds) * 1000);

    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros
    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Return the formatted time without milliseconds
    return formattedMinutes + ":" + formattedSeconds;
}




async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.querySelectorAll("a.file")


    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML = '';
    console.log(songs);
    for (const song of songs) {
        console.log(song);
        songUl.innerHTML = songUl.innerHTML + `<li>
        <img class="songpic invert" src="images/music.svg" alt="">
        <div class="info">

            <span>${song.replaceAll('%20', " ")}</span>
            <span>Wonderking</span>
        </div>
        <div class="playNow">
            <span>PLay now</span>
            <img class="invert" src="images/play.svg" alt="" style="height: 33px;padding: -1px;">
        </div>

    </li>`

        if (song == songs[songs.length - 1]) {
            songUl.innerHTML = songUl.innerHTML + `
        <div class="block" style='height: 300px; width: 100px;'></div>`
        }
    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            play.src = "images/pause.svg"
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    //   let audio = new Audio("/Songs/"+track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "images/pause.svg"
        setTimeout(() => {
            document.querySelector('.songDuration').innerHTML = `${timeConvert(currentSong.duration)}`
            document.querySelector('.songTime').innerHTML = `00:00`

        }, 100);
    }
    console.log(track);
    document.querySelector('.songInfo').innerHTML = `Now : ${decodeURI(track.replace('.mp3', ''))}`
    for (let i = 0; i < songs.length; i++) {
        // console.log( songs[i].replaceAll("%20", " "), track.replaceAll("%20", " "));
        if (songs[i].replaceAll("%20", " ") == track.replaceAll("%20", " ")) {
            if (i + 1 != songs.length) {
                document.querySelector('.upnext').innerHTML = `Up Next : ${decodeURI(songs[i + 1].replace('.mp3', ''))}`
            } else {
                document.querySelector('.upnext').innerHTML = `Up Next : ---`
            }
        }
    }
    document.querySelector('.songTime').innerHTML = "-:--"
    document.querySelector('.playTime').value = 0

}

async function displayAlbums() {
    let a = await fetch(`/Songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a')
    let cardContainer = document.querySelector('.cardContainer')
    let array = Array.from(anchors)
    for (let i = 0; i < array.length; i++) {
        const e = array[i];

        if (e.href.includes("/Songs/")) {
            let folder = e.href.split('/').slice(-1)[0];

            let a = await fetch(`/Songs/${folder}/info.json`)
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card" data-folder="${folder}">
            <div class="play" >
                <div class="circular-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"
                        stroke="currentColor" fill="#000" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="lucide lucide-play"
                        style="padding-bottom: 3px; color:black;">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    </div>
            </div>
            <img src="/Songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`;
        }
        if (Array.from(anchors)[Array.from(anchors).length - 1] == e) {
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="block" style='height: 300px; width: 1020px;'></div>`
        }
    }


    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (item) => {
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    });
}

async function main() {
    await getSongs('Songs/2')
    console.log(songs);

    playMusic(songs[0], true)

    displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"
        } else {
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })

    // currentSong.addEventListener("timeupdate", () => {
    //     if (currentSong.currentTime != 0) {
    //         document.querySelector('.songTime').innerHTML = `${timeConvert(currentSong.currentTime)}/${timeConvert(currentSong.duration)}`
    //         document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'
    //     }
    // })
    let lastRun = 0;
    currentSong.addEventListener("timeupdate", () => {
        if (currentSong.currentTime != 0 && lastRun != timeConvert(currentSong.currentTime)) {
            document.querySelector('.songTime').innerHTML = `${timeConvert(currentSong.currentTime)}`
            document.querySelector('.songDuration').innerHTML = `${timeConvert(currentSong.duration)}`
            document.querySelector('.playTime').value = currentSong.currentTime / currentSong.duration * 100
        }
        lastRun = timeConvert(currentSong.currentTime);

        if (currentSong.currentTime == currentSong.duration) {
            if (currentSong.src.split('/').slice(-1)[0] == songs[songs.length - 1]) {
                play.src = "images/play.svg"
            } else {
                let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
                if ((index + 1) < songs.length) {
                    play.src = "images/pause.svg"
                    playMusic(songs[index + 1])
                }
            }
        }
    })

    // document.querySelector('.seekBar').addEventListener("click", e => {
    //     let percent = (e.offsetX / e.target.getBoundingClientRect().width * 100)
    //     document.querySelector('.circle').style.left = `${percent}%`;

    //     currentSong.currentTime = (currentSong.duration * percent) / 100
    // })
    document.querySelector('.playTime').addEventListener("change", (element) => {
        currentSong.currentTime = (element.target.value / 100) * currentSong.duration;
    })

    document.querySelector('.right').addEventListener("click", () => {
        if (document.querySelector('.left').style.left == '0%') {
            document.querySelector('.left').style.left = '-130%'
            document.querySelector('.right').style.filter = "blur(0px)"
        }
    })
    document.querySelector('.hamburger').addEventListener("click", () => {
        setTimeout(() => {
            document.querySelector('.left').style.left = '0%'
            document.querySelector('.right').style.filter = "blur(6px)"
        }, 0);
    })
    document.querySelector('.closeHamburger').addEventListener("click", () => {
        document.querySelector('.left').style.left = '-130%'
        document.querySelector('.right').style.filter = "blur(0px)"

    })


    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index - 1) > -1) {
            playMusic(songs[index - 1])
            play.src = "images/pause.svg"
        } else {
            currentSong.currentTime = 0
            document.querySelector('.playTime').value = 0
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index + 1) < songs.length) {
            play.src = "images/pause.svg"
            playMusic(songs[index + 1])
        }
    })

    document.querySelector('.volRange').addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        document.querySelector('.volPercent span').innerHTML = e.target.value + '%';
        if (currentSong.volume == 0) {
            document.querySelector('.volImg').src = document.querySelector('.volImg').src = 'images/volume-x.svg'
        } else if (currentSong.volume < 0.5) {
            document.querySelector('.volImg').src = document.querySelector('.volImg').src = 'images/volume-mid.svg'
        } else {
            document.querySelector('.volImg').src = document.querySelector('.volImg').src = 'images/volume.svg'
        }
        localStorage.setItem('preVolume', currentSong.volume)
    })
    document.querySelector('.nowNext').addEventListener("click", () => {
        document.querySelector('.left').style.left = '0%'
        document.querySelector('.right').style.filter = "blur(6px)"
    })

    document.querySelector('.volImg').addEventListener("click", (element) => {
        if (currentSong.volume == 0) {
            currentSong.volume = 1
            document.querySelector('.volImg').src = document.querySelector('.volImg').src.replace('images/volume-x.svg', `images/volume.svg`)
            document.querySelector('.volRange').value = 100;

            document.querySelector('.volPercent span').innerHTML = '100%'

        } else {
            currentSong.volume = 0
            document.querySelector('.volRange').value = 0;
            document.querySelector('.volImg').src = document.querySelector('.volImg').src.replace(`images/volume.svg`, 'images/volume-x.svg')

            document.querySelector('.volPercent span').innerHTML = '0%'
        }
        localStorage.setItem('preVolume', currentSong.volume)
    })

    document.querySelector(".logIn").addEventListener("click", () => {
        alert("NO NEED TO LOGIN EVERYTHING IS FREE HERE. ENJOY!")
    })
    document.querySelector(".signUp").addEventListener("click", () => {
        alert("NO NEED TO SIGNUP EVERYTHING IS FREE HERE. ENJOY!")
    })

    if (localStorage.getItem("preVolume") != null) {
        currentSong.volume = localStorage.getItem("preVolume")
        document.querySelector('.volRange').value = localStorage.getItem("preVolume") * 100;
        document.querySelector('.volPercent span').innerHTML = (localStorage.getItem("preVolume") * 100) + '%';
        if (currentSong.volume == 0) {
            document.querySelector('.volImg').src = document.querySelector('.volImg').src = 'images/volume-x.svg'
        } else if (currentSong.volume < 0.5) {
            document.querySelector('.volImg').src = document.querySelector('.volImg').src = 'images/volume-mid.svg'
        } else {
            document.querySelector('.volImg').src = document.querySelector('.volImg').src = 'images/volume.svg'
        }
    }

}

main();



