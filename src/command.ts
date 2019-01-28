import { CommandContract, ParsingContract, CommandResultContract } from "./contracts";


export class Parser implements ParsingContract {

	constructor(private args: string[]) {
		this.args = args || [];
		this.args = this.args.slice(2);// As first 2 parameters are node and file name
	}

	parse(): CommandResultContract {
		if(this.args.length <= 0) {
			throw new Error("Pleae provide at least a file name");
		}

		let files: Set<string> = new Set();
		let command_result: CommandResultContract = { files: [] };
		for(let i = 0; i < this.args.length; i++) {
			let name: string = this.args[i];
			switch(name) {
				case "--output": 
					let out: string = this.args[++i];
					if(out == "-r") {
						i -= 1;
						out = "./";
					}
					command_result["output"] = out;
					// console.log("out", out);
					break;
				case "-r":
					command_result["recursive"] = true;
					break;
				default:
					files.add(name);
					break;
			}
		}
		command_result.files = Array.from(files);
		return command_result;
	}

}

