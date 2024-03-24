import React, { useState } from "react";
import { Box, Button, Input, SimpleGrid } from "@chakra-ui/react";

interface OptionsInputProps {
	options: string[];
	onOptionSelect: (option: string) => void;
}

const OptionsInput: React.FC<OptionsInputProps> = ({
	options,
	onOptionSelect,
}) => {
	const [customInput, setCustomInput] = useState("");

	const handleOptionClick = (option: string) => {
		onOptionSelect(option);
	};

	const handleCustomInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCustomInput(event.target.value);
	};

	// const submitCustomInput = () => {
	// 	onOptionSelect(customInput);
	// };

	return (
		<Box>
			<SimpleGrid columns={2} spacingX="30px" spacingY="20px">
				{options.map((option) => (
					<Button key={option} onClick={() => handleOptionClick(option)}>
						{option}
					</Button>
				))}
			</SimpleGrid>
			{/* <Input
				placeholder="Or type here..."
				value={customInput}
				onChange={handleCustomInput}
				mt={4}
			/> */}
			{/* <Button onClick={submitCustomInput} mt={2}>
				Submit
			</Button> */}
		</Box>
	);
};

export default OptionsInput;
