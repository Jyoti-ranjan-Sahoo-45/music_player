// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const categoryButtons = document.querySelectorAll('.category');
const audioElement = document.getElementById('audioElement');
const audioPlayer = document.getElementById('audioPlayer');
const nowPlaying = document.getElementById('nowPlaying');

// State Management
let currentData = {};

// Search Functionality
async function fetchResults(query) {
  const types = 'track,album,artist,playlist';
  const url = `https://v1.nocodeapi.com/jyoti45r/spotify/IQowSpHwmUlrrIBO/search?q=${encodeURIComponent(query)}&type=${types}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    currentData = data;
    displayResults('tracks'); // Default to tracks view
  } catch (error) {
    console.error("Error fetching data:", error);
    resultsDiv.innerHTML = `
      <div class="section">
        <h2 class="section-title">Error</h2>
        <p>Sorry, we couldn't fetch the data. Please try again later.</p>
      </div>
    `;
  }
}

// Display Results
function displayResults(selectedCategory) {
  resultsDiv.innerHTML = "";

  if (!currentData || !currentData[selectedCategory]?.items) {
    resultsDiv.innerHTML = `
      <div class="section">
        <h2 class="section-title">No Results</h2>
        <p>No results found for your search.</p>
      </div>
    `;
    return;
  }

  const items = currentData[selectedCategory].items;
  createResultSection(selectedCategory, items);
}

// Create Result Section
function createResultSection(category, items) {
  const section = document.createElement("div");
  section.className = "section";

  const header = document.createElement("h2");
  header.className = "section-title";
  header.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
  section.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "music-grid";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "music-card";

    let title = item.name;
    let artist = category === 'tracks' ? item.artists[0].name : '';
    let imageUrl = item.images?.[0]?.url || (item.album?.images?.[0]?.url);

    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = title;
      card.appendChild(img);
    }

    const content = document.createElement("div");
    content.className = "music-card-content";

    const titleElem = document.createElement("div");
    titleElem.className = "music-card-title";
    titleElem.textContent = title;
    content.appendChild(titleElem);

    if (artist) {
      const artistElem = document.createElement("div");
      artistElem.className = "music-card-artist";
      artistElem.textContent = artist;
      content.appendChild(artistElem);
    }

    card.appendChild(content);

    if (category === 'tracks' && item.preview_url) {
      card.addEventListener('click', () => playTrack(item));
    }

    grid.appendChild(card);
  });

  section.appendChild(grid);
  resultsDiv.appendChild(section);
}

// Audio Player Functionality
function playTrack(track) {
  if (track.preview_url) {
    audioElement.src = track.preview_url;
    audioPlayer.classList.add('active');
    nowPlaying.textContent = `${track.name} - ${track.artists[0].name}`;
    audioElement.play();
  } else {
    alert('Preview not available for this track');
  }
}

// Top Songs Functionality
async function fetchAndDisplayTopSongs(query, title) {
  const types = 'track';
  const url = `https://v1.nocodeapi.com/jyoti45r/spotify/IQowSpHwmUlrrIBO/search?q=${encodeURIComponent(query)}&type=${types}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const items = data.tracks?.items ? data.tracks.items.slice(0, 10) : [];
    createTopSongsSection(title, items);
  } catch (error) {
    console.error("Error fetching top songs:", error);
    const topSongsDiv = document.getElementById("topSongs");
    topSongsDiv.innerHTML += `
      <div class="section">
        <h2 class="section-title">Error</h2>
        <p>Error loading ${title}</p>
      </div>
    `;
  }
}

// Create Top Songs Section
function createTopSongsSection(title, items) {
  const topSongsDiv = document.getElementById("topSongs");
  const section = document.createElement("div");
  section.className = "section";

  const header = document.createElement("h2");
  header.className = "section-title";
  header.textContent = title;
  section.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "music-grid";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "music-card";

    let imageUrl = item.album?.images?.[0]?.url;
    
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = item.name;
      card.appendChild(img);
    }

    const content = document.createElement("div");
    content.className = "music-card-content";

    const titleElem = document.createElement("div");
    titleElem.className = "music-card-title";
    titleElem.textContent = item.name;
    content.appendChild(titleElem);

    const artistElem = document.createElement("div");
    artistElem.className = "music-card-artist";
    artistElem.textContent = item.artists[0].name;
    content.appendChild(artistElem);

    card.appendChild(content);

    if (item.preview_url) {
      card.addEventListener('click', () => playTrack(item));
    }

    grid.appendChild(card);
  });

  section.appendChild(grid);
  topSongsDiv.appendChild(section);
}

// Initialize Top Songs
function loadTopSongs() {
  const topCategories = [
    { query: "Top 10 Hindi Songs", title: "Top Hindi Songs" },
    { query: "Top 10 Odia Songs", title: "Top Odia Songs" },
    { query: "Top 10 International Songs", title: "Top International Songs" }
  ];
  topCategories.forEach(cat => {
    fetchAndDisplayTopSongs(cat.query, cat.title);
  });
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchResults(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const categoryType = btn.getAttribute("data-type");
    displayResults(categoryType);
  });
});

// Initialize the application
window.addEventListener("DOMContentLoaded", () => {
  loadTopSongs();
});