interface OptionsType {
	wishTypeOptions: string[];
	specificWishOptions: {
		[key: string]: string[]; // Index signature
	};
}

const OPTIONS: OptionsType = {
	wishTypeOptions: ["Career", "Health", "Study", "Relationship"],
	specificWishOptions: {
		Career: [
			"I want to meet new professionals in my field.",
			"I aim to learn a new skill relevant to my job.",
			"I plan to work towards a promotion.",
			"I wish to improve my work-life balance.",
		],
		Health: [
			"I want to get up early",
			"I want to lose some weight",
			"I want my skin to look better",
			"I want to sleep early",
		],
		Study: [
			"I want to study for two hours daily.",
			"I aim to improve my GPA next semester.",
			"I plan to start learning a new language.",
			"I wish to complete a certification course.",
		],
		Relationship: [
			"I want to spend more time with family.",
			"I aim to make new friends this year.",
			"I plan to improve communication in my relationships.",
			"I wish to show more appreciation to my friends.",
		],
	},
};
export default OPTIONS;
