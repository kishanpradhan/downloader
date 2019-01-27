import { expect } from 'chai';

import { BaseProtocol } from "../src/base";
import * as http from "../src/protocols/http";
import * as ftp from "../src/protocols/ftp";


describe("HTTP Protocol", () => {
	it("download()", (done: Function) => {
		BaseProtocol.output = process.cwd() + "/";

		const f5M: string = "http://212.183.159.230/5MB.zip";
		const f100M: string = "http://speed.hetzner.de/100MB.bin";
		const f1G: string = "https://speed.hetzner.de/1GB.bin";
		const f10G: string = "https://speed.hetzner.de/10GB.bin";
		const wrong: string = "http://sdfsfs.sdfsf.com/sdfsdflkj";

		const proto = new http.Protocol(f5M);
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

		const f100M: string = "http://speed.hetzner.de/100MB.bin";
		const f1G: string = "https://speed.hetzner.de/1GB.bin";
		const f10G: string = "https://speed.hetzner.de/10GB.bin";
		const wrong: string = "http://sdfsfs.sdfsf.com/sdfsdflkj";

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

describe("FTP Protocol", () => {
	it("download()", (done: Function) => {
		BaseProtocol.output = process.cwd() + "/";

		const f200M: string = "ftp://212.183.159.230/pub/200MB.zip";
		const f5M: string = "ftp://212.183.159.230/pub/5MB.zip";
		const wrong: string = "ftp://sdfsfs.sdfsf.com/sdfsdflkj";

		const proto = new ftp.Protocol(f5M);
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

