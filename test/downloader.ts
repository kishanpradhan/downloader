import * as fs from "fs";
import { expect } from 'chai';

import { Downloader } from "../index";


describe("Downloader", () => {
	it("start()", (done: Function) => {
		const d = new Downloader();
		let downloaders: Promise<any>[] = [];
		// const res = d.start([ "", "", "./test/assets/download.txt", "--output", "./test/downloads", "-r"]);
		downloaders.push(
			d.start([ "", "", "./test/assets/dm", "--output", "./test/downloads", "-r"])
		);
		downloaders.push(
			d.start([ "", "", "./test/assets/dm", "--output", "./test/downloads" ])
		);

		/*
		downloaders.push(
			d.start([ "", "", "tt.txt", "--output", "./test/downloads" ])
		);
		 */

		Promise.all(downloaders).then((results: any[]) => {
			// console.log(results);
			// expect(results[0][0]).to.have.property("error", "If you want to run for folder provide -r option");
			expect(results[1][0]).to.have.property("error", "If you want to run for folder provide -r option");
			done();
		}).catch((err: Error) => {
			done(err);
		});
	});

	after(() => {
		// clean up downloads
		fs.readdir("./test/downloads", (err: Error, files: string[]) => {
			for(let file of files) {
				if(file.startsWith("5MB")) {
					console.log("5MB", file);
					fs.unlink("./test/downloads/" + file, () => {});
				}
				if(file.startsWith("file")) {
					console.log("file", file);
					fs.unlink("./test/downloads/" + file, () => {});
				}
				console.log(file);
			}
		});
	});
});
