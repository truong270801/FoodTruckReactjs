

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
    },
  });
}
