
import * as command from "./src/command";
import { File } from "./src/file";
import { BaseProtocol } from "./src/base";
import { CommandResultContract } from "./src/contracts";


export class Downloader {
	constructor(protected options: any = {}) {
	}

	private escapeOutput(out: string) {
		if(out && out[out.length - 1] !== "/") {
			out += "/";
		}
		return out;
	}

	start(args: string[] = process.argv) {
		let command_result: CommandResultContract = new command.Parser(args).parse();
		if(command_result.output) { // Write test case for this also
			BaseProtocol.output = this.escapeOutput(command_result.output);
		}
		let all_files: Promise<any>[] = [];
		let options = Object.assign({}, command_result);
		delete options.files;
		command_result.files.forEach((file_path: string) => {
			all_files.push(new File(file_path, options).process());
		});
		return Promise.all(all_files).then((results: any[]) => {
			for(let i in results) {
				this.display(results[i]);
			}
			return results;
		}).catch((err: Error) => {
			console.log("Downloader Error", err);
		});
	}

	/**
	 * Display all data of urls file by file
	 */
	display(result: any) {
		console.log("Results of download");
		console.log(result);
	}
}

