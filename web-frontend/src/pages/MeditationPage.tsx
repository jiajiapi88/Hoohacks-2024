import React from "react";
import { Box, IconButton, useBoolean, Center } from "@chakra-ui/react";
import { FaPlay, FaPause } from "react-icons/fa";
import AudioPlayer from "../components/audioPlayer";
import VideoPlayer from "../components/videoPlayer";
import backgroundImage from "../assets/meditation-room.png"; // Adjust the path as necessary

const MeditationPage: React.FC = () => {
	const [isPlaying, setIsPlaying] = useBoolean(false);

	const togglePlay = () => {
		// Toggle play state for audio. Implement play/pause functionality in AudioPlayer.
		setIsPlaying.toggle();
	};

	return (
		<Box
			position="relative"
			minHeight="100vh"
			bgImage={`url(${backgroundImage})`}
			bgSize="cover"
			bgPosition="center"
		>
			<VideoPlayer />
			<Center
				position="fixed"
				top="0"
				left="0"
				right="0"
				zIndex="1"
				height="200px"
				justifyContent="center"
				alignContent={"center"}
			>
				<IconButton
					aria-label={isPlaying ? "Pause audio" : "Play audio"}
					icon={isPlaying ? <FaPause /> : <FaPlay />}
					onClick={() => setIsPlaying.toggle()}
					size="lg"
					isRound={true}
				/>
			</Center>
			<AudioPlayer isPlaying={isPlaying} />
		</Box>
	);
};

export default MeditationPage;
