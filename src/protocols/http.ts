import * as stream from "stream";
import * as http from "http";

import { BaseProtocol } from "../base";
import { File } from "../file";
import { ParsedUrlContract } from "../contracts";

export class Protocol extends BaseProtocol {

	start(stream: stream.Writable): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				var request = http.get(this.url, (response: any) => {
					// console.log("EE", response.headers);
					if (response.statusCode === 200) {
						response.pipe(stream);
					} else {
						// stream.emit("error", {});
						// console.log(`HTTP Server responded with ${response.statusCode}: ${response.statusMessage}`);
						return reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
					}
				});

				request.on("error", (err: Error) => {
					// console.log("Request error", err);
					// stream.emit("error", {});
					return reject(err);
				});
			} catch(err) {
				return reject(err)
			}
		});
	}


	finish() {
		// Rename file if neccessary
		// console.log("Finished HTTP");
	}

	error() {
		// May be use for error handling
		// Unlink file
		// Clear buffer
	}
}
