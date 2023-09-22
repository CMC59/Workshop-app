// On initialise la latitude et la longitude du centre de la France
var lat = 46.603354;
var lon = 1.888334;
var macarte = null;

// OpenWeatherMap API key
const apiKey = '3ab1225bc74eef749ea4786c62008e06';

// // Function to fetch weather data for a city
// function fetchWeatherData(cityName, marker) {
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=fr&appid=${apiKey}`;
//     fetch(apiUrl)
//         .then((response) => response.json())
//         .then((data) => {
//             const temperature = data.main.temp;
//             const description = data.weather[0].description;
//             const iconCode = data.weather[0].icon;
//             const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`; // URL to the weather icon

//             // Update the marker's popup with city name, weather icon, and weather information in Celsius
//             const popupContent = `
//                 <div class="popup-content">
//                     <h1>${cityName}</h1>
//                     <img src="${iconUrl}" alt="Weather Icon">
//                     <p>Temperature: ${temperature}°C</p>
//                     <p>Description: ${description}</p>
//                 </div>
//             `;

//             marker.bindPopup(popupContent, { className: 'custom-popup' }).openPopup();
//         })
//         .catch((error) => {
//             console.error('Error fetching weather data:', error);
//         });
// }



function initMap() {
    macarte = L.map('map', {
        center: [46.603354, 1.888334],
        zoom: 6,
        scrollWheelZoom: false, // Disable zooming with the scroll wheel
        maxBounds: [ // Define the maximum and minimum boundaries for the map
            [51.124199, -5.142315], // Upper-left corner (Northwest) - Adjust these coordinates as needed
            [41.329080, 9.561067]  // Lower-right corner (Southeast) - Adjust these coordinates as needed
        ]
    });

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}


// Function to fetch festivals with the key = "discipline_dominante" - value = "Musique" from the API
function fetchMusiqueFestivals() {
    const apiUrl = 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=100';

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Assuming your JSON data is stored in a variable called 'festivals'
            const festivals = data.results;

            // Iterate through the festivals and create red markers for each festival
            festivals.forEach((festival) => {
                const lon = festival.geocodage_xy.lon;
                const lat = festival.geocodage_xy.lat;

                // Create a red marker and add it to the map
                const redMarker = L.marker([lat, lon], {
                    icon: L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                    }),
                }).addTo(macarte);

                // Fetch weather data for the festival's location
                fetchWeatherData(festival, redMarker);
            });
        })
        .catch((error) => {
            console.error('Error fetching festival data:', error);
        });
}

$(document).ready(function () {
    // Initialize the DataTable
    const festivalTable = $('#festivalTable').DataTable();

    // Function to fetch festival data and populate DataTable
    function fetchMusiqueFestivals() {
        const apiUrl = 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=100';

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                // Assuming your JSON data is stored in a variable called 'festivals'
                const festivals = data.results;

                // Iterate through the festivals and create DataTable rows
                festivals.forEach((festival) => {
                    // Create a row for the DataTable with festival information
                    const tableRow = `
                        <tr>
                            <td>${festival.nom_du_festival}</td>
                            <td>${festival.commune_principale_de_deroulement}</td>
                            <td><a href="${festival.site_internet_du_festival}" target="_blank">${festival.site_internet_du_festival}</a></td>
                            <td>${festival.annee_de_creation_du_festival}</td>
                            <td>${festival.discipline_dominante}</td>
                            <td>${festival.periode_principale_de_deroulement_du_festival}</td>
                        </tr>
                    `;

                    // Append the row to the DataTable
                    festivalTable.row.add($(tableRow)).draw();
                });
            })
            .catch((error) => {
                console.error('Error fetching festival data:', error);
            });
    }

    // Call fetchMusiqueFestivals to initiate the data fetch and population
    fetchMusiqueFestivals();
});


// Function to fetch weather data for a festival's location
function fetchWeatherData(festival, marker) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${festival.geocodage_xy.lat}&lon=${festival.geocodage_xy.lon}&units=metric&lang=fr&appid=${apiKey}`;
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`; // URL to the weather icon

            // Update the marker's popup with festival information and weather data
            const popupContent = `
                <div class="popup-content">
                    <h1 class="text"> Nom du Festival: ${festival.nom_du_festival}</h1>
                    <p class="text">Lieu: ${festival.commune_principale_de_deroulement}</p>
                    <p class="text">Code Postal: ${festival.code_postal_de_la_commune_principale_de_deroulement}</p>
                    <h1 class="text"> Nous sommes le ${formattedDate} Voici la Météo</h1>
                    <p class="text">Temperature: ${temperature}°C</p>
                    <p class="text">${description}</p>
                    <img src="${iconUrl}" alt="Weather Icon">
                </div>
            `;

            marker.bindPopup(popupContent, { className: 'custom-popup' });
        })
        .catch((error) => {
            console.error('Error fetching weather data:', error);
        });
}


// Call the fetchMusiqueFestivals function to fetch and display musique festivals with red markers on the map
fetchMusiqueFestivals();

const frenchMonths = {
    Janvier: 1, Février: 2, Mars: 3, Avril: 4,
    Mai: 5, Juin: 6, Juillet: 7, Août: 8,
    Septembre: 9, Octobre: 10, Novembre: 11, Décembre: 12
};

// URL to fetch the JSON data
const url = 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=100';

// Assuming you have fetched the JSON data and extracted the content between parentheses as shown previously
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Extract the content between parentheses
        const extractedContentBetweenParentheses = data.results.map(result => {
            const period = result.periode_principale_de_deroulement_du_festival;
            const match = /\(([^)]+)\)/.exec(period);
            if (match && match.length > 1) {
                return match[1]; // Get the content between parentheses
            }
            return ''; // Return an empty string if no match
        });

        // Format the date ranges within extractedContentBetweenParentheses
        const formattedDateRanges = extractedContentBetweenParentheses.map(dateRange => formatDateRange(dateRange));

        // Log the formatted date ranges
        // console.log(formattedDateRanges);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    function formatDateRange(dateRange) {
        if (!dateRange) {
            return ''; // Return an empty string if dateRange is null or undefined
        }
    
        const currentYear = new Date().getFullYear();
    
        // Define a mapping of month names to their numeric values
        const monthMap = {
            janvier: 1, février: 2, mars: 3, avril: 4, mai: 5, juin: 6,
            juillet: 7, août: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12
        };
    
        // Split the date range into start and end dates
        const [startStr, endStr] = dateRange.split(' - ');
    
        // Ensure that both startStr and endStr are valid before splitting
        if (!startStr || !endStr) {
            return ''; // Return an empty string if either part is missing
        }
    
        // Replace "1er" with "01" in the startStr and endStr
        const startStrNormalized = startStr.replace('1er', '01');
        const endStrNormalized = endStr.replace('1er', '01');
    
        // Split the normalized start date into day and month
        const [startDay, startMonth] = startStrNormalized.split(' ');
    
        // Use the monthMap to get the numeric value of the month
        const startMonthIndex = monthMap[startMonth.toLowerCase()];
    
        // Format the start date
        const formattedStartDate = `${startDay.padStart(2, '0')}/${startMonthIndex.toString().padStart(2, '0')}/${currentYear}`;
    
        // Split the normalized end date into day and month
        const [endDay, endMonth] = endStrNormalized.split(' ');
    
        // Use the monthMap to get the numeric value of the month
        const endMonthIndex = monthMap[endMonth.toLowerCase()];
    
        // Format the end date
        const formattedEndDate = `${endDay.padStart(2, '0')}/${endMonthIndex.toString().padStart(2, '0')}/${currentYear}`;
        
        // Combine the formatted dates with a hyphen
      var difference =  calculateDaysBetweenDates(`${formattedStartDate} - ${formattedEndDate}`);
    //   console.log(difference);
    }
    
    function calculateDaysBetweenDates(dateRange) {
        // Split the date range into start and end dates
        const [startDateStr, endDateStr] = dateRange.split(' - ');
    
        // Parse the start and end dates
        const [startDay, startMonth, startYear] = startDateStr.split('/');
        const [endDay, endMonth, endYear] = endDateStr.split('/');
    
        // Create Date objects for the start and end dates
        const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
        const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);
    
        // Calculate the time difference in milliseconds
        const timeDifference = endDate - startDate;
    
        // Convert milliseconds to days
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    
        // Calculate the middle date by adding half of the time difference to the start date
        const middleDate = new Date(startDate.getTime() + timeDifference / 2);
    
        // Format the middle date as dd/mm/yyyy
        const formattedMiddleDate = `${middleDate.getDate().toString().padStart(2, '0')}/${(middleDate.getMonth() + 1).toString().padStart(2, '0')}/${middleDate.getFullYear()}`;
    
        console.log(formattedMiddleDate);
        return formattedMiddleDate;
    }
    
    
    

    const currentDate = new Date();

    // Get the current date in DD/MM/YYYY format with French formatting
    const formattedDate = currentDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    });
    
    // console.log(formattedDate); // Example output: "21/09/2023" (for September 21, 2023)
    

window.onload = function () {
    initMap();
};

