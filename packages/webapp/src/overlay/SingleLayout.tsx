import * as React from "react";
import { calculateBestRatioFilter, Layout } from "./Layout";

export const SingleLayoutComponent = ((props) => {

	if (!props.entries) {
		return <></>;
	}

	return (
		<>
		<img className="absolute object-contain w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src={props.entries[0]} />
		</>
	)
})

export const SingleLayout: Layout = {
	name: 'SingleLayout',
	entriesCount: 1,
	metadata: {name: 'SingleLayout', entriesCount: 1},
	filter: calculateBestRatioFilter(window.innerWidth, window.innerHeight),
	component: SingleLayoutComponent
}