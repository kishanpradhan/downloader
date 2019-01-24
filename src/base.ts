
import { DownloaderContract } from "./contracts";


export abstract class BaseProtocol implements DownloaderContract {

	constructor(private url: string) {
	}

	abstract download(): Promise<any>;
	abstract urlParser(): Object;
}
