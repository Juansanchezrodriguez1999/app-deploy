import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieD3 = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (data && svgRef.current) {
      const width = 400;
      const height = 400;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(d3.schemeCategory10);

      const pie = d3.pie()
        .value(d => d.value);

      const data_ready = pie(Object.entries(data).map(([key, value]) => ({ key, value })));

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      svg.selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.key))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);

      svg.selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => d.data.key)
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', 17);
    }
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default PieD3;
