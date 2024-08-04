import { DataTable } from "./DataTable";
import data from "./titanic-data.json";

document.addEventListener("DOMContentLoaded", () => {
  new DataTable(data, "passengerTableWrap");
});
