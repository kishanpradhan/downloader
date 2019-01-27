import * as stream from "stream";
import * as http from "http";

import { BaseProtocol } from "../base";
import { File } from "../file";
import { ParsedUrlContract } from "../contracts";

export class Protocol extends BaseProtocol {

	async parseUrl(url: string): Promise<ParsedUrlContract> {
		let uri: string = url.split("://")[1];
		let uri_parts: string[] = uri.split("/");
		// let name: string = uri_parts[uri_parts.length - 1];
		let name: string = uri_parts.pop() as string;
		return File.getUniqueFileName(name, BaseProtocol.output)
					.then((unique_name: string) => {
						let host: string = uri_parts[0];
						let host_parts: string[] = host.split(":");
						host = host_parts[0];
						let port: string = host_parts.length > 1 ? host_parts[1] : "";
						uri = "/" + uri_parts.slice(1).join("/");
						let v: ParsedUrlContract = {
							host: host,
							port: port,
							uri: uri,
							name: unique_name
						};
						return v;
					}).catch((err: Error) => {
						console.log(err);
						throw err;
					});
	}

	download_old() {
		return new Promise(async (resolve, reject) => {
			let parsed_url: ParsedUrlContract;
			try {
				parsed_url = await this.parseUrl(this.url);
			} catch(err) {
				return reject(err);
			}

			const fs = require("fs");

			const name: string = BaseProtocol.output + parsed_url.name
			console.log("name", name);
			console.log("Calling http");
			const file = fs.createWriteStream(name, { flags: "wx" });
			// const file = new File(name).createWriteStream({ flags: "wx" });
			try {
			var request = http.get(this.url, (response: any) => {
				console.log("EE", response.headers);
				if (response.statusCode === 200) {
					response.pipe(file);
					// return resolve("DONE");
				} else {
					file.close();
					fs.unlink(name, () => {}); // Delete temp file
					console.log(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
					return reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
				}
			});

			request.on("error", (err: Error) => {
				file.close();
				fs.unlink(name, () => {}); // Delete temp file
				return reject(err.message);
			});

			file.on("finish", () => {
				resolve("DONE");
			});

			file.on("error", (err: any) => {
				file.close();

				if (err.code === "EEXIST") {
					reject("File already exists");
				} else {
					fs.unlink(name, () => {}); // Delete temp file
					reject(err.message);
				}
			});
			} catch(err) {
				console.log("EEEEE", err);
				return reject(err);
			}
			console.log("Download called");
		});
	}

	start(stream: stream.Writable): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				var request = http.get(this.url, (response: any) => {
					console.log("EE", response.headers);
					if (response.statusCode === 200) {
						response.pipe(stream);
						// return resolve("DONE");
					} else {
						console.log("Request error status code");
						stream.emit("error", {});
						console.log(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
						return reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
					}
				});

				request.on("error", (err: Error) => {
					console.log("Request error", err);
					stream.emit("error", {});
					return reject(err.message);
				});
			} catch(err) {
			}
		});
	}


	finish() {
		// Rename file if neccessary
		console.log("Finished");
	}

	error() {
		// May be use for error handling
		// Unlink file
		// Clear buffer
	}
}
