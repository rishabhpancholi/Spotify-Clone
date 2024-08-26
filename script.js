console.log("Let's write some javascript")

// async function get_songs(){
//     let b=await fetch("http://127.0.0.1:5500/songs/")
//     let response=await b.text();
//     console.log(response)
//     let div=document.createElement("div")
//     div.innerHTML=response;
//     let as=div.getElementsByTagName("a")
//     console.log(as)
    
//     let songs=[]
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if(element.href.endsWith(".mp3")){
//             songs.push(element.href)
//         }
//     }

//     return songs
//  } 

//  async function main(){
//     let songs=await get_songs()
//     console.log(songs)
//  }

//  main()

async function get_songs() {
    let b = await fetch("http://127.0.0.1:5500/songs/");
    let response = await b.text();
    console.log("Response from server:", response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log("Links found:", as);

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    console.log("Songs list:", songs);
    return songs;
}


let current_song=new Audio
let current_song_url= null
let songs

const playMusic = (track, pause=false) => {
    current_song.src= "/songs/"+track

    if(!pause){
        current_song.play()
        play.src="images/pause-stroke-rounded.svg"
    }
    else{
        current_song.pause()
        play.src="images/play-stroke-rounded.svg"
    }

    current_song.play().catch(error => {
        console.error("Error playing audio:", error);
    });
    document.querySelector(".song-information").innerHTML=track.replaceAll("%20"," ").split(".mp3")[0]
    document.querySelector(".song-time").innerHTML="00:00/00:00"
}

function formatTime(seconds) {
    // Calculate the number of minutes
    let minutes = Math.floor(seconds / 60);

    // Calculate the remaining seconds
    let remainingSeconds = seconds % 60;

    // Pad the minutes and seconds with leading zeros if they are less than 10
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (remainingSeconds < 10) {
        remainingSeconds = '0' + remainingSeconds;
    }

    // Return the formatted time
    return minutes + ':' + remainingSeconds;
}

async function main() {

    // Get the list of all the songs
    songs = await get_songs();
    console.log("Fetched songs:", songs);

    playMusic(songs[0],true)

    // Show all the songs in the playlist
    let song_list = document.querySelector(".songs ul");
    for (const song of songs) {
        song_list.innerHTML += `
            <li id="play-song">
                <div class="song-info">
                    <div class="song-name">${song.replaceAll("%20", " ").split(".")[0]}</div>
                </div>
                <div class="play-now">
                    <span>Play</span>
                    <img class="invert" src="images/play-circle-stroke-rounded.svg" alt="">
                </div>
            </li>
        `;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let song_name = e.querySelector(".song-info").firstElementChild.innerHTML.trim();
            console.log("Clicked song name:", song_name);
            let song_file = songs.find(song => decodeURIComponent(song).split(".")[0] === song_name);
            console.log("Matching song file:", song_file);

            if (song_file) {
                playMusic(song_file);
            } else {
                console.error("Song file not found for:", song_name);
            }
        });
    });

    //Attach an event listener to previous,play and next

    play.addEventListener("click",()=>{
        if(current_song.paused){
            current_song.play()
            play.src="images/pause-stroke-rounded.svg"
        }
        else{
            current_song.pause()
            play.src="images/play-stroke-rounded.svg"
        }
    })


    //Listen for timeupdate event

    current_song.addEventListener("timeupdate",()=>{
        console.log(current_song.currentTime,current_song.duration)
        document.querySelector(".song-time").innerHTML=`${formatTime(Math.floor(current_song.currentTime))}/${formatTime(Math.floor(current_song.duration))}`
        document.querySelector(".circle").style.left=-0.5 + (current_song.currentTime/current_song.duration)*100 + "%"
    })

    //Add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX / e.target.getBoundingClientRect().width)
        document.querySelector(".circle").style.left=-0.5 + percent*100 +"%"
        current_song.currentTime=(current_song.duration)*percent
    })

    //Add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-100%"
    })

    // Add an event listener to previous and next

    previous.addEventListener("click",()=>{
        let index=songs.indexOf(current_song.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
          playMusic(songs[index-1])
        }
    })

    next.addEventListener("click",()=>{
      let index=songs.indexOf(current_song.src.split("/").slice(-1)[0])
      if((index+1) < songs.length){
        playMusic(songs[index+1])
      }
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
      current_song.volume=parseInt(e.target.value)/100;
    })
}

main();
