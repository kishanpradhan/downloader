
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

	applyColor(color: string, data: string) {
		let c: { [x:string]: string } = {
			Reset : "\x1b[0m",
			FgRed : "\x1b[31m",
			FgGreen : "\x1b[32m",
			FgYellow : "\x1b[33m",
		};

		if(!c[color]) return data;
		return c[color] + data + c["Reset"];
	}

	/**
	 * Display all data of urls file by file
	 */
	display(result: any) {
		console.log("------ Results ------");
		// console.log(result);
		let res: string = "";
		if(result.msg !== "Success") {
			res = "Error";
			if(result.error) {
				res += ": " + (result.error.message || result.error)
			}
			res = this.applyColor("FgRed", res);
		} else {
			res = this.applyColor("FgGreen", "Success");
		}

		let data: string = "";
		for(let d of result.data || []) {
			let sub_data: string = `url: ${d.url} \n\t\t`;
			if(d.msg == "Success") {
				sub_data += `res: ${this.applyColor("FgGreen", "Success")}`
			} else if(d.error) {
				sub_data += `res: ${this.applyColor("FgRed", d.error.message || d.error)}`
			} else {
				sub_data += `${this.applyColor("FgYellow", "Unknown")}`;
			}

			data += sub_data + "\n\n\t\t";
		}
		let out: string = `
\t File: ${result.path}
\t Result: ${res}
\t Data:
\t \t${data}
		`;

		console.log(out);
	}
}

