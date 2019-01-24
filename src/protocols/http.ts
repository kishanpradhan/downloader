
import { BaseProtocol } from "../base";

export class Protocol extends BaseProtocol {

	constructor(url: string) {
		super(url);
		console.log(url);
	}

	urlParser() {
		return {};
	}

	async download() {
		console.log("Download called");
	}
}
