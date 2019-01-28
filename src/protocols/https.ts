import * as stream from "stream";
import * as https from "https";

import { BaseProtocol } from "../base";
import { File } from "../file";
import { ParsedUrlContract } from "../contracts";

export class Protocol extends BaseProtocol {
	protected should_rename: boolean = false;
	protected rename_to: string | undefined;

	/*
	createWritableStream(path: string) {
	}
	 */

	parseResponse(response: any) {
		let contentDisposition: string | undefined = response.headers['content-disposition'];
		let match = contentDisposition && contentDisposition.match(/(filename=|filename\*='')(.*)$/);
		let file_name = match && match[2];
		if(file_name && file_name !== this.name) {
			this.should_rename = true;
			this.rename_to = file_name;
		}
	}

	start(stream: stream.Writable): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				var request = https.get(this.url, (response: any) => {
					this.parseResponse(response);
					// console.log("EE", response.headers);
					if (response.statusCode === 200) {
						response.pipe(stream);
					} else {
						// console.log(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
						return reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
					}
				});

				request.on("error", (err: Error) => {
					// console.log("Request error", err);
					return reject(err);
				});
			} catch(err) {
				return reject(err)
			}
		});
	}


	/**
	 * Need to write test case for this
	 */
		/*
	finish() {
		// console.log("Finished and rename if neccesary");
		if(this.should_rename && this.name && this.rename_to) {
			let folder: string = path.dirname(this.name);
			File.getUniqueFileName(this.rename_to, folder)
				.then((name: string) => {
					File.rename(this.name, folder + "/" + this.rename_to, () => {});
				}).catch(() => {});
		}
	}
		 */
}

