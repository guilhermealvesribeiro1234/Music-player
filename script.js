
const songs = [
    {
        title: "Música 1",
        artist: "Artista 1",
        src: "musicas/musica1.mp3"
    },
    {
        title: "Música 2",
        artist: "Artista 2",
        src: "musicas/musica2.mp3"
    },
    {
        title: "Música 3",
        artist: "Artista 3",
        src: "musicas/musica3.mp3"
    }
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const songList = document.getElementById("song-list");

let songIndex = 0;

// Formata o tempo em minutos e segundos.
function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Carrega uma música.
function loadSong(index) {
    songIndex = (index + songs.length) % songs.length;

    const song = songs[songIndex];

    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    renderPlaylist();
}

// Inicia a reprodução.
async function playSong() {
    try {
        await audio.play();
        playBtn.textContent = "⏸";
        playBtn.setAttribute("aria-label", "Pausar");
    } catch (error) {
        playBtn.textContent = "▶";
        console.error("Não foi possível reproduzir:", error);
    }
}

// Pausa a reprodução.
function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Reproduzir");
}

// Alterna entre play e pausa.
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Avança para a próxima música.
function nextSong() {
    loadSong(songIndex + 1);
    playSong();
}

// Volta para a música anterior.
function prevSong() {
    loadSong(songIndex - 1);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Atualiza a barra de progresso.
audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration)) return;

    progress.value =
        (audio.currentTime / audio.duration) * 100;

    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

// Permite avançar ou retroceder na música.
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
        audio.currentTime =
            (Number(progress.value) / 100) * audio.duration;
    }
});

// Controle de volume.
volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

audio.volume = Number(volume.value);

// Toca automaticamente a próxima música ao terminar.
audio.addEventListener("ended", nextSong);

// Cria a lista de músicas na tela.
function renderPlaylist() {
    songList.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("div");
        item.className = "song" +
            (index === songIndex ? " active" : "");

        const number = document.createElement("span");
        number.className = "song-number";
        number.textContent = index === songIndex ? "♫" : "♪";

        const details = document.createElement("div");
        details.className = "song-details";

        const songTitle = document.createElement("strong");
        songTitle.textContent = song.title;

        const songArtist = document.createElement("span");
        songArtist.textContent = song.artist;

        details.append(songTitle, songArtist);
        item.append(number, details);

        item.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        songList.appendChild(item);
    });
}

// Inicialização.
loadSong(0);
