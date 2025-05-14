
document.getElementById("calcularButton").addEventListener("click", function () {
  const capitalInicial = parseFloat(document.getElementById("capitalInicial").value);
  const taxaJuros = parseFloat(document.getElementById("taxaJuros").value) / 100;
  const aporteMensal = parseFloat(document.getElementById("aporteMensal").value);
  const meses = parseInt(document.getElementById("periodo").value);

  let montante = capitalInicial;
  const historico = [];

  for (let mes = 1; mes <= meses; mes++) {
    montante = montante * (1 + taxaJuros) + aporteMensal;
    historico.push({ mes, valor: montante });
  }

  document.getElementById("montanteFinal").textContent =
    `Montante Final: R$${montante.toFixed(2)}`;

  document.getElementById("resultados").classList.remove("hidden");
  document.getElementById("baixarPDF").classList.remove("hidden");

  const canvas = document.getElementById("grafico");
  if (canvas.chart) {
    canvas.chart.destroy();
  }

  const ctx = canvas.getContext("2d");
  canvas.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historico.map(h => `Mês ${h.mes}`),
      datasets: [{
        label: 'Crescimento do Montante',
        data: historico.map(h => h.valor),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });

  document.getElementById("baixarPDF").onclick = function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Relatório de Investimento", 20, 20);
    let y = 30;
    historico.forEach(h => {
      doc.text(`Mês ${h.mes}: R$${h.valor.toFixed(2)}`, 20, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("relatorio-investimento.pdf");
  };
});
