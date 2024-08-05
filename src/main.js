import { BarChart } from "./BarChart";
import { DataTable } from "./DataTable";
import data from "./titanic-data.json";

document.addEventListener("DOMContentLoaded", () => {
  //new DataTable("passengerTableWrap", data);
  new BarChart("barChartContainer", data);
});
