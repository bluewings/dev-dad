/* eslint-disable no-param-reassign */
import { useEffect, useMemo, useState, useRef } from 'react';
import * as d3 from 'd3';

const getGradientId = (d) => `linkGrad-${d.source.index}-${d.target.index}`;

function useMatrix(inputData) {
  return useMemo(() => {
    const data = (inputData || []).map(({ names: [name1, name2], score1, score2 }) => ({
      name1,
      name2,
      score1,
      score2,
    }));

    const names = Object.keys(
      (data || []).reduce((accum, { name1, name2 }) => ({ ...accum, [name1]: true, [name2]: true }), {}),
    );

    const indexByName = names.reduce((accum, name, i) => ({ ...accum, [name]: i }), {});
    const nameByIndex = names.reduce((accum, name, i) => ({ ...accum, [i]: name }), {});

    const nameCount = Object.keys(indexByName).length;
    const matrix = Array(nameCount)
      .fill()
      .map(() => Array(nameCount).fill(0));
    data.forEach(({ name1, name2, score1, score2 }) => {
      matrix[indexByName[name1]][indexByName[name2]] = score1;
      matrix[indexByName[name2]][indexByName[name1]] = score2;
    });

    return { matrix, indexByName, nameByIndex };
  }, [inputData || null]);
}

function useD3Chord(cases, width = 600, height = 600) {
  const { matrix: data, nameByIndex } = useMatrix(cases);

  const [focus, setFocus] = useState(null);

  const timerId = useRef();

  useEffect(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
  }, []);

  return useMemo(() => {
    try {
      const outerRadius = Math.min(width, height) * 0.5 - 1;
      const innerRadius = outerRadius - 50;

      const chord = d3
        .chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);

      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

      const ribbon = d3.ribbon().radius(innerRadius);

      const color = d3.scaleOrdinal(d3.schemeAccent);

      const svg = d3
        .create('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .attr('font-size', 10)
        .attr('font-family', 'sans-serif');

      const chords = chord(data);

      const group = svg
        .append('g')
        .selectAll('g')
        .data(chords.groups)
        .join('g');

      group
        .append('path')
        .attr('fill', (d) => color(d.index))
        .attr('d', arc)
        .on('mouseover', (d) => {
          if (timerId.current) {
            clearTimeout(timerId.current);
          }
          setFocus(d.index);
        })
        .on('mouseout', () => {
          timerId.current = setTimeout(() => {
            setFocus(null);
          }, 350);
        });

      group
        .append('text')
        .each((d) => {
          d.angle = (d.startAngle + d.endAngle) / 2;
        })
        .attr('dy', '0em')
        .attr(
          'transform',
          (d) => `
        rotate(${(d.angle * 180) / Math.PI - 90})
        translate(${innerRadius + 24})
        ${Math.PI / 2 < d.angle && d.angle < (Math.PI / 2) * 3 ? 'rotate(-90)' : 'rotate(90)'}`,
        )
        .attr('text-anchor', (d) => (d.angle > Math.PI ? 'end' : null))
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '30px')
        .attr('font-family', 'Cute Font')
        // .attr('font-family', 'Gothic A1')
        // .attr('font-family', 'Black Han Sans A1')
        .attr('font-weight', '700')
        .attr('fill', (d) => (d3.hsl(color(d.index)).l < 0.7 ? '#fff' : '#000'))
        .text((d) => nameByIndex[d.index])
        .attr('class', 'pointer-events-none');

      const grads = svg
        .append('defs')
        .selectAll('linearGradient')
        .data(chords)
        .enter()
        .append('linearGradient')
        .attr('id', getGradientId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr(
          'x1',
          (d) =>
            innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2),
        )
        .attr(
          'y1',
          (d) =>
            innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2),
        )
        .attr(
          'x2',
          (d) =>
            innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2),
        )
        .attr(
          'y2',
          (d) =>
            innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2),
        );

      // set the starting color (at 0%)
      grads
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', (d) => color(d.source.index));

      // set the ending color (at 100%)
      grads
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', (d) => color(d.target.index));

      svg
        .append('g')
        .attr('fill-opacity', 0.67)
        .selectAll('path')
        .data(chords)
        .join('path')
        .attr('d', ribbon)
        .attr('fill-opacity', (d) => {
          if (focus === null || focus === d.source.index || focus === d.target.index) {
            return 0.67;
          }
          return 0.1;
        })
        .attr('class', (d) => `chord chord-${d.source.index} chord-${d.source.target}`)
        .style('fill', (d) => `url(#${getGradientId(d)})`);

      return svg;
    } catch (err) {
      /* ignore */
    }
    return null;
  }, [data, nameByIndex, focus, width, height]);
}

export default useD3Chord;
