import { FC, memo, useRef, useState } from "react";
import { DEFAULT_COLORS, GRID_HEIGHT, GRID_WIDTH } from "./constants";

const getRandomUInt = () => {
	return Math.floor(Math.random() * DEFAULT_COLORS.length);
};

const BLOCK_NUMBERS = Array(GRID_WIDTH * GRID_HEIGHT)
	.fill(null)
	.map(() => getRandomUInt());

const getCharacters = (idx: number) => {
	const idxAdj = idx * GRID_WIDTH;
	const idxStart = idxAdj % BLOCK_NUMBERS.length;
	const idxEnd = (idxAdj + GRID_WIDTH) % BLOCK_NUMBERS.length;

	return idxEnd < idxStart
		? [...BLOCK_NUMBERS.slice(idxStart), ...BLOCK_NUMBERS.slice(0, idxEnd)]
		: BLOCK_NUMBERS.slice(idxStart, idxEnd);
};

interface StreamWriterProps {
	writableStream: WritableStream;
}

export const StreamWriter: FC<StreamWriterProps> = ({ writableStream }) => {
	const data = useRef(0);
	const [rafId, setRafId] = useState<NodeJS.Timeout>();

	function appendAndScheduleNext() {
		const writer = writableStream.getWriter();
		writer.write(getCharacters(data.current));
		data.current = data.current + 1;
		writer.releaseLock();

		setRafId(
			setTimeout(() => {
				appendAndScheduleNext();
			}, 200),
		);
	}

	function handleStartTimer() {
		appendAndScheduleNext();
	}
	function handleStopTimer() {
		if (rafId) {
			clearTimeout(rafId);
			setRafId(undefined);
		}
	}

	return (
		<div className="flex flex-row gap justify-around">
			{!rafId ? (
				<button type="button" className="ghost-rect" onClick={handleStartTimer}>
					Start Streaming
				</button>
			) : (
				<button type="button" className="ghost-rect" onClick={handleStopTimer}>
					Stop Streaming
				</button>
			)}
		</div>
	);
};

export const MemoStreamWriter = memo(StreamWriter);
