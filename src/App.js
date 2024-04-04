import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const mapContainer = useRef(null);
  const [radius, setRadius] = useState(1);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmV0YXBjaG9pMTBrIiwiYSI6ImNrY2ZuaWEwNjA2ZW0yeWw4bG9yNnUyYm0ifQ.bFCQ-5yq6cSsrhugfxO2_Q';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.40945776860957, 37.7653468958055], // Initial coordinates
      zoom: 12,
    });
    
      const data = {
        "type": "FeatureCollection",
        "features": [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-122.40945776860957, 37.7653468958055]
            },
            properties: {
                name: 'My Location'
            }
        
        }]
    }
    map.on('load', (e) => {
      map.loadImage(
        require('./img/mylocation.png'),

          function (error, image) {
              if (error) throw error;
              map.addImage('location-icon', image);
              map.addSource('my-location-src', {
                  type: 'geojson',
                  data: data
              });
              map.addLayer({
                  id: 'my-location',
                  type: 'symbol', 
                  source: 'my-location-src',
                  layout: {
                      'icon-image': 'location-icon', 
                      'icon-size': 0.9, 
                      'icon-allow-overlap': true, 
                      'icon-ignore-placement': true 
                  }
              });
              map.addLayer({
                  id: 'my-location-name',
                  type: 'symbol',
                  source: 'my-location-src',
                  layout: {
                      'text-field': ['format', ['get', 'name'], { 'font-scale': 1 }],
                      'text-size': 12,
                      'text-offset': [0, 2]
                  },
                  paint: {
                      'text-color': '#000000'
                  }
              });
          }
      );
    });
    
   
    // Load data from API
    async function fetchData() {
      try {
        const response = await fetch('https://data.sfgov.org/resource/rqzj-sfat.json');
        const data = await response.json();

        // Create features from data
        const features = data.map(truck => {
          const truckLat = parseFloat(truck.latitude);
          const truckLon = parseFloat(truck.longitude);
          let dist = calculateDistance( 37.7653468958055,-122.40945776860957, truckLat, truckLon);
          if (dist <= radius) {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [truckLon, truckLat]
              },
              properties: {
                applicant: truck.applicant,
                fooditems: truck.fooditems,
                facilitytype: truck.facilitytype,
                address: truck.address,
                locationdescription: truck.locationdescription,
                status: truck.status,
                dayshours: truck.dayshours,
                expirationdate: truck.expirationdate,
                approved: truck.approved,
              }
            };
          } else {
            return null;
          }
        });

        // Filter out null values
        const filteredFeatures = features.filter(feature => feature !== null);

        // Add data as a source to the map
        map.addSource('truck-locations', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: filteredFeatures
          }
        });

        map.loadImage(
          require('./img/location.png'),
          function (error, image) {
            if (error) throw error;
            map.addImage('truck-icon', image);
            map.addLayer({
              id: 'truck-locations',
              type: 'symbol',
              source: 'truck-locations',
              layout: {
                'icon-image': 'truck-icon',
                'icon-size': 0.7,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
              }
            });
          }
        );
        
            

        map.on('click', 'truck-locations', function (e) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { properties } = e.features[0];

           new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <h3>${properties.applicant}</h3>
              <p><strong>Food Items:</strong> ${properties.fooditems}</p>
              <p><strong>Facility Type:</strong> ${properties.facilitytype}</p>
              <p><strong>Address:</strong> ${properties.address}</p>
              <p><strong>Status:</strong> ${properties.status}</p>
              <p><strong>Days/Hours:</strong> ${properties.dayshours}</p>
              <p><strong>Expiration Date:</strong> ${properties.expirationdate}</p>
              <p><strong>Approved:</strong> ${properties.approved}</p>
            `)
            .addTo(map);
        });

        map.on('mouseenter', 'truck-locations-layer', function () {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'truck-locations-layer', function () {
          map.getCanvas().style.cursor = '';
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Call fetchData function
    fetchData();

    // Cleanup
    return () => map.remove();
  }, [radius]);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // bán kính Trái Đất trong kilômét
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = //công thức haversine
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // khoảng cách giữa hai điểm
    return distance;
  }

  const closePanel = () => {
    var elm = document.querySelector('.wrapper .left-panel');
    if (elm) {
      elm.style.left = '-100%';
    }
    document.querySelector('.wrapper .open-panel').style.display = 'flex';
  };

  const openPanel = () => {
    var elm = document.querySelector('.wrapper .left-panel');
    if (elm) {
      elm.style.left = '1rem';
    }
  };

  return (
    <div className="wrapper">
      <div className="left-panel">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              <b>Food Trucks Finder</b>
              <i className="fa-solid fa-xmark" style={{ float: 'right' }} onClick={closePanel}></i>

            </h4>
          </div>
        </div>
        <div className="content">
          <b >
            DISTANCE:
            <input type="number" id="radius" min="0" step="0.1" value={radius}
              onChange={(e) => setRadius(e.target.value)} />
            Km

          </b>
         

        </div>
      </div>
      <div className="open-panel" onClick={openPanel}>
        <i className="fa-sharp fa-solid fa-bars"></i>
      </div>
      <div ref={mapContainer} className="map-container"></div>

    </div>


  );
}

export default App;
