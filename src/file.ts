import * as fs from "fs";
// import * as split from "split";
import split = require("split");

import { FileContract, CommandOptionsContract } from "./contracts";
import { BaseProtocol as Protocol } from "./base";


export class File implements FileContract {
	protected options: CommandOptionsContract = {};

	constructor(private file_path: string, options: CommandOptionsContract = {}) {
		this.options = options;
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

	runFile(file_path: string) {
		return new Promise((resolve, reject) => {
			let running_urls: Promise<any>[] = [];
			fs.createReadStream(file_path)
				.pipe(split())
				.on("data", function(url: string) {
					if(!url) {
						return;
					}
					console.log("Running", url);
					running_urls.push(Protocol.run(url));
				}).on("error", function(err: Error) {
					console.log("Error reading file", err);
					reject(err);
				}).on("end", function() {
					console.log("File reading finished");
					Promise.all(running_urls).then((results: any[]) => {
						// console.log("Files", results);
						resolve(results);
					}).catch((err: Error) => {
						reject(err);
					});
				});
		});
	}

	async runDir(folder_path: string) {
		return new Promise((resolve, reject) => {
			if(folder_path[folder_path.length - 1] !== "/") {
				folder_path += "/";
			}
			fs.readdir(folder_path, (err: Error, files: string[]) => {
				if(err) {
					return reject(err);
				}
				let files_promise: Promise<any>[] = [];
				for(let file of files) {
					files_promise.push(this.runFile(folder_path + file));
				}
				Promise.all(files_promise)
					.then(res => resolve(res) )
					.catch(err => reject(err) );
			});
		});
	}

	async process() {
		return new Promise((resolve, reject) => {
			this.stats().then((stats: fs.Stats) => {
				if(stats.isFile()) {
					// console.log("File found", this.file_path);
					this.runFile(this.file_path).then(res => resolve({ path: this.file_path, msg: "Success", data: res }))
						.catch((err: Error) => { resolve({ path: this.file_path, error: err }) });
				} else if(stats.isDirectory()) {
					if(this.options.recursive) {
					// console.log("Folder found", this.file_path);
						this.runDir(this.file_path).then(res => resolve(res))
							.catch((err: Error) => {
								resolve({ path: this.file_path, error: err })
							});
					} else {
						resolve({ path: this.file_path, error: "If you want to run for folder provide -r option" });
					}
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
					// console.log("ERR", err);
					return reject(err);
				}
				let exists: boolean = false;
				let counter: number = 1;
				while(!exists) {
					exists = true;
					for(let file_name of files) {
						if(file_name == name) {
							// console.log(name, "Found, change it by appending counter and check again");
							let parts: string[] = name.split(".");
							if(parts.length > 1) {
								parts[parts.length - 2] += "(" + counter + ")";
							} else {
								parts[0] += "(" + counter + ")";
							}
							name = parts.join(".")
							counter++;
							exists = false;
							break;
						}
					}
				}
				resolve(name);
			});
		});
	}

}
