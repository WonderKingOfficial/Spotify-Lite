console.log(`WORKING---------------------------`, 101 + '%');
let search = "holy"
async function main() {
    let a = await fetch(`http://127.0.0.1:5500/Spotify%20Clone/songs`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.querySelectorAll('a.icon')

    let searchAbles = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.indexOf('/songs/') != -1) {
            searchAbles.push(element.href)
        }
    }
    console.log(searchAbles);

    let allSongs = []
    searchAbles.forEach(async e => {
        let nowFolder = (e.split(`/songs/`)[1]);
        let searchFolder = await fetch(e)
        let response = await searchFolder.text();
        let div = document.createElement("div")
        div.innerHTML = response;

        let songIn = div.querySelectorAll('a.icon')

        for (let i = 0; i < songIn.length; i++) {
            const e = songIn[i];
            if(e.href.endsWith('.mp3')) {
                console.log(e.href.split(`/${nowFolder}/`)[1].toLocaleLowerCase().replaceAll("%20", " "));
                let song = e.href.split(`/${nowFolder}/`)[1].toLocaleLowerCase().replaceAll("%20", " ");

                if(song.indexOf(search) != -1) {
                    console.log(e.href);
                }

            }
        }
    });


    

}
main()