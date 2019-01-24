import * as commander from "commander";
import { CommandContract, ParsingContract, CommandResultContract } from "./contracts";


let registered: boolean = false;

export class Command implements CommandContract {

	register(command_name: string, options: Array<[string]> = []) {
		commander.command(command_name);
		options.forEach((...args: any[]) => {
			console.log(args);
		})
		console.log(command_name, options);
	}

	parse(args: string[]) {
		commander.parse(args);
		console.log(commander);
		return commander.folder;
	}
}

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
					command_result["output"] = out;
					// console.log("out", out);
					break;
				case "-r":
					console.log("Got here r");
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

