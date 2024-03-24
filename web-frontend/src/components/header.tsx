// Header.tsx
import React from "react";
import myLogo from "../assets/logo.svg";
import {
	Flex,
	Text,
	Image,
	Box,
	Button,
	useColorModeValue,
	Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();
	const color = useColorModeValue("black", "white");

	const redirectToSignUp = () => navigate("/signup");
	const redirectToLogIn = () => navigate("/login");

	const redirectToAboutUs = () => navigate("/about-us");
	const redirectToHome = () => navigate("/");

	return (
		<Flex
			w="full"
			h="90px"
			px={8}
			py={4}
			justifyContent="space-between"
			alignItems="center"
			bgGradient="linear(to-r, #FED7D7, #FBD38D)"
			position="fixed"
		>
			<Box
				width="300px"
				height="auto"
				onClick={redirectToHome}
				cursor="pointer"
			>
				<Image
					src={myLogo}
					alt="My Logo"
					// objectFit="contain"
					width="100%"
					height="100%"
					style={{ maxWidth: "100%", height: "auto" }}
					onClick={redirectToHome}
				/>
			</Box>

			<Spacer />
			<Flex alignItems="center">
				<Text
					mr={4}
					cursor="pointer"
					onClick={redirectToAboutUs}
					color="#FC7454"
					fontSize={"lg"}
					fontWeight={"semibold"}
				>
					About Us
				</Text>
				<Button
					color="#FC7454"
					variant="outline"
					borderColor={"#FC7454"}
					// onClick={redirectToSignUpLogin}
				>
					Sign Up / Log In
				</Button>
			</Flex>
			{/* <Button
				colorScheme="orange"
				variant="outline"
				mr={2}
				onClick={redirectToSignUp}
			>
				Sign Up
			</Button>
			<Button colorScheme="orange" variant="solid" onClick={redirectToLogIn}>
				Log In
			</Button> */}
		</Flex>
	);
};

export default Header;
