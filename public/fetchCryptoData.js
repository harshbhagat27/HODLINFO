
function fetchDataAndPopulateTable() {
  fetch("http://localhost:5000/hodinfo")
    .then((response) => response.json())
    .then((data) => {
      function calculateDifferencePercentage(buy, sell) {
        return ((sell - buy) / buy * 100).toFixed(2);
      }

      function updateTable() {
        const cryptoDataContainer = document.getElementById("cryptoDataContainer");
        
        cryptoDataContainer.innerHTML = "";
        data.forEach((crypto, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${crypto.name}</td>
            <td>${crypto.last}</td>
            <td>${crypto.buy} / ${crypto.sell}</td>
            <td class="${crypto.difference_percent < 0 ? 'negative' : ''}">
              ${calculateDifferencePercentage(parseFloat(crypto.buy), parseFloat(crypto.sell))}%
            </td>
            <td>${crypto.base_unit}</td>
            `;
          cryptoDataContainer.appendChild(row);
        });
      }
      updateTable();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

document.addEventListener("DOMContentLoaded", fetchDataAndPopulateTable);
