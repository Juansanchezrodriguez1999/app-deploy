import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstance.current) {
        // Si el gráfico ya existe, actualizamos solo los datos
        chartInstance.current.data.labels = Object.keys(data);
        chartInstance.current.data.datasets[0].data = Object.values(data);
        chartInstance.current.update();
      } else {
        // Si el gráfico no existe, lo creamos
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(data),
            datasets: [{
              label: 'Especies recolectadas',
              data: Object.values(data),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
