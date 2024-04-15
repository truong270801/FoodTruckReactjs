// mapHelpers.js
import mapboxgl from "mapbox-gl";

export function initializeMap(container) {
  return new mapboxgl.Map({
    container: container,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-122.40945776860957, 37.7653468958055],
    zoom: 12,
  });
}

export function loadLocationIcon(map) {
  map.loadImage(require("../img/mylocation.png"), (error, image) => {
    if (error) throw error;
    map.addImage("location-icon", image);
    map.addSource("my-location-src", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-122.40945776860957, 37.7653468958055],
            },
            properties: {
              name: "My Location",
            },
          },
        ],
      },
    });
    map.addLayer({
      id: "my-location",
      type: "symbol",
      source: "my-location-src",
      layout: {
        "icon-image": "location-icon",
        "icon-size": 0.9,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
  });
}

export function loadTruckLocations(map) {
  map.loadImage(require("../img/location.png"), (error, image) => {
    if (error) throw error;
    map.addImage("truck-icon", image);
    map.addLayer({
      id: "truck-locations",
      type: "symbol",
      source: "truck-locations",
      layout: {
        "icon-image": "truck-icon",
        "icon-size": 0.7,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
  });
}
