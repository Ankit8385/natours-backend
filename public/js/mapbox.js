/* eslint-disable*/
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5raXRndXB0YTczOTgiLCJhIjoiY2x5NjF3ejNyMDVyYzJqcXI4dWp6NGx1dSJ9.0AFoqUHjV-htdZNxEZPN2g';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ankitgupta7398/cly63ebdf00ch01pgeag389x7',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 5,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add Popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
