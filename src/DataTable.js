export class DataTable {
  constructor(data, elementId) {
    this.#createPassengerTable(elementId, data);
  }

  #createPassengerTable(elementId, data) {
    const element = document.getElementById(elementId, data);

    //console.log(data[0]);

    let tableHeaders = "";

    for (const property in data[0]) {
      tableHeaders += `<th>${property}</th>`;
    }

    const tableHeadersRow = `<tr>${tableHeaders}</tr>`;

    let tableRows = "";

    data.forEach((passenger) => {
      let tableCells = "";

      for (const passengerDetail in passenger) {
        console.log(`${passenger[passengerDetail]}`);
        tableCells += `<td>${passenger[passengerDetail]}</td>`;
      }

      tableRows += `<tr>${tableCells}</tr>`;
    });

    const table = `<table>${tableHeadersRow + tableRows}</table>`;

    //console.log(data);

    element.insertAdjacentHTML("beforeend", table);
  }
}
