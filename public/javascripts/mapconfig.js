maptilersdk.config.apiKey = maptilerApiKey;

const place = document.querySelector('#place');
const lat = document.querySelector('#lat');
const lon = document.querySelector('#lon');
const theme = sessionStorage.getItem('theme');


const map = new maptilersdk.Map({
    container: 'map2',
    style: maptilersdk.MapStyle.DATAVIZ.DARK ,
    center: [16.62662018, 49.2125578],
    zoom: 14,
    hash: true,
});




const geocodingControl = new maptilersdkMaptilerGeocoder.GeocodingControl({});

const handleGeocodingResults = (results) => {
    const coordinates = results[0].coordinates;
    const formattedAddress = results[0].formattedAddress; // Optional

    console.log("Coordinates:", coordinates);
    console.log("Formatted Address:", formattedAddress); // Optional

    map.setCenter(coordinates);
};

const handleGeocodingError = (error) => {
    console.error("Geocoding error:", error);
    alert("Geocoding failed! Please try again with a different search term.");
};

map.addControl(geocodingControl, 'top-left');

geocodingControl.addEventListener('response', (data) => {
    console.log(data)
    let data2 = data.detail
    const coordinates = data2.featureCollection.features[0].geometry.coordinates;
    const formattedAddress = data2.featureCollection.features[0].place_name;
    let LattitudeLongitude = data2.featureCollection.features[0].center
    let geometry = data2.featureCollection.features[0].geometry// Optional
    console.log(geometry)
    lat.value = geometry.coordinates[0];
    lon.value = geometry.coordinates[1];
    geometry.coordinates[1] = LattitudeLongitude[1]
    geometry.coordinates[0] = LattitudeLongitude[0];

    place.value = formattedAddress;
    map.setCenter(coordinates);

});

geocodingControl.addEventListener('error', handleGeocodingError);




