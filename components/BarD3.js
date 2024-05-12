import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarD3 = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const svg = d3.select(chartRef.current);
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;

      svg.selectAll('*').remove();

      const x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1)
        .domain(Object.keys(data));

      const y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, d3.max(Object.values(data))]).nice();

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(Object.entries(data))
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', ([key]) => x(key))
        .attr('y', ([, value]) => y(value))
        .attr('width', x.bandwidth())
        .attr('height', ([, value]) => height - margin.bottom - y(value))
        .attr('fill', 'steelblue');
    }
  }, [data]);

  return <svg ref={chartRef} width="550" height="260"></svg>;
};

export default BarD3;
