import { useRef, useEffect, useState } from "react";
import { ScatterPlotProps } from "./types";
import bot from "../../assets/bot.svg";
import * as d3 from "d3";
import { buttonBlueBorders } from "./constants";

export function ScatterPlot(props: ScatterPlotProps) {
	const { shape, point } = props;
	if (!shape?.coordinates.length) return <></>;

	const { coordinates, convex, maxX, maxY, minX, minY } = shape;

	const svgRef = useRef<SVGSVGElement | null>(null);
	/* Button to hide scatter plot */
	const [isShow, setShow] = useState(false);
	// prepare data, add 1 more point so it is connected - perform only when convex
	useEffect(() => {
		const data = convex
			? [...coordinates, coordinates[0]]
			: [...coordinates];

		const svg = d3.select(svgRef.current);
		// Data for the chart

		// Define the dimensions of the plot
		const width = 300;
		const height = 300;
		const margin = { top: 20, right: 20, bottom: 20, left: 20 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		// Define the scales for x and y axes
		const xScale = d3
			.scaleLinear()
			.domain([minX, maxX])
			.range([0, innerWidth]);
		const yScale = d3
			.scaleLinear()
			.domain([minY, maxY])
			.range([innerHeight, 0]);

		// Add x-axis
		svg.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(xScale));
		// Add y-axis
		svg.append("g")
			.attr("transform", `translate(${width}, 0)`)
			.call(d3.axisLeft(yScale));

		// Convert data array to the required format
		const lineData = data.map((d) => [d.x, d.y]) as [number, number][];

		// Connect lines only when it is convex
		if (convex) {
			// Create a line generator
			const lineGenerator = d3
				.line()
				.x((d) => xScale(d[0]))
				.y((d) => yScale(d[1]));

			// Add the line connecting the data points
			svg.append("path")
				.attr("fill", "none")
				.attr("stroke", "white")
				.attr("stroke-width", 2)
				.attr("d", lineGenerator(lineData));
		}

		// Add data points as circles
		svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", (d) => xScale(d.x))
			.attr("cy", (d) => yScale(d.y))
			.attr("r", 4)
			.attr("fill", "white");

		// Additional points after convex is plotted as red
		if (convex && point) {
			// Add hardcoded point [0, 0]
			svg.append("circle")
				.attr("cx", xScale(point.x))
				.attr("cy", yScale(point.y))
				.attr("r", 4)
				.attr("fill", "red");
		}
	}, [coordinates, isShow]);

	const renderSVG = () =>
		isShow ? (
			<svg
				ref={svgRef}
				id="scatterplot"
				className="scatterplot"
				width={400}
				height={400}></svg>
		) : (
			<></>
		);

	return (
		<>
			<button
				onClick={(e) => {
					setShow((state) => !state);
					e.currentTarget.blur();
				}}
				id="hideButton"
				style={!isShow ? buttonBlueBorders : {}}>
				<img src={bot} alt="send" />
			</button>
			{renderSVG()}
		</>
	);
}
