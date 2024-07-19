maptilersdk.config.apiKey = maptilerApiKey;
console.log(campground)
const theme = sessionStorage.getItem('theme');

    const map = new maptilersdk.Map({
        container: 'map3',
        style: maptilersdk.MapStyle.DATAVIZ.DARK,
        center: campground.geometry.coordinates,
        zoom: 9,
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