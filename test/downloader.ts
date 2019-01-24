import { expect } from 'chai';

import { Downloader } from "../index";


describe("Downloader", () => {
	it("start()", () => {
		const d = new Downloader();
		const res = d.start([ "", "", "download.txt", "./src"]);
		expect(res).to.be.undefined;
	});
});
