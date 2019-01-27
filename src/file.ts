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
					.on("data", function(url: string) {
						if(!url) {
							console.log("Got to the last element");
							return;
						}
						// console.log("E", typeof url);
						// var chunk = url.toString();
						console.log(url);
						Protocol.run(url);
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

	static createWriteStream(name: string, options: any) {
		return fs.createWriteStream(name, options);
	}

	static unlink(name: string, callback: (err: Error) => void) {
		return fs.unlink(name, callback);
	}

	static getUniqueFileName(name: string, folder: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.readdir(folder, (err: Error, files: string[]) => {
				if(err) {
					console.log("ERR", err);
					return reject(err);
				}
				let exists: boolean = false;
				let counter: number = 1;
				while(!exists) {
					exists = true;
					// files.includes(name);
					for(let file_name of files) {
						if(file_name == name) {
							console.log(name, "Found, change it by appending counter and check again");
							let parts: string[] = name.split(".");
							// let part: string = "";
							if(parts.length > 1) {
								// part = parts[parts.length - 2];
								parts[parts.length - 2] += "(" + counter + ")";
							} else {
								// part = parts[0];
								parts[0] += "(" + counter + ")";
							}
							// part += "(" + counter + ")";
							name = parts.join(".")
							console.log(name);
							// name = name + counter;
							counter++;
							exists = false;
							break;
						}
					}
						/*
					files.forEach(file => {
						// console.log("file", file);
						if(file === name) {
							console.log("Found, change  it by appending 1 and check again");
							name = name + counter;
							counter++;
							exists = true;
						}
					});
						 */
				}
				resolve(name);
			});
		});
	}

}
