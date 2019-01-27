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
			console.log("Finished download", data);
			done();
		}).catch((err: Error) => {
			done(err);
		});
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
			console.log("Finished download", data);
			done();
		}).catch((err: Error) => {
			done(err);
		});
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
			console.log("Finished download", data);
			done();
		}).catch((err: Error) => {
			done(err);
		});
	});

	/*
	it("parseUrl()", (done: Function) => {
		const f5M: string = "ftp://212.183.159.230/pub/5MB.zip";
		const fsmall: string = "ftp://demo:password@test.rebex.net:21/readme.txt";
		let cases: any[] = [
			["ftp://demo:password@test.rebex.net:21/readme.txt", { host: "test.rebex.net", port: "21", user: "demo", password: "password", uri: "/readme.txt" }],
			["ftp://demo:password@test.rebex.net/readme.txt", { host: "test.rebex.net", port: "21", user: "demo", password: "password", uri: "/readme.txt" }],
			["ftp://demo:password@test.rebex.net:8990/path/readme.txt", { host: "test.rebex.net", port: "8990", user: "demo", password: "password", uri: "/path/readme.txt" }],
		];

		const proto = new ftp.Protocol(fsmall);
		let promises: Promise<any>[] = [];
		for(let i in cases) {
			let res = proto.parseUrl(cases[i][0]);
			expect(res instanceof Promise).to.equals(true);
			promises.push(res);
		}
		Promise.all(promises).then((results: any[]) => {
			for(let i in results) {
				// console.log("i", i, cases[i][1], results[i]);
				for(let key in cases[i][1]) {
					expect(results[i][key]).to.equals(cases[i][1][key]);
				}
			}
			done();
		}).catch(err => done(err));
	});
	 */
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

