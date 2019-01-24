#!/usr/bin/env node

import * as command from "./src/command";
import { File } from "./src/file";
import { BaseProtocol } from "./src/base";
import { CommandResultContract } from "./src/contracts";


export class Downloader {
	constructor() {
	}

	start(args: string[] = process.argv) {
		let command_result: CommandResultContract = new command.Parser(args).parse();
		if(command_result.output) { // Write test case for this also
			BaseProtocol.output = command_result.output;
		}
		command_result.files.forEach((file_path: string) => {
			new File(file_path).process();
		});
	}
}

new Downloader().start(process.argv);
