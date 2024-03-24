import React from "react";
import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header"; // Ensure this path is correct
import "./App.css";
// Import your components here
import Home from "./pages/Home";
import ChatBot from "./pages/ChatBot";
import AboutUs from "./pages/AboutUs";
import MeditationPage from "./pages/MeditationPage"; // Adjust the import path as necessary

function App() {
	return (
		<ChakraProvider theme={theme}>
			<Router>
				<Box minH="100vh" minW="100vw">
					<Header /> {/* This will make the header appear on every page */}
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/meditationroom" element={<ChatBot />} />
						<Route path="/about-us" element={<AboutUs />} />
						<Route path="/meditation" element={<MeditationPage />} />
					</Routes>
				</Box>
			</Router>
		</ChakraProvider>
	);
}

export default App;
