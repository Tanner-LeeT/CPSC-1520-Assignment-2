var searchForm = document.getElementById('album-search-form');
var searchInput = document.getElementById('search-input');
var minAlbumRating = document.getElementById('min-album-rating-input');
var albumColumHeaders = document.getElementById('albumn-column-headers');
var albumRows = document.getElementById('album-rows');

searchForm.addEventListener('submit', submitForm);

// Function prevent default, and grab the users input
function submitForm(e){
  e.preventDefault();
  var searchTerm = searchInput.value.trim();
  var minRating = parseFloat(minAlbumRating.value);
  main(searchTerm, minRating);
}

function validateInput(e){
}
async function loadAlbumData() {
  try {
    const response = await fetch('public/data/albums.json');
    const data = await response.json();
    return data; // Returns the fetched album data
  } catch (error) {
    console.error('Error loading album data:', error);
    return []; // Returns an empty array if there's an error
  }
}

function renderAlbumData(albums) {
  const albumRows = document.getElementById('album-rows');
  // Clearing previous table content
  albumRows.innerHTML = '';
  // Displaying each album
  albums.forEach(album => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${album.album}</td>
      <td>${album.releaseDate}</td>
      <td>${album.artistName}</td>
      <td>${album.genres}</td>
      <td>${album.averageRating}</td>
      <td>${album.numberReviews}</td>
    `;
    albumRows.appendChild(row);
  });
}

// Main function to load, render, and filter album data
async function main(searchTerm, minRating) {
  // Load album data
  const albumData = await loadAlbumData();
  // Make a copy of the album data, since we don't want to alter the actual data
  const albumStore = [...albumData];
  // Filter albums based on search term and minimum rating (if provided) NOTE: this does not filter based off album name, and rating. If a correct name is in place, then the result will still show, despite the rating input by the user being below the threshold
  const filteredAlbums = albumStore.filter(album => {
    const includesSearchTerm = (
      album.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artistName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const meetsMinRating = minRating > 0 ? album.averageRating >= minRating : true;
    return includesSearchTerm && meetsMinRating;
  });
  // Rendering the filtered album data
  renderAlbumData(filteredAlbums);
}


// Calling the main function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load and render all albums initially
  main('', 0);
});
