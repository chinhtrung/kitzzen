mapboxgl.accessToken = mapToken; // mapToken variable is coming from header file
const coordinates = thisFood.geometry.coordinates;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML (
                `<h4>${thisFood.name}</h4><p>${thisFood.location}</p>`
            )
    )
    .addTo(map);

// Add fullscreen control to the map.
map.addControl(new mapboxgl.FullscreenControl());

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());