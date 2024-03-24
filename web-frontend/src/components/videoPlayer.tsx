import React from "react";
import videoFile from "../assets/mindwave.mp4"; // Adjust the path as necessary

const VideoPlayer: React.FC = () => {
	return (
		<video
			controls
			autoPlay
			loop
			muted
			style={{
				objectFit: "cover",
				position: "fixed",
				top: "50%", // Center vertically in the available space
				left: "50%",
				transform: "translate(-50%, -50%)", // Adjust for centering
				width: "70vw", // Example width, adjust as necessary
				height: "auto",
				zIndex: 0, // Ensure it's behind interactive elements
			}}
		>
			<source src={videoFile} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
};

export default VideoPlayer;
