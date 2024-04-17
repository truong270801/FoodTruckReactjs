
import mapboxgl from "mapbox-gl";
export async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export function createFeatures(truckData, radius) {
  return truckData.map((truck) => {
    const truckLat = parseFloat(truck.latitude);
    const truckLon = parseFloat(truck.longitude);
    let dist = calculateDistance(37.7653468958055,-122.40945776860957,truckLat,truckLon
    );
    if (dist <= radius) {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [truckLon, truckLat],
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
        },
      };
    } else {
      return null;
    }
  }).filter((feature) => feature !== null);
}
// distanceHelpers.js

export function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Earth's radius in kilometers
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c; // Distance between two points
  return distance;
}

export function addDataToMap(map, features) {
  map.addSource("truck-locations", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: features,
    }
  });
  
    
      map.on('click', 'truck-locations', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
  const name = e.features[0].properties.applicant;
  const foodItems = e.features[0].properties.fooditems;
  const facilityType = e.features[0].properties.facilitytype;
  const Address = e.features[0].properties.address;
  const locationDescription = e.features[0].properties.locationdescription;
  const Status = e.features[0].properties.status;
  const Dayshours = e.features[0].properties.dayshours;
  const Expirationdate = e.features[0].properties.expirationdate;
  const Approved = e.features[0].properties.approved;
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<h3>${name}</h3><p><b>Facility Type: </b>${facilityType}</p><p><b>Address: </b>${Address}</p><p><b>Food Items: </b>${foodItems}</p><p><b>Location Description: </b>${locationDescription}</p><p><b>Status: </b><i>${Status}</i></p><p><b>Days hours: </b>${Dayshours}</p><p><b>Approved: </b>${Approved}</p><p><b>Expiration date: </b>${Expirationdate}</p>`)
        .addTo(map);
      
      });
     
  
    
 
}
