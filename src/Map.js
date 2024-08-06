import maplibregl from "maplibre-gl";

export class Map {
  constructor(elementId, data) {
    this.#createMap(elementId, data);
  }

  #createMap(elementId, data) {
    const coordinates = {
      C: [-1.62, 49.630001],
      Q: [-8.3056397, 51.8507428],
      S: [-1.4784297, 50.9138489],
    };

    let embarkedCountByPort = {};

    data.forEach((passenger) => {
      if (embarkedCountByPort[passenger.Embarked] === undefined) {
        embarkedCountByPort[passenger.Embarked] = 0;
      } else {
        embarkedCountByPort[passenger.Embarked] += 1;
      }
    });

    let geojsonFeatures = [];

    for (const key in embarkedCountByPort) {
      const feature = {
        type: "Feature",
        properties: { name: key, embarked: embarkedCountByPort[key] },
        geometry: {
          type: "Point",
          coordinates: coordinates[key],
        },
      };

      geojsonFeatures.push(feature);
    }

    const map = new maplibregl.Map({
      container: elementId,
      zoom: 9,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
    });

    const coordinatesOnly = geojsonFeatures.map(
      (feature) => feature.geometry.coordinates
    );

    map.on("load", () => {
      map.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: geojsonFeatures,
        },
      });
      map.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: {
          "circle-color": "#EE6C4D",
          "circle-opacity": 1,
          "circle-radius": 20,
        },
      });

      map.addLayer({
        id: "passenger-count",
        type: "symbol",
        source: "points",
        layout: {
          "text-field": ["get", "embarked"],
          "text-size": 12,
        },
      });

      const bounds = new maplibregl.LngLatBounds();
      coordinatesOnly.forEach((marker) => {
        bounds.extend(marker);
      });

      map.fitBounds(bounds, {
        padding: 100,
        duration: 0,
      });
    });
  }
}
