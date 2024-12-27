export interface Layout {
	name: string,
	entriesCount: number,
	metadata: any,
	filter: string,
	component: (props: any) => React.JSX.Element
}

export const calculateBestRatioFilter = (width: number, height: number) => {
	const ratio = width / height;
	if (ratio > 1.2) {
		return `ratio > 1`;
	}
	else if(ratio < 0.8) {
		return `ratio < 1`;
	}
	else {
		return `ratio in [0.7:1.3]`;
	}
}