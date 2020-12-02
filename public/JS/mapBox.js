import mapboxgl from 'mapbox-gl';

const locations = JSON.parse(document.getElementById('map').dataset.locations);
mapboxgl.accessToken =
    'pk.eyJ1IjoiZGV2aWxrc2siLCJhIjoiY2tpNWgwdTY0MmtzaDMwbHRqeXhuc3g1aSJ9.OtwdJVT6-41FFZg-WVaWyQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/devilksk/cki5hoxoy6gzp19omrjz2f9oa',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 4,
    // interactive: false
});

const bound = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
    const el = document.createElement('div', (el.className = 'marker'));
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
    })
        .setLngLat(loc.coordinates)
        .addTo(map);
    new mapboxgl.Popup({
        offset: 30,
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
    bounds.extend(loc.coordinates);
});

map.fitBounds(bound, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
    },
});
