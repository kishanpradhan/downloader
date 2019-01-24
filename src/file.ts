import * as fs from "fs";
// import * as split from "split";
const split = require("split");

import { FileContract } from "./contracts";
import { BaseProtocol as Protocol } from "./base";


export class File implements FileContract {
	constructor(private file_path: string) {
	}

	process() {
		fs.stat(this.file_path, (err: Error, stats: fs.Stats) => {
			if(err) {
				console.log(this.file_path, err);
				return;
			}
			if(stats.isFile()) {
				console.log("File found", this.file_path);
				fs.createReadStream(this.file_path)
					.pipe(split())
					.on("data", function(line: string) {
						if(!line) {
							console.log("Got to the last element");
							return;
						}
						// console.log("E", typeof line);
						// var chunk = line.toString();
						console.log(line);
						Protocol.run(line);
					}).on("error", function(err: Error) {
						console.log("Error reading file", err);
						// Do anything neccessary
					}).on("end", function() {
						console.log("File reading finished");
					});
			} else if(stats.isDirectory()) {
				// if -r option is provided, recusively find files and process it.
				console.log("Folder found", this.file_path);
			} else {
				console.log("Something is not right.");
			}
		});
		/*
		this.getFile().then((file: any) => {
			console.log("Processing file");
		}).catch((err: Error) => {
			console.log("File not found", e);
		});
		 */
	}

	getFile(flags: string = "r") {
		return new Promise((resolve, reject) => {
			fs.readFile(this.file_path, flags, (err: Error, fd: any) => {
			});
		});
	}
}
