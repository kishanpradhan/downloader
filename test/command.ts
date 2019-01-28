import { expect } from 'chai';

import * as command from "../src/command";


describe("Parser", () => {
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

	it("parse(): check different arguments", () => {
		let args = ["", "", "download.txt", "download.txt", "--output", "/download/path", "-r", "--unrecognized"];
		let parser = new command.Parser(args);
		let res = parser.parse();

		expect(res.files.length).to.equals(2); // --unrecognized is also a file name here
		expect(res.files[0]).to.equals("download.txt");
		expect(res.output).to.equals("/download/path");
		expect(res.recursive).to.equals(true);
	});

	it("parse(): should throw Error", () => {
		let args = ["", ""];
		let parser = new command.Parser(args);
		expect(parser.parse.bind(parser)).to.throw("Pleae provide at least a file name");

		parser = new command.Parser(["file.txt", "file2.csv"]);
		expect(parser.parse.bind(parser)).to.throw("Pleae provide at least a file name");
	});
	 
});
