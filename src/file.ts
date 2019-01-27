import * as fs from "fs";
// import * as split from "split";
import split = require("split");

import { FileContract } from "./contracts";
import { BaseProtocol as Protocol } from "./base";


export class File implements FileContract {
	constructor(private file_path: string, options: any = {}) {
		// this.parseOptions(options);
	}

	protected stats(): Promise<fs.Stats> {
		return new Promise((resolve, reject) => {
			fs.stat(this.file_path, (err: Error, f_stats: fs.Stats) => {
				if(err) return reject(err);
				return resolve(f_stats);
			});
		});
	}

	runFile() {
		return new Promise((resolve, reject) => {
			let running_urls: Promise<any>[] = [];
			fs.createReadStream(this.file_path)
				.pipe(split())
				.on("data", function(url: string) {
					if(!url) {
						// console.log("Got to the last element");
						return;
					}
					console.log("Running", url);
					running_urls.push(Protocol.run(url));
				}).on("error", function(err: Error) {
					console.log("Error reading file", err);
					// Do anything neccessary
				}).on("end", function() {
					console.log("File reading finished");
					Promise.all(running_urls).then((results: any[]) => {
						// console.log("Files", results);
						resolve(results);
					}).catch((err: Error) => {
						resolve(err);
					});
				});
		});
	}

	async runDir() {
		// Read from dir and call runFile
		return [];
	}

	async process() {
		return new Promise((resolve, reject) => {
			this.stats().then((stats: fs.Stats) => {
				if(stats.isFile()) {
					console.log("File found", this.file_path);
					this.runFile().then(res => resolve({ path: this.file_path, msg: "Success", data: res }))
						.catch((err: Error) => { resolve({ path: this.file_path, error: err }) });
				} else if(stats.isDirectory()) {
					// if -r option is provided, recusively find files and process it.
					console.log("Folder found", this.file_path);
					this.runDir().then(res => resolve(res))
						.catch((err: Error) => {
							resolve({ path: this.file_path, error: err })
						});
				} else {
					console.log("Something is not right.");
					resolve({ path: this.file_path, error: this.file_path + " is neither file nor directory."});
				}
			}).catch((err: Error) => {
				resolve({
					path: this.file_path,
					error: err
				});
			});
		});
	}

	static createWriteStream(name: string, options: any) {
		return fs.createWriteStream(name, options);
	}

	static unlink(name: string, callback: (err: Error) => void) {
		return fs.unlink(name, callback);
	}

	static rename(old_name: string, new_name: string, callback: (err: Error) => void) {
		return fs.rename(old_name, new_name, callback);
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
							// console.log(name, "Found, change it by appending counter and check again");
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
