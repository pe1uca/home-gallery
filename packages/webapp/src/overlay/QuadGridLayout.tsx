import * as React from "react";
import { calculateBestRatioFilter, Layout } from "./Layout";

export const QuadGridLayoutComponent = ((props) => {

	if (!props.entries) {
		return <></>;
	}

	return (
		<>
		<div className="w-screen h-screen columns-3">
			<div className="flex h-1/2">
				<div className="flex-1">
				<img className="relative object-contain h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src={props.entries[0]} />
				</div>
				<div className="flex-1">
				<img className="relative object-contain h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src={props.entries[1]} />
				</div>
			</div>

			<div className="flex h-1/2">
				<div className="flex-1">
				<img className="relative object-contain h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src={props.entries[2]} />
				</div>
				<div className="flex-1">
				<img className="relative object-contain h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src={props.entries[3]} />
				</div>
			</div>
		</div>
		</>
	)
})

export const QuadGridLayout: Layout = {
	name: 'QuadGridLayout',
	entriesCount: 4,
	metadata: {name: 'QuadGridLayout', entriesCount: 2},
	filter: calculateBestRatioFilter(window.innerWidth, window.innerHeight),
	component: QuadGridLayoutComponent
}