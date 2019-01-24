import { expect } from 'chai';

import * as command from "../src/command";


describe("Command", () => {
	it("returns nothing", () => {
		const res = command.register();
		expect(res).to.be.undefined;
	});

	/*
	it("register command and it's options", () => {
		const com = new command.Command();
		com.register("folder <dir>")
		const res = com.parse([ "folder", "./src"]);
		expect(res).to.equals("./src");
	});
	 */
});
