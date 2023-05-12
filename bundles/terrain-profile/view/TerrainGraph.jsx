import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ThemeConsumer } from 'oskari-ui/util';

const processData = (data) => {
    const points = data.properties.distanceFromStart.map(function (d, i) {
        return { distance: d, height: data.geometry.coordinates[i][2], coords: data.geometry.coordinates[i] };
    });
    return [points];
};

const createGraph = (ref, data, markerHandler, theme) => {
    const graphMargin = { top: 25, bottom: 30, left: 45, right: 30 };
    const graphHeight = 300;
    const graphWidth = 600;
    const numberFormatter = Oskari.getNumberFormatter(1);
    let processed;

    const svg = d3.select(ref)
        .append('svg')
        .attr('height', graphHeight)
        .attr('width', graphWidth)
        .classed('terrainprofile-graphwrapper', true);

    // Set up scales & axes
    const x = d3.scaleLinear()
        .range([graphMargin.left, graphWidth - graphMargin.right]);

    const y = d3.scaleLinear()
        .range([graphHeight - graphMargin.bottom, graphMargin.top]);

    const area = d3.area()
        .defined(function (d) { return d.height !== null; })
        .x(function (d) {
            return x(d.distance);
        })
        .y1(function (d) {
            return y(d.height);
        });

    const xAxis = d3.axisBottom(x)
        .tickSizeOuter(0)
        .ticks(5)
        .tickFormat(function (d) {
            if (d > 1000) {
                return Oskari.getMsg('TerrainProfile', 'legendValue', { value: d / 1000 }) + ' km';
            } else {
                return Oskari.getMsg('TerrainProfile', 'legendValue', { value: d }) + ' m';
            }
        });
    const yAxis = d3.axisLeft(y)
        .tickSizeOuter(0)
        .ticks(4)
        .tickSizeInner(-graphWidth + graphMargin.right + graphMargin.left)
        .tickFormat((d) => { return Oskari.getMsg('TerrainProfile', 'legendValue', { value: d }) + ' m'; });


    const updateGraph = (data) => {
        if (data) {
            processed = processData(data);
            x.domain([0, d3.max(processed[0], function (d) { return d.distance; })]);
            recalculateYDomain(processed);
            resetScalingButton.style('display', 'none');
        }
        area.y0(y(0));

        const paths = pathContainer
            .selectAll('path')
            .data(processed);

        paths.enter().append('path')
            .attr('fill', theme?.color?.accent || '#ebb819')
            .merge(paths)
            .attr('d', area);

        paths.exit().remove();

        xAxisContainer.call(xAxis);
        yAxisContainer.call(yAxis);
    };

    // Set up container groups (for draw ordering)
    const pathContainer = svg.append('g');

    svg.append('rect') // mask above graph
        .attr('fill', '#fafafa')
        .attr('x', 0)
        .attr('y', -10)
        .attr('width', graphWidth)
        .attr('height', graphMargin.top + 10);

    const cursor = svg.append('g');

    svg.append('rect') // mask below graph
        .attr('fill', '#fafafa')
        .attr('x', 0)
        .attr('y', graphHeight - graphMargin.bottom)
        .attr('width', graphWidth)
        .attr('height', graphMargin.bottom + 10);

    const xAxisContainer = svg.append('g')
        .attr('transform', 'translate(0 ' + (graphHeight - graphMargin.bottom) + ')');
    const yAxisContainer = svg.append('g')
        .classed('y-axis', true)
        .attr('transform', 'translate(' + (graphMargin.left) + ' 0)');

    // Set up Y-axis scaling

    const resetScalingButton = svg.append('g').classed('reset-scaling', true);
    resetScalingButton.append('path')
        .attr('d', 'M -7 -1 L 7 -1 L 0 -7 Z');
    resetScalingButton.append('path')
        .attr('d', 'M -7 2 L 7 2 L 0 8 Z');
    resetScalingButton.append('path')
        .classed('touch-area', true)
        .attr('d', 'M -15 -15 L 15 -15 L 15 15 L -15 15 Z')
        .on('click', function () {
            recalculateYDomain();
            updateGraph();
            resetScalingButton.style('display', 'none');
        });
    resetScalingButton
        .attr('transform', 'translate(' + graphMargin.left / 2 + ' ' + graphMargin.top / 2 + ')');
    resetScalingButton.style('display', 'none');
    resetScalingButton.append('title')
        .text(Oskari.getMsg('TerrainProfile', 'resetGraph'));

    const brushed = (event) => {
        const selection = event.selection;
        if (!selection) {
            return;
        }
        const start = y.invert(selection[1]);
        const end = y.invert(selection[0]);
        brushGroup.call(brush.move, null);
        y.domain([start, end]);
        resetScalingButton.style('display', null);
        updateGraph();
    }

    const brush = d3.brushY()
        .extent([[graphMargin.left, graphMargin.top], [graphWidth - graphMargin.right, graphHeight - graphMargin.bottom]])
        .on('end', brushed);

    const brushGroup = svg.append('g')
        .classed('axis-brush', true)
        .call(brush);
        
    // Setup hover cursor
    cursor
        .attr('class', 'cursor')
        .style('display', 'none');

    cursor.append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', graphMargin.top)
        .attr('y2', graphHeight - graphMargin.bottom);

    const focus = cursor.append('g');

    focus.append('circle')
        .attr('r', 5);

    focus.append('text')
        .attr('y', -16)
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em');


    const mousemove = (e) => {
        const x0 = x.invert(d3.pointer(e)[0]);
        const i = bisectX(processed[0], x0, 1);
        const d0 = processed[0][i - 1];
        const d1 = processed[0][i];
        const d = x0 - d0.distance > d1.distance - x0 ? d1 : d0;
        if (d.height < y.domain()[0]) { // below minimum
            cursor.style('display', 'none');
        } else {
            cursor.style('display', null);
        }
        cursor.attr('transform', 'translate(' + x(d.distance) + ' 0)');
        cursor.select('line').attr('y1', y(d.height));
        focus.attr('transform', 'translate(0 ' + y(d.height) + ')');
        let text;
        if (d.height !== null) {
            text = numberFormatter.format(d.height);
        } else {
            text = Oskari.getMsg('TerrainProfile', 'noValue');
        }
        cursor.select('text').text(text);
        // replace no-break space
        markerHandler.showAt(d.coords[0], d.coords[1], text.replace(/\u00A0/, ' '));
    }

    brushGroup.select('.overlay') // reuse brush overlay element
        .on('mouseover', function () {
            cursor.style('display', null);
        })
        .on('mouseout', function () {
            cursor.style('display', 'none');
            markerHandler.hide();
        })
        .on('mousemove', mousemove);

    const bisectX = d3.bisector(function (d) { return d.distance; }).left;

    const recalculateYDomain = () => {
        const extent = d3.extent(processed[0], function (d) { return d.height; });
        if (extent[0] > 0) {
            extent[0] = 0;
        }
        y.domain(extent);
    }
    updateGraph(data);
};

export const TerrainGraph = ThemeConsumer(({ theme, data, markerHandler }) => {
    const ref = useRef(null);

    useEffect(() => {
        createGraph(ref.current, data, markerHandler, theme);
    }, [data]);

    return (
        <div
            ref={ref}
            className='terrainprofile-graph'
        />
    );
});
