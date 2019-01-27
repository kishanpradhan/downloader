import * as stream from "stream";

import { DownloaderContract, ParsedUrlContract } from "./contracts";
import { File } from "./file";


export abstract class BaseProtocol implements DownloaderContract {
	static output: string = "./";

	constructor(protected url: string) {
	}

	abstract start(stream: stream.Writable): Promise<any>;

	/**
	 * Return unique name of the file to download
	 * It is required as we will write to file using this name
	 */
	// abstract get name(): Promise<string>;

	/**
	 * Return protocol specific data from url
	 * Must include name as it will be used to create write stream
	 */
	abstract parseUrl(url: string): Promise<ParsedUrlContract>;

	static getInstance(protocol: string, ...args: any[]): BaseProtocol | false {
		// search in multiple locations
		let protocol_locations = ["./protocols/"];
		let instance: BaseProtocol | false = false;
		for(let protocol_location of protocol_locations) {
			// console.log("loc", protocol_location, protocol);
			try {
				// Ensure protocol_location have "/" in it's end
				let protocol_module: any = require(protocol_location + protocol);
				let protocol_class: any = protocol_module["Protocol"];
				if(!protocol_class) {
					console.log(`Please define Protocol class in ${protocol_location + protocol} or export it`);
					// continue;
					break;
				}
				// console.log(protocol_class);
				console.log(args);
				instance = new protocol_class(...args);
				console.log("Found", instance);
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
		if(!instance.url) {
			console.log(`Protocol did not get any url`);
			return false;
		}
		return true;
	}

	static run(url: string):Promise<any> | false {
		const protocol: string | false = BaseProtocol.findProtocol(url);
		if(!protocol) {
			console.log("Cannot retrive protocol for url", url);
			return false;
		}
		const instance: BaseProtocol | false = BaseProtocol.getInstance(protocol as string, url);
		if(!instance) {
			console.log(`Protocol [${protocol}] not supported or not implemented properly.`);
			return false;
		}
		if(BaseProtocol.validateInstance(instance)) {
			return instance.download();
		} else {
			return false;
		}
	}

	/**
	 * Returns protocol for file download
	 * Assumption is url will be protocol://host/uri
	 */
	protected static findProtocol(url: string): string | false {
		let protocol: string | false = false;
		// let temp: string[] = url.split("://", 1)
		let temp: string[] = url.split("://")
		if(temp.length > 1) {
			protocol = temp[0];
		}
			/*
		if(!protocol && protocol === url) {
			return false;
		}
			 */
		return protocol;
	}

	download(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			let name: string = "";
			try {
				let data: any = await this.parseUrl(this.url);
				if(!data.name) {
					return reject("Parse URL is not returning a name");
				}
				name = data.name;
			} catch(err) {
				return reject(err);
			}
			// console.log("Stream name", name);
			const stream = File.createWriteStream(name, { flags: "wx" });
			stream.on("finish", () => {
				this.finish(); // either use this or stream.on finish
				resolve("DONE");
			});

			stream.on("error", (err: any) => {
				console.log(err);
				stream.close();

				if (err.code === "EEXIST") { // If our unique file name fails, we should not remove old downloaded file
					reject("File already exists");
				} else {
					File.unlink(name, () => {});
					reject(err.message);
				}
			});

			this.start(stream).then((res: any) => {
				this.finish(); // either use this or stream.on finish
				resolve(res);
			}).catch((err: Error) => {
				console.log("Error", err);
				return reject(err);
			});
			console.log("Download called");
		});
	}

	finish() {
		console.log("not implemented");
	}

	static parseUrl(url: string) {

		return {
			protocol: "",
			username: "",
			password: "",
			host: "",
			port: "",
			uri: "",
		}
	}
}
