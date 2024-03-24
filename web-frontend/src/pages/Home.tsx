import React from "react";
import {
	Box,
	Flex,
	Text,
	Button,
	useColorModeValue,
	Spacer,
	Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import homebg from "../assets/home-background.png";

function Home() {
	const navigate = useNavigate();
	const bg = useColorModeValue("gray.50", "gray.800"); // Change as per your color scheme
	const color = useColorModeValue("black", "white");

	const redirectToChatbot = () => {
		navigate("/meditationroom");
	};

	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			px="80px"
			h="100vh"
			// bg={bg}
			bgImage={homebg} // Set the background image
			bgPos="center" // Background position
			bgSize="cover" // Background size
		>
			<Box>
				<Text
					fontFamily="Gentium Book Basic"
					fontSize="3xl"
					color="white"
					textAlign="center"
				>
					Good morning.
				</Text>
				<Text
					fontFamily="Gentium Book Basic"
					fontSize="3xl"
					color="white"
					textAlign="center"
				>
					"Your calm mind is the ultimate weapon against your challenges."
				</Text>

				<Spacer h="30px" />
			</Box>
			<Box textAlign="center">
				<Button
					fontFamily={"Gentium Book Basic"}
					color="#FFF"
					borderColor={"#FFF"}
					_hover={{ bg: "#FEE1CF", color: "#FFF" }}
					size="lg"
					onClick={redirectToChatbot}
					variant="outline"
					fontSize={"2xl"}
					borderWidth={2}
				>
					Start Meditation
				</Button>
			</Box>
		</Flex>
	);
}

export default Home;
