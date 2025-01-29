import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import { RootState } from "../store/store";

const aggregateSalesByMonth = (salesData: any[]) => {
  // Step 1: Parse weekEnding dates into Date objects
  const parsedSales = salesData.map((d) => ({
    ...d,
    weekEnding: new Date(d.weekEnding),
  }));

  // Step 2: Sort by weekEnding to ensure chronological order
  parsedSales.sort((a, b) => a.weekEnding.getTime() - b.weekEnding.getTime());

  // Step 3: Remove any sales data before 2017 to ensure no phantom 2016 months
  const filteredSales = parsedSales.filter(
    (d) => d.weekEnding.getFullYear() >= 2017
  );

  // Step 4: Aggregate by month
  const monthlyData = new Map();

  filteredSales.forEach((d) => {
    const yearMonth = d3.timeFormat("%Y-%m")(d.weekEnding); // Format as YYYY-MM
    if (!monthlyData.has(yearMonth)) {
      monthlyData.set(yearMonth, { retailSales: 0, wholesaleSales: 0 });
    }

    monthlyData.get(yearMonth).retailSales += d.retailSales;
    monthlyData.get(yearMonth).wholesaleSales += d.wholesaleSales;
  });

  // Step 5: Convert to an array and explicitly set the day to 1
  const allMonths = Array.from(monthlyData, ([month, sales]) => {
    const date = new Date(`${month}-01`); // Ensure it's always the first of the month

    return {
      month: date,
      retailSales: sales.retailSales,
      wholesaleSales: sales.wholesaleSales,
    };
  }).sort((a, b) => a.month.getTime() - b.month.getTime());

  return allMonths;
};

const Graph: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const product = useSelector((state: RootState) => state.product.items[0]);

  useEffect(() => {
    if (!chartRef.current || !product || !product.sales) return;

    const containerWidth = chartRef.current.parentElement?.offsetWidth || 800;
    const containerHeight = 400;

    const data = aggregateSalesByMonth(product.sales);

    const margin = { top: 20, right: 30, bottom: 50, left: 80 };

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => d.month)!,
        d3.timeMonth.offset(d3.max(data, (d) => d.month)!, 1),
      ])
      .range([margin.left, containerWidth - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => Math.max(d.retailSales, d.wholesaleSales)) || 0,
      ])
      .nice()
      .range([containerHeight - margin.bottom, margin.top]);

    const lineRetail = d3
      .line<any>()
      .x((d) => xScale(d.month)!)
      .y((d) => yScale(d.retailSales)!)
      .curve(d3.curveMonotoneX);

    const lineWholesale = d3
      .line<any>()
      .x((d) => xScale(d.month)!)
      .y((d) => yScale(d.wholesaleSales)!)
      .curve(d3.curveMonotoneX);

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`); // Responsive sizing

    // Retail Sales Line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#5daeff")
      .attr("stroke-width", 4)
      .attr("d", lineRetail);

    // Wholesale Sales Line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#b0b0b0")
      .attr("stroke-width", 4)
      .attr("d", lineWholesale);

    // X-Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${containerHeight - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((d) =>
            d3
              .timeFormat("%b")(d as Date)
              .toUpperCase()
          )
          .tickSize(0)
      )
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "gray");

    svg.selectAll(".domain").remove();
  }, [product]);

  return <svg ref={chartRef} className="w-full h-auto"></svg>;
};

export default Graph;
