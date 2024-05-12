import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstance.current) {
        chartInstance.current.data.labels = Object.keys(data);
        chartInstance.current.data.datasets[0].data = Object.values(data);
        chartInstance.current.update();
      } else {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
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

export default LineChart;
