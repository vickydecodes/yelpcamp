maptilersdk.config.apiKey = maptilerApiKey;

const place = document.querySelector('#place');
const lat = document.querySelector('#lat');
const lon = document.querySelector('#lon');
const geometryinput = document.querySelector('#geometry');
const theme = sessionStorage.getItem('theme');



    const map = new maptilersdk.Map({
        container: 'map2',
        style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
        center: [16.62662018, 49.2125578],
        zoom: 14,
        hash: true,
    });


let marker = new maptilersdk.Marker()
    .setLngLat([campground.geometry.coordinates[0], campground.geometry.coordinates[1]])
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);

const geocodingControl = new maptilersdkMaptilerGeocoder.GeocodingControl({});

const handleGeocodingError = (error) => {
    console.error("Geocoding error:", error);
    alert("Geocoding failed! Please try again with a different search term.");
};

map.addControl(geocodingControl, 'top-left');

geocodingControl.addEventListener('response', (data) => {
    console.log(data);
    let data2 = data.detail;
    const coordinates = data2.featureCollection.features[0].geometry.coordinates;
    const formattedAddress = data2.featureCollection.features[0].place_name;
    let LattitudeLongitude = data2.featureCollection.features[0].center;
    let geometry = data2.featureCollection.features[0].geometry;

    console.log(geometry);

    // Update input fields with new data
    lat.value = LattitudeLongitude[1];
    lon.value = LattitudeLongitude[0];
    geometry.coordinates[1] = LattitudeLongitude[1];
    geometry.coordinates[0] = LattitudeLongitude[0];
    geometryinput.value = geometry.type;
    place.value = formattedAddress;

    console.log("Coordinates:", coordinates);
    console.log("Formatted Address:", formattedAddress);

    // Center the map to the new coordinates
    map.setCenter(coordinates);
});

geocodingControl.addEventListener('pick', function(){
    if (marker) {
        marker.remove();
    }
})

geocodingControl.addEventListener('error', handleGeocodingError);
