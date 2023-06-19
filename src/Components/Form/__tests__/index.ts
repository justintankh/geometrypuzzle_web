import { describe, expect, it } from "@jest/globals";
import { validateInput } from "../utils";

describe("Form", () => {
	it.each([
		["Valid", ["^-?\\d+\\s-?\\d+"], "1 2", true],
		["Valid", ["^-?\\d+\\s-?\\d+"], "1 1", true],
		["Valid", ["^-?\\d+\\s-?\\d+"], "11", false],
		["Invalid", ["^-?\\d+\\s-?\\d+"], "b", false],
	])("(Coords) Validate input: %s", (_, regex, input, expected) =>
		expect(validateInput(regex, input)).toBe(expected)
	);

	it.each([
		["Valid", ["^[12]$"], "1", true],
		["Valid", ["^[12]$"], "2", true],
		["Invalid", ["^[12]$"], "11", false],
		["Invalid", ["^[12]$"], "b", false],
	])("(Menu) Validate input: %s", (_, regex, input, expected) =>
		expect(validateInput(regex, input)).toBe(expected)
	);

	it.each([
		["Valid", ["^-?\\d+\\s-?\\d+", "^#$"], "1 1", true],
		["Valid", ["^-?\\d+\\s-?\\d+", "^#$"], "2 2", true],
		["Valid", ["^-?\\d+\\s-?\\d+", "^#$"], "#", true],
		["Invalid", ["^-?\\d+\\s-?\\d+", "^#$"], "11", false],
		["Invalid", ["^-?\\d+\\s-?\\d+", "^#$"], " ", false],
		["Invalid", ["^-?\\d+\\s-?\\d+", "^#$"], "b", false],
	])(
		"(Test coords) Validate input: %s",
		(_, regex, input, expected) =>
			expect(validateInput(regex, input)).toBe(expected)
	);
});
