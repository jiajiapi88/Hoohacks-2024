import React, { useEffect, useRef } from "react";
import audioFile from "../assets/meditation.mp3"; // Adjust the path as necessary

interface AudioPlayerProps {
	isPlaying: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying }) => {
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
		}
	}, [isPlaying]);

	return (
		<audio ref={audioRef}>
			<source src={audioFile} type="audio/mp3" />
			Your browser does not support the audio element.
		</audio>
	);
};

export default AudioPlayer;
