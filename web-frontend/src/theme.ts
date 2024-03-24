// src/theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	fonts: {
		heading: `'Gentium Book Basic', serif`, // Used for headings
		body: `'Gentium Book Basic', serif`, // Used for body text
	},
});

export default theme;
