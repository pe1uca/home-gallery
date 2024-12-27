import * as React from "react";
import { calculateBestRatioFilter, Layout } from "./Layout";

export const DoubleVLayoutComponent = ((props) => {

	if (!props.entries) {
		return <></>;
	}

	return (
		<>
		<div className="w-screen h-screen flex">
			<div className="flex-1">
			<img className="relative object-contain h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src={props.entries[0]} />
			</div>
			<div className="flex-1">
			<img className="relative object-contain h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src={props.entries[1]} />
			</div>
		</div>
		</>
	)
})

export const DoubleVLayout: Layout = {
	name: 'DoubleVLayout',
	entriesCount: 2,
	metadata: {name: 'DoubleVLayout', entriesCount: 2},
	filter: calculateBestRatioFilter(window.innerWidth/2, window.innerHeight),
	component: DoubleVLayoutComponent
}