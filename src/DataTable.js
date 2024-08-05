export class DataTable {
  constructor(elementId, data) {
    this.#createPassengerTable(elementId, data);
  }

  #createPassengerTable(elementId, data) {
    const element = document.getElementById(elementId);

    let tableHeaders = "";

    for (const property in data[0]) {
      tableHeaders += `<th>${property}</th>`;
    }

    const tableHeadersRow = `<tr>${tableHeaders}</tr>`;

    let tableRows = "";

    data.forEach((passenger) => {
      let tableCells = "";

      for (const passengerDetail in passenger) {
        tableCells += `<td>${passenger[passengerDetail]}</td>`;
      }

      tableRows += `<tr>${tableCells}</tr>`;
    });

    const table = `<table>${tableHeadersRow + tableRows}</table>`;

    element.insertAdjacentHTML("beforeend", table);
  }
}
