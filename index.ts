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
		let all_files: Promise<any>[] = [];
		command_result.files.forEach((file_path: string) => {
			all_files.push(new File(file_path).process());
		});
		Promise.all(all_files).then((results: any[]) => {
			for(let i in results) {
				this.display(results[i]);
			}
		}).catch((err: Error) => {
			console.log("Downloader Error", err);
		});
	}

	/**
	 * Display all data of urls file by file
	 */
	display(result: any) {
		console.log(result);
	}
}

new Downloader().start(process.argv);
