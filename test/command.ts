import { expect } from 'chai';

import * as command from "../src/command";


describe("Command", () => {
	/*
	it("returns nothing", () => {
	});

	it("register command and it's options", () => {
		const com = new command.Command();
		com.register("folder <dir>")
		const res = com.parse([ "folder", "./src"]);
		expect(res).to.equals("./src");
	});
	 */
});

describe("Parse", () => {
	it("parse(): parse arguments and returns a list of files and folders", () => {
		let args = ["", "", "download.txt"];
		const parser = new command.Parser(args);
		const res = parser.parse();
		expect(res.files.length).to.equals(1);
		expect(res.files[0]).to.equals("download.txt");
	});

	it("parse(): check uniqueness of returned list", () => {
		let args = ["", "", "download.txt", "download.txt"];
		let parser = new command.Parser(args);
		let res = parser.parse();
		expect(res.files.length).to.equals(1);
		expect(res.files[0]).to.equals("download.txt");

		args = ["", "", "download.txt", "download.txt", "different_file.txt"];
		parser = new command.Parser(args);
		res = parser.parse();
		expect(res.files.length).to.equals(2);
		expect(res.files[0]).to.equals("download.txt");
		expect(res.files[1]).to.equals("different_file.txt");
	});

	/*
	it("should throw Error", () => {
		let args = ["", ""];
		const parser = new command.Parser(args);
		const res = parser.parse();
		expect(res instanceof Error).to.equals(true);
	});
	 */
});
