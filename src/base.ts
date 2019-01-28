import * as stream from "stream";
import * as path from "path";
import * as crypto from "crypto";
import { URL } from "url";

import { DownloaderContract, ParsedUrlContract } from "./contracts";
import { File } from "./file";


export abstract class BaseProtocol implements DownloaderContract {
	static output: string = "./";
	static protocol_locations: string[] = ["./protocols"];
	protected name: string | undefined;

	constructor(protected url: string, protected parsed_url: ParsedUrlContract) {
		// this.temp_name = this.getTempUniqueName();
	}

	abstract start(stream: stream.Writable): Promise<any>;

	/**
	 * Return protocol specific data from url
	 * Must include name as it will be used to create write stream
	 */
	// abstract parseUrl(url: string): Promise<ParsedUrlContract>;

	static parseUrl(url: string): ParsedUrlContract | false {
		try {
			let u: URL = new URL(url);
			return {
				protocol:  u.protocol.slice(0, u.protocol.length - 1),
				host: u.host,
				hostname: u.hostname,
				port: parseInt(u.port),
				uri: u.pathname,
				user: u.username,
				password: u.password
			}
		} catch(err) {
			// console.log(err);
			return false;
		}
	}

	static getInstance(protocol: string, ...args: any[]): BaseProtocol | false {
		let user_defined_locations: string | undefined = process.env["DOWNLODER_PROTOCOL"];
		let protocol_locations = BaseProtocol.protocol_locations;
		if(user_defined_locations) {
			let parts: string[] = user_defined_locations.split(",");
			protocol_locations = parts.concat(protocol_locations);
		}
		let instance: BaseProtocol | false = false;
		for(let protocol_location of protocol_locations) {
			if(protocol_location[protocol_location.length - 1] !== "/") {
				protocol_location += "/";
			}
			// console.log("searching in loc", protocol_location + protocol);
			try {
				let protocol_module: any = require(protocol_location + protocol);
				let protocol_class: any = protocol_module["Protocol"];
				if(!protocol_class) {
					console.log(`Please define Protocol class in ${protocol_location + protocol} or export it`);
					// continue;
					break;
				}
				instance = new protocol_class(...args);
				break;
			} catch(err) {
				// console.log(err);
			}
		}
		return instance;
	}

	static validateInstance(instance: BaseProtocol) {
		if(!(instance.download && (typeof instance.download === "function"))) {
			// console.log(`Protocol [${protocol}] does not have download method`);
			console.log(`Protocol does not have download method`);
			return false;
		}

		if(!(instance.start && (typeof instance.start === "function"))) {
			console.log(`Protocol does not have start method`);
			return false;
		}
		if(!instance.url) {
			console.log(`Protocol does not have any url`);
			return false;
		}
		return true;
	}

	static async run(url: string):Promise<any> {
		const parsed_url: ParsedUrlContract | false = BaseProtocol.parseUrl(url);
		if(!parsed_url) {
			// console.log("Cannot parsed url", url);
			return { url: url, error: "Could not parsed url" };
		}
		const instance: BaseProtocol | false = BaseProtocol.getInstance(parsed_url.protocol, url, parsed_url);
		if(!instance) {
			let msg: string = `Protocol [${parsed_url.protocol}] not supported or not implemented properly.`;
			return { url: url, error: msg };
		}
		if(BaseProtocol.validateInstance(instance)) {
			return instance.download();
		} else {
			return { url: url, error: "Instance validation failed"};
		}
	}

	async getName(parsed_url: ParsedUrlContract) {
		// let name_parts: string[] = parsed_url.uri.split("/");
		// let name: string = name_parts[name_parts.length - 1];
		let name: string = path.basename(parsed_url.uri);
		try {
			name = await File.getUniqueFileName(name, BaseProtocol.output);
			return BaseProtocol.output + name;
		} catch(err) {
			console.log(err);
			throw err;
		}
	}

	protected createWriteStream(name: string) {
		return File.createWriteStream(name, { flags: "wx" });
	}

	download(counter: number = 0): Promise<any> {
		return new Promise(async (resolve, reject) => {
			// let name: string = this.name || this.temp_name;
			let name: string = "";
			try {
				name = await this.getName(this.parsed_url);
			} catch(err) {
				return resolve({ url: this.url, err: err.message || err });
			}
			this.name = name;
			// console.log("Stream name", name);
			const stream = this.createWriteStream(name);
			stream.on("finish", () => {
				console.log("DONE");
				this.finish(); // either use this or stream.on finish
				return resolve({ url: this.url, msg: "Success" });
			});

			stream.on("error", (err: any) => {
				console.log("Stream error", err);

				if (err.code === "EEXIST") { // If our unique file name fails, we should not remove old downloaded file
					if(counter < 5) {
						counter += 1;
						console.log("Recursive calling for different name", counter);
						setTimeout(() => {
							this.download(counter); // Profile this for huge number of files. This may lead to memory leak if lots of url have the same last uri. Fix: Use setTimeout(f, 100)
						}, 100);
					} else {
						resolve({ url: this.url, error: new Error("File already exists") });
					}
				} else {
					removeUnfinishedThings();
					resolve({ url: this.url, error: err.message || new Error(err) });
				}
			});

			function removeUnfinishedThings() {
				stream.close();
				File.unlink(name, () => {});
			}

			this.start(stream).then((res: any) => {
				// This is applicable when request is finished, not stream wrtting finished. So do not resolve from here.
				// console.log("Start finished");
				// resolve({ url: this.url, msg: "Success", data: res });
			}).catch((err: Error) => {
				// console.log("Protocol Error", err);
				removeUnfinishedThings();
				return resolve({ url: this.url, error: err });
			});
		});
	}

	finish() {
		// console.log("not implemented");
	}

}
