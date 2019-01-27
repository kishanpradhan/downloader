


export interface DownloaderContract {
	// url: string;
	// parseUrl: Function;
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
	// process(): Promise<{ path: string, error?: Error, msg?: string, data?: any }>;
	process(): Promise<any>;
	runFile(): Promise<any>;
	runDir: Function;
}

export interface CommandResultContract {
	files: string[]; 
	output?: string;
	recursive?: boolean;
}

export interface ParsedUrlContract {
	host?: string;
	port?: number;
	uri: string;
	// name: string;
	protocol: string;
	user?: string;
	password?: string;
}

