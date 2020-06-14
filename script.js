const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");
const button = document.getElementById("btn");

const apiUrl = `https://api.lyrics.ovh`;

//search by song or artiste

async function searchSongs(searchTerm) {
  const getResponse = await fetch(`${apiUrl}/suggest/${searchTerm}`);
  const data = await getResponse.json();
  console.log(data);

  showDataInDom(data);
}

//show song and artiste in DOM
function showDataInDom(data) {
  let output = "";

  data.data.forEach((song) => {
    output += `
            <li>
            <span>
            <div class='image'> <img src = ${song.artist.picture} /></div>
           ${song.artist.name}-${song.title}</span>
           <button data-artist='${song.artist.name}'
           data-songtitle='${song.album.title}'>
           Get Lyrics
           </button>
            </li>
          `;

    result.innerHTML = `
    <ul class='songs'>
    ${output}
    </ul>
    `;
  });
  if (data.prev || data.next) {
    more.innerHTML = `
            ${
              data.prev
                ? `<button class='prev-next' onclick="moreSongs('${data.prev}')">Previous</button>`
                : ""
            }
            ${
              data.next
                ? `<button class='prev-next' onclick="moreSongs('${data.next}')">Next</button>`
                : ""
            }
            `;
  } else {
    more.innerHTML = "";
  }
  //   check(data);
}

// get more songs: prev/next
async function moreSongs(url) {
  const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await response.json();
  showDataInDom(data);
}

//////////////////////////////////////////////////////////////////////////////////////

result.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const artist = e.target.getAttribute("data-artist");
    const songTitle = e.target.getAttribute("data-songtitle");
    getLyrics(artist, songTitle);
  }
});

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `<h2><strong>${artist}</strong><h2> 
    <h2> ${songTitle} </h2>
    <span>${lyrics}</span>
    `;

  more.innerHTML = "";
}

//Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  //   console.log(searchTerm);
  if (searchTerm === "") {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.appendChild(document.createTextNode("Fill the input!!!"));
    const container = document.querySelector(".lyric-header");
    const before = document.getElementById("form");
    container.insertBefore(div, before);
    setTimeout(() => {
      div.remove();
    }, 1000);
  } else {
    searchSongs(searchTerm);
  }
});
