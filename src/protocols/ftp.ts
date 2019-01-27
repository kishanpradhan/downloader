import * as stream from "stream";
import * as ftp from "ftp";

import { BaseProtocol } from "../base";
import { File } from "../file";
import { ParsedUrlContract } from "../contracts";

export class Protocol extends BaseProtocol {

	async parseUrl(url: string): Promise<ParsedUrlContract> {
		let uri: string = url.split("://")[1];
		let uri_parts: string[] = uri.split("/");
		// let name: string = uri_parts[uri_parts.length - 1];
		let name: string = uri_parts.pop() as string;
		try {
			name = await File.getUniqueFileName(name, BaseProtocol.output);
		} catch(err) {
			console.log(err);
			throw err;
		}
		let host: string = uri_parts[0];
		let host_parts: string[] = host.split(":");
		host = host_parts[0];
		let port: string = host_parts.length > 1 ? host_parts[1] : "";
		uri = "/" + uri_parts.slice(1).join("/");
		return {
			host: host,
			port: port,
			uri: uri,
			name: name
		}
	}

	download() {
		return new Promise(async (resolve, reject) => {
		});
	}

	start(stream: stream.Writable): Promise<any> {
		return new Promise((resolve, reject) => {
		});
	}
}
