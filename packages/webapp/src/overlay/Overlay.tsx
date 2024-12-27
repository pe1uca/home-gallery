import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from "react";
import { useEntryStore } from "../store/entry-store";
import { usePreviewSize } from "../single/usePreviewSize";
import { getHigherPreviewUrl } from '../utils/preview';
import { SingleLayout } from "./SingleLayout";
import { DoubleVLayout } from "./DoubleVLayout";
import { runQueryOnEntries } from "../init/useSearchFilter";
import { QuadGridLayout } from "./QuadGridLayout";

const SlideShow = ({closeCb}) => {
	const divRef = useRef<HTMLDivElement>(null);
	const entriesPool = useEntryStore(state => state.entries);
	const slideTimeout = 60 * 1000; // TODO: move to a configuration
	const previewSize = usePreviewSize();
	const layoutHistory = useRef<any[]>([]);
	const [currentLayout, setCurrentLayout] = useState<any>(null);
	const [nextLayout, setNextLayout] = useState<any>(null);
	const [isFading, setIsFading] = useState(false);
	const [nextIdx, setNextIdx] = useState(0);

	const selectRandomEntry = (entries: any[]) => {
		return entries[Math.floor(Math.random() * entries.length)];
	}
	const getEntriesFiltered = async (entries, query) => {
		const entriesFiltered = await runQueryOnEntries(entries, query);

		return entriesFiltered.length <= 0 ? entries : entriesFiltered;
	}

	const getLayoutComponent = (name: string, entries: any[]) => {
		switch (name) {
			case SingleLayout.name:
				return <SingleLayout.component entries={entries} />;
			case DoubleVLayout.name:
				return <DoubleVLayout.component entries={entries} />;
			case QuadGridLayout.name:
				return <QuadGridLayout.component entries={entries} />;
		
			default:
				break;
		}
	}

	const selectNewLayout = async (idx: number) => {
		const layouts = [
			SingleLayout,
			DoubleVLayout,
			QuadGridLayout,
		];

		const history = layoutHistory.current;
		if (idx >= 0 && idx < history.length) {
			const layoutFromHistory = history[idx];
			const newLayoutComponent = getLayoutComponent(layoutFromHistory.component, layoutFromHistory.entries);
			setNextLayout(newLayoutComponent);
			return Math.min(idx + 1, layoutHistory.current.length);
		}

		const nextLayout = layouts[Math.floor(Math.random() * layouts.length)];
		const newLayoutData: any = {
			component: nextLayout.name,
			entries: []
		};

		// TODO: Allow other types of media? (would need to change the layouts to process them)
		const filter = `type:image and ${nextLayout.filter}`;
		// TODO: cache response? Probably it will only change based on screen size
		let query: any = {type:'query', query:filter};
		let entriesFiltered = await getEntriesFiltered(entriesPool, query);
		
		// First entry is selected at random
		const pivotEntry = selectRandomEntry(entriesFiltered);
		newLayoutData.entries.push(getHigherPreviewUrl(pivotEntry.previews, previewSize));
		// Check if layout needs more entries
		if (nextLayout.entriesCount > 1) {
			// Next entries will be selected based on similarity
			query = {type:'similar', value:pivotEntry.shortId};
			entriesFiltered = await getEntriesFiltered(entriesFiltered, query);
			// Narrow it even further to just the top similar ones
			const frontEntries = entriesFiltered.slice(0, Math.ceil(entriesFiltered.length * 0.1));
			entriesFiltered = frontEntries.length <= nextLayout.entriesCount ? entriesFiltered : frontEntries;
			for (let index = 1; index < nextLayout.entriesCount; index++) {
				const entry = selectRandomEntry(entriesFiltered);
				newLayoutData.entries.push(getHigherPreviewUrl(entry.previews, previewSize));
			}
		}

		const newLayoutComponent = getLayoutComponent(nextLayout.name, newLayoutData.entries);

		layoutHistory.current.push(newLayoutData);
		setNextLayout(newLayoutComponent);
		return layoutHistory.current.length;
	}

	const nextSlide = async () => {
		setNextIdx(await selectNewLayout(nextIdx));
	}

	const transitionEnd = async () => {
		setCurrentLayout(nextLayout);
		setIsFading(false);
		nextSlide();
	}

	const createTimeout = () => {
		return setTimeout(() => {
			setIsFading(true);
		}, slideTimeout)
	}

	const onDivClick = (event) => {
		event.preventDefault();
		setIsFading(true);
	}

	const divDoubleClick = (event) => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}

	useEffect(() => {
		if (divRef.current === null) {
			return;
		}
		divRef.current.focus();
	}, [divRef.current]);

	useEffect(() => {
		nextSlide();
		setIsFading(true);
	}, []);

	useEffect(() => {
		if (isFading) return;

		const timer = createTimeout();

		return () => {
			clearTimeout(timer);
		};
	}, [isFading]);

	const divKeyUp = async (event) => {
		switch (event.key) {
			case 'Escape':
				closeCb();
				break;
			case 'ArrowLeft':
				setNextIdx(await selectNewLayout(Math.max(nextIdx - 3, 0)));
				setIsFading(true);
				break;
			case ' ':
			case 'ArrowRight':
				setNextIdx(await selectNewLayout(Math.min(nextIdx - 1, layoutHistory.current.length)));
				setIsFading(true);
				break;
		
			default:
				break;
		}
	}

	return (
		<div ref={divRef} className={`fixed top-0 z-50 bg-black h-full w-full`} tabIndex={0} onKeyUp={divKeyUp} onClick={onDivClick} onDoubleClick={divDoubleClick}>
			<div className={`absolute top-0 h-full w-full z-50 ${isFading ? 'toFadeOut fadeOut' : 'opacity-1'}`} onTransitionEnd={transitionEnd}>
				{currentLayout}
			</div>
			<div className={`absolute top-0 h-full w-full z-40 ${isFading ? 'toFadeIn fadeIn' : 'opacity-0'}`}>
				{nextLayout}
			</div>
			<div className={`absolute top-0 h-full w-full z-40 ${isFading ? 'hidden' : ''}`}>
				{currentLayout}
			</div>
		</div>
	)
}

export const Fab = () => {
	const [slideShowActive, setslideShowActive] = useState(false)

	const toogleSlideShow = () => {
		setslideShowActive(!slideShowActive)
	}
	return (
		<>
		{slideShowActive ? <SlideShow closeCb={toogleSlideShow}/> : null}
		<div className="bg-black h-16 w-16 rounded-full p-0.5 fixed bottom-5 right-5 flex items-center justify-center cursor-pointer">
			<div
				onClick={toogleSlideShow}
				className={`rounded-full w-full h-full flex items-center justify-center`}
			>
				<FontAwesomeIcon icon={icons.faTv} className="text-gray-300"/>
			</div>
		</div>
		</>
	)
}