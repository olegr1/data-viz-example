import { BarChart } from "./BarChart";
import { Map } from "./Map";
import { DataTable } from "./DataTable";
import data from "./titanic-data.json";

document.addEventListener("DOMContentLoaded", () => {
  //new DataTable("passengerTableWrap", data);
  new BarChart("barChartContainer", data);
  new Map("mapContainer", data);
});
