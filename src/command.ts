import * as commander from "commander";
import { CommandContract } from "./contracts";


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

export function register() {
	if(!registered) {
	console.log("Registering commands");
		commander
			.version("1.0.0")
		// .command('file <dir>')
			.option('-r, --recursive <val>', 'Remove recursively')
			/*
			.action(function (dir, cmd) {
				console.log("Called");
			})
			 */
		// commander.parse(["", "", "-r", "./src"]);
		commander.parse(["", "", "../download.txt"]);
		console.log(commander);
		registered = true;
	}
}
