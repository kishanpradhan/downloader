


export interface DownloaderContract {
	// url: string;
	parseUrl: Function;
	download: Function;
	start: Function;
	finish: Function;
}

export interface CommandContract {
	register: Function;
}

export interface ParsingContract {
	parse: Function;
}

export interface FileContract {
	process: Function;
	getFile: Function;
}

export interface CommandResultContract {
	files: string[]; 
	output?: string;
	recursive?: boolean;
}

export interface ParsedUrlContract {
	host?: string;
	port?: string;
	uri?: string;
	name: string;
}

