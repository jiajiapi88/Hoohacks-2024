import React, {
	useState,
	useRef,
	useEffect,
	ChangeEvent,
	KeyboardEvent,
} from "react";
import {
	Box,
	Input,
	Button,
	VStack,
	Flex,
	Text,
	Heading,
	InputGroup,
	InputLeftElement,
	IconButton,
} from "@chakra-ui/react";
import OptionsInput from "../components/optionsInput";
import Avatar from "../assets/avatar.png";
import meditationRoom from "../assets/meditation-room.png";
import OPTIONS from "../components/wishOptions";
import { MdOutlineFileUpload } from "react-icons/md"; // Assuming you're using react-icons
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface Message {
	id: string;
	text: string;
	sender: "user" | "bot";
}

const questions: string[] = [
	"How do you want to be addressed?",
	"What type of wishes do you want to achieve right now?",
	"Do you have a specific wish?",
	"Anything else you want to add? Feel free to type below or upload a file so we can better help you in achieving your wish.",
];

interface Responses {
	username: string;
	wishType: string;
	specificWish: string;
	additionalInfo: string;
}

const ChatBot: React.FC = () => {
	const [step, setStep] = useState<number>(0);
	const [inputValue, setInputValue] = useState<string>("");
	const [responses, setResponses] = useState<Responses>({
		username: "",
		wishType: "",
		specificWish: "",
		additionalInfo: "",
	});
	const navigate = useNavigate(); // Use useNavigate to get the navigate function

	const [messages, setMessages] = useState<Message[]>([]);

	const endOfMessagesRef = useRef<null | HTMLDivElement>(null);
	const initialQuestionSentRef = useRef<boolean>(false);
	const [showMeditationButton, setShowMeditationButton] =
		useState<boolean>(false);

	useEffect(() => {
		if (!initialQuestionSentRef.current) {
			sendMessage("How do you want to be addressed?", "bot");
			initialQuestionSentRef.current = true;
		}
	}, []);

	useEffect(() => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = async (message: string, sender: "user" | "bot") => {
		// Use a combination of timestamp and a random value for a unique ID
		console.log("message", message, "step", step, "sender", sender);
		const newMessage = {
			id: `${Date.now()}-${Math.random()}`,
			text: message,
			sender,
		};

		setMessages((prevMessages) => [...prevMessages, newMessage]);

		if (sender === "user") {
			handleUserResponse(message);
			try {
				const response = await fetch("http://localhost:8000/joke/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: message, sender }),
				});
				console.log("response", response);
				console.log("message", message);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const responseData = await response.json();
				// Send the bot's response message
				sendMessage(responseData.text, "bot");
			} catch (error) {
				console.error("There was a problem with your fetch operation:", error);
			}
		}
	};

	const handleUserResponse = (message: string) => {
		const nextStep = step + 1;
		const keyMapping = [
			"username",
			"wishType",
			"specificWish",
			"additionalInfo",
		];
		const key = keyMapping[step];

		setResponses((prev) => ({ ...prev, [key]: message }));

		if (nextStep < questions.length) {
			console.log("nextStep", nextStep);
			sendMessage(questions[nextStep], "bot");
			setStep(nextStep);
		} else {
			// All questions answered
			prepareAndSendData(message);
		}
		console.log("step", step);

		setInputValue("");
	};

	const prepareAndSendData = (lastMessage: string) => {
		// Construct the final data object, ensuring the last message is included
		const finalData = {
			...responses,
			additionalInfo: lastMessage, // Use the directly passed last message
		};
		console.log("Data to send:", finalData);
		setShowMeditationButton(true);

		// Integration with the backend API, using finalData
	};

	const handleSendMessage = () => {
		if (inputValue.trim()) {
			sendMessage(inputValue, "user");
		}
	};

	const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const onKeyPressInput = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSendMessage();
		}
	};
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];

			// Construct a message indicating the file name
			const fileUploadMessage = `File uploaded: ${file.name}`;

			// Add this message to the messages state as an outgoing user message
			sendMessage(fileUploadMessage, "user");

			// Reset the input after handling the file
			event.target.value = "";
		}
	};

	return (
		<Box
			// pt="80px"
			width="100vw"
			height={"100vh"}
			display="flex"
			justifyContent="center"
			alignItems="center"
			bgImage={meditationRoom}
			bgPos="center"
		>
			<Box
				borderWidth="1px"
				borderRadius="lg"
				overflow="hidden"
				width="80%"
				position="relative"
				bg="rgba(0, 0, 0, 0.15)"
				// mt="30px"
			>
				<Flex
					bg="rgba(0, 0, 0, 0.15)"
					color="white"
					p={4}
					justify="center"
					alignItems="center"
				>
					<Heading size="md">Meditation Room</Heading>
				</Flex>
				<VStack spacing={4} h="50vh" overflowY="auto" p={4}>
					{messages.map((message) => (
						<Flex
							key={message.id}
							alignSelf={message.sender === "user" ? "flex-end" : "flex-start"}
							bg={message.sender === "user" ? "orange.200" : "orange.50"}
							borderRadius="lg"
							p={2}
							align={"center"}
						>
							{message.sender === "bot" && (
								<Flex marginRight="2" align={"center"}>
									<img
										src={Avatar}
										alt="Chatbot Avatar"
										style={{
											width: "50px",
											height: "auto",
											borderRadius: "50%",
										}}
									/>
								</Flex>
							)}
							<Text fontSize="md">{message.text}</Text>
						</Flex>
					))}
					{/* Conditionally render OptionsInput based on the step */}
					{(step === 1 || step === 2) && (
						<OptionsInput
							options={
								step === 1
									? OPTIONS.wishTypeOptions
									: OPTIONS.specificWishOptions[responses.wishType] ?? []
							}
							onOptionSelect={(option) => {
								sendMessage(option, "user"); // This will also need to correctly handle advancing the step or adjusting the chat flow as needed
							}}
						/>
					)}
					{showMeditationButton && (
						<Flex justifyContent="center" mt="4">
							<Button
								color="#FFF"
								variant={"outline"}
								size="lg"
								onClick={() => navigate("/meditation")}
								_hover={{ bg: "#F6AD55", color: "#FFF" }}
								borderWidth={2}
							>
								Start Meditation
							</Button>
						</Flex>
					)}
					<div ref={endOfMessagesRef} />
				</VStack>
				<Flex p={4} position="sticky" bottom="0" bg="rgba(0, 0, 0, 0.15)">
					<InputGroup>
						<InputLeftElement
							children={
								<IconButton
									aria-label="Upload file"
									icon={<MdOutlineFileUpload />}
									onClick={() =>
										document.getElementById("file-upload")?.click()
									}
								/>
							}
						/>
						<Input
							id="file-upload"
							type="file"
							onChange={handleFileChange}
							hidden
						/>
						<Input
							placeholder="Type your message..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
							mr={2}
							bg="rgba(255, 240, 245, 0.8)" // Lighter pastel pink for input background
							color="rgba(0, 0, 0, 0.85)" // Dark text for readability
						/>
					</InputGroup>
					<Button
						// variant="transparent"
						onClick={handleSendMessage}
						bg="#FAAF83" // Pastel orange with transparency for button background
						color="#FFF" // Dark text for readability
						_hover={{
							bg: "#E19D75", // Darker shade of orange on hover for better interaction feedback
						}}
					>
						Send
					</Button>
				</Flex>
			</Box>
		</Box>
	);
};

export default ChatBot;
