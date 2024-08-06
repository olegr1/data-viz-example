import { BarChart } from "./BarChart";
import { DataTable } from "./DataTable";
import data from "./titanic-data.json";

import maplibregl from "maplibre-gl";

document.addEventListener("DOMContentLoaded", () => {
  //new DataTable("passengerTableWrap", data);
  new BarChart("barChartContainer", data);

  const map = new maplibregl.Map({
    container: "map",
    style:
      "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
  });

  map.on("load", () => {
    map.addSource("points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { id: "Cherbourg", embarked: 100 },
            geometry: {
              type: "Point",
              coordinates: [-1.62, 49.630001],
            },
          },
          {
            type: "Feature",
            properties: { id: "Queenstown", embarked: 200 },
            geometry: {
              type: "Point",
              coordinates: [-8.3056397, 51.8507428],
            },
          },
          {
            type: "Feature",
            properties: { id: "Southampton", embarked: 300 },
            geometry: {
              type: "Point",
              coordinates: [-1.4784297, 50.9138489],
            },
          },
        ],
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
  });
});
