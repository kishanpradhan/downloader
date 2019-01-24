


export interface DownloaderContract {
	// url: string;
	urlParser: Function;
	download: Function;
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

