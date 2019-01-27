import { Writable, Readable } from "stream";
import { URL } from "url";
import * as ftp from "ftp";

import { BaseProtocol } from "../base";
import { File } from "../file";
import { ParsedUrlContract } from "../contracts";

export class Protocol extends BaseProtocol {

	updateCredsIfRequired() {
		this.parsed_url.user = this.parsed_url.user || "anonymous";
		this.parsed_url.password = this.parsed_url.password || "anonymous";
		this.parsed_url.port = this.parsed_url.port || 21;
	}

	download() {
		this.updateCredsIfRequired();
		return super.download();
	}

	start(stream_writable: Writable): Promise<any> {
		return new Promise(async (resolve, reject) => {
			var c = new ftp();
			c.on('ready', () => {
				c.get(this.parsed_url.uri, function(err, stream) {
					if (err) {
						c.end();
						// stream_writable.emit("error", err);
						return reject(err);
					}
					stream.once('close', function() { c.end(); });
					stream.pipe(stream_writable);
				});
			});

			c.on("error", (err: Error) => {
				console.log("Error on FTP ", err);
				try {
					c.destroy();
				} catch(err) {
					console.log("handled error while ftp closing", err);
				}
				// stream_writable.emit("error", err);
				return reject(err);
			});
			// This is not neccessary
			process.on("unhandledRejection", (err: Error) => {
				console.log("Unhandled", err);
			});

			c.connect({
				host: this.parsed_url.host,
				port: this.parsed_url.port,
				user: this.parsed_url.user,
				password: this.parsed_url.password
			});
		});
	}
}
