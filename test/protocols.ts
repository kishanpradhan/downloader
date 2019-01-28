import * as fs from "fs";
import { expect } from 'chai';

import { BaseProtocol } from "../src/base";
import * as http from "../src/protocols/http";
import * as https from "../src/protocols/https";
import * as ftp from "../src/protocols/ftp";


describe("HTTP Protocol", () => {
	it("download()", (done: Function) => {
		BaseProtocol.output = process.cwd() + "/";

		const f5M: string = "http://212.183.159.230/5MB.zip";
		const f100M: string = "http://speed.hetzner.de/100MB.bin";
		const f1G: string = "http://speed.hetzner.de/1GB.bin";
		const f10G: string = "http://speed.hetzner.de/10GB.bin";
		const wrong: string = "http://sdfsfs.sdfsf.com/sdfsdflkj";

		let u: string = f5M;
		const proto = new http.Protocol(u, BaseProtocol.parseUrl(u) as any);
		const res = proto.download();
		expect(res instanceof Promise).to.equals(true);
		res.then((data: any) => {
			fs.stat("5MB.zip", (err: Error, stat: fs.Stats) => {
				if(err) return done(err);
				if(stat.size > 5000000) {// 5MB size is 5000000 bytes
					return done();
				} 
				done(new Error("Not downloaded fully."));
			});
		}).catch((err: Error) => {
			done(err);
		});
	});

	after(() => {
		fs.unlink("5MB.zip", () => {});
	});
});

describe("HTTPS Protocol", () => {
	it("download()", (done: Function) => {
		BaseProtocol.output = process.cwd() + "/";

		const f100M: string = "https://speed.hetzner.de/100MB.bin";
		const f1G: string = "https://speed.hetzner.de/1GB.bin";
		const f10G: string = "https://speed.hetzner.de/10GB.bin";
		const wrong: string = "https://sdfsfs.sdfsf.com/sdfsdflkj";

		let u: string = f100M;
		const proto = new https.Protocol(u, BaseProtocol.parseUrl(u) as any);
		const res = proto.download();
		expect(res instanceof Promise).to.equals(true);
		res.then((data: any) => {
			fs.stat("100MB.bin", (err: Error, stat: fs.Stats) => {
				if(err) return done(err);
				if(stat.size > 100000000) {// 100MB size is 100000000 bytes
					return done();
				} 
				done(new Error("Not downloaded fully."));
			});
		}).catch((err: Error) => {
			done(err);
		});
	});

	after(() => {
		fs.unlink("100MB.bin", () => {});
	});
});

describe("FTP Protocol", () => {
	it("download()", (done: Function) => {
		BaseProtocol.output = process.cwd() + "/";

		const f200M: string = "ftp://212.183.159.230/pub/200MB.zip";
		const f5M: string = "ftp://212.183.159.230/pub/5MB.zip";
		const fsmall: string = "ftp://demo:password@test.rebex.net/readme.txt";

		let u: string = fsmall;
		const proto = new ftp.Protocol(u, BaseProtocol.parseUrl(u) as any);
		const res = proto.download();
		expect(res instanceof Promise).to.equals(true);
		res.then((data: any) => {
			fs.stat("readme.txt", (err: Error, stat: fs.Stats) => {
				if(err) return done(err);
				if(stat.size > 400) { // readme.txt size is 403
					return done();
				} 
				done(new Error("Not downloaded fully."));
			});
		}).catch((err: Error) => {
			done(err);
		});
	});

	after(() => {
		fs.unlink("readme.txt", () => {});
	});
});

/*
describe("FTPS Protocol", () => {
	it("download()", (done: Function) => {
		BaseProtocol.output = process.cwd() + "/";

		const f100M: string = "ftp://speed.hetzner.de/100MB.bin";
		const f1G: string = "ftp://speed.hetzner.de/1GB.bin";
		const f10G: string = "ftp://speed.hetzner.de/10GB.bin";
		const wrong: string = "ftp://sdfsfs.sdfsf.com/sdfsdflkj";

		const proto = new http.Protocol(f100M);
		const res = proto.download();
		expect(res instanceof Promise).to.equals(true);
		res.then((data: any) => {
			console.log("Finished download", data);
			done();
		}).catch((err: Error) => {
			done(err);
		});
	});
});
 */

