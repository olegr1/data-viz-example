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
        "https://api.maptiler.com/maps/streets/style.json?key=ZcY6gxhp822E0VEwjEBJ",
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
          "circle-color": [
            "match",
            ["get", "name"],
            "S",
            "#c73f1f",
            "C",
            "#1097b9",
            "Q",
            "#e19400",
            "#000000",
          ],
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
          "text-font": ["Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: {
          "text-color": "#FFFFFF",
        },
      });

      const bounds = new maplibregl.LngLatBounds();
      coordinatesOnly.forEach((marker) => {
        bounds.extend(marker);
      });

      map.fitBounds(bounds, {
        padding: 100,
        duration: 1000,
      });
    });
  }
}
