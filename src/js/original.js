const URL_SERVER = "https://www.webaudiomodules.com/community/plugins.json";
const BASE_URL_SERVER = "https://www.webaudiomodules.com/community";
let divPlugins;
let URL_DU_PLUGIN;
window.onload = init;
let totalPlugins;
let currentPage = 0;
const itemsPerPage = 10;  // Number of items you want to show per page
let currentPluginsList = [];  // This will hold the current list of plugins (sorted or unsorted)
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
async function init() {
	// appelée quand la page est affichée: quand le DOM est prêt
	console.log("DOM ready, requesting list of plugins")

	const reponseJSON = await fetch(URL_SERVER);
	const listeWams = await reponseJSON.json();

	// handle to the ul element that will
	// contain the list
	currentPluginsList = listeWams;
	totalPlugins = listeWams.length;
	divPlugins = document.querySelector("#listeWams");

	displayWAMs(listeWams);
	//triWAMS('name');
	displayWAMs(listeWams);
	document.getElementById('sortByName').addEventListener('click', () => {
		authorSelect.value = 'all';
		catSelect.value = 'all';
		document.getElementById('searchBar').value = '';

		triWAMS('name');
	});
	document.getElementById('sortByVendor').addEventListener('click', () => {
		authorSelect.value = 'all';
		catSelect.value = 'all';
		document.getElementById('searchBar').value = '';
		triWAMS('version');
	});
	const searchBar = document.getElementById('searchBar'); // Replace 'searchBar' with the actual ID of your search input field
	document.getElementById('loadMore').addEventListener('click', () => {
		currentPage++;  // Increase the current page
		console.log("Current Page:", currentPage);  // Debug: Check the current page number
		displayWAMs(currentPluginsList);  // Call to display the next set of items
	});
	searchBar.addEventListener('input', (event) => {
		const searchTerm = event.target.value;
		searchWAMs(searchTerm);
	});
	const authorSelect = document.getElementById('select');
	const catSelect = document.getElementById('selectC');

	authorSelect.addEventListener('change', () => {
		updateFiltersAndDisplay();
	});
	document.getElementById('resetFilters').addEventListener('click', resetFiltersAndDisplay);
	function resetFiltersAndDisplay() {
		document.getElementById('searchBar').value = '';
		authorSelect.value = 'all';
		catSelect.value = 'all';
		currentPluginsList = listeWams;

    currentPage = 0;
    displayWAMs(currentPluginsList);
	}
	catSelect.addEventListener('change', () => {
		updateFiltersAndDisplay();
	});

	
	function updateFiltersAndDisplay() {
		document.getElementById('searchBar').value = '';
		const selectedAuthor = authorSelect.value;
		const selectedCat = catSelect.value;

		if (selectedAuthor === 'all' && selectedCat === 'all') {
			// If both filters are set to 'all', sort by name
			triWAMS('name');
		} else {
			// Filter based on both author and category
			const filteredPlugins = listeWams.filter(wam => {
				const matchesAuthor = selectedAuthor === 'all' || wam.vendor.toLowerCase() === selectedAuthor.toLowerCase();
				const matchesCategory = selectedCat === 'all' || (
					Array.isArray(wam.category) && wam.category.some(cat => cat.toLowerCase() === selectedCat.toLowerCase())
				);
				return matchesAuthor && matchesCategory;
			});

			// Display the filtered plugins
			currentPluginsList = filteredPlugins;

    currentPage = 0;
    displayWAMs(currentPluginsList);
		}
	}

}
async function displayWAMs(listePlugins) {
	// Clear existing content
	divPlugins.innerHTML = currentPage === 0 ? '' : divPlugins.innerHTML; // Clear content if it's the first page, else append

    const pluginCountElement = document.getElementById('pluginCount');
    pluginCountElement.textContent = listePlugins.length;

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
	console.log("Displaying from", startIndex, "to", endIndex); // Debug: Check the range being displayed

    const pluginsToDisplay = listePlugins.slice(startIndex, endIndex);
    console.log("Plugins to Display:", pluginsToDisplay);  // Debug: Check the actual plugins being displayed
	const loadMoreButton = document.getElementById('loadMore'); // Replace with your actual button ID

	
	for (let i = 0; i < pluginsToDisplay.length; i++) {
		let wam = pluginsToDisplay[i];
		// create a link element to display "testLoadWam.html" page with the url of the plugin as http parameter
		let link = document.createElement("a");
		link.href = `testLoadWam.html?url=${BASE_URL_SERVER}/plugins/${wam.path}`;
		link.target = "_self";
		let title = document.createElement("h2");
		title.innerHTML = `${wam.name} by ${wam.vendor}`;
		link.appendChild(title);
		let img = document.createElement("img");
		let p = document.createElement("p");
		p.innerHTML = `${wam.description}`;
		img.width = 250;
		img.src = `${BASE_URL_SERVER}/plugins/${wam.thumbnail}`;
		let desc = document.createElement("p");
		desc.innerHTML = `${wam.description}`;
		divPlugins.append(link);
		divPlugins.append(p);
		divPlugins.append(img);
	}
    loadMoreButton.style.display = endIndex < currentPluginsList.length ? 'block' : 'none';

	if(listePlugins.length==0 && currentPage === 0)
	{
		divPlugins.innerHTML = 'No plugin found';
	}
}
let isAscending = true;

async function triWAMS(sortProperty) {
	// Fetch the list of plugins
	const reponseJSON = await fetch(URL_SERVER);
	const listeWam = await reponseJSON.json();
	// Determine the sorting order based on the current state
	const sortOrder = isAscending ? 1 : -1;

	// Sort the list of plugins based on a specific property (e.g., name)
	listeWam.sort((a, b) => {
		const propA = String(a[sortProperty]).toUpperCase(); // Convert to uppercase for case-insensitive sorting
		const propB = String(b[sortProperty]).toUpperCase();

		return sortOrder * propA.localeCompare(propB);
	});
	currentPluginsList = listeWam.slice();

	// Call the function to display the sorted plugins
	currentPage = 0;
    displayWAMs(currentPluginsList);

	// Call the function to display the sorted plugins
	isAscending = !isAscending;
	// displayWAMs(listeWams);
}
async function searchWAMs(searchTerm) {
	// Fetch the list of plugins
	document.getElementById('select').value = 'all'; // Reset the select element to 'all' when the search bar is used
	document.getElementById('selectC').value = 'all';
	const responseJSON = await fetch(URL_SERVER);
	const listeWams = await responseJSON.json();

	// Filter the list based on the search term
	const filteredWams = listeWams.filter((wam) => {
		const searchableProperties = ['name', 'description', 'keywords', 'vendor']; // Add other properties to search if needed
		return searchableProperties.some((property) =>
			String(wam[property]).toUpperCase().includes(searchTerm.toUpperCase())
		);
	});

	// Call the function to display the filtered plugins
	currentPluginsList = filteredWams;

    currentPage = 0;
    displayWAMs(currentPluginsList);
}
const voiceSearchButton = document.getElementById('voiceSearchButton');
if (voiceSearchButton) {
	voiceSearchButton.addEventListener('click', () => {
		recognizeSpeech();
	});
}


function recognizeSpeech() {
	const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
	recognition.lang = 'en-UK';

	recognition.onresult = (event) => {
		const voiceSearchResult = event.results[0][0].transcript;
		document.getElementById('searchBar').value = voiceSearchResult;
		searchWAMs(voiceSearchResult);
	};

	recognition.start();
}