import * as fs from "fs";
import { expect } from 'chai';

import { BaseProtocol } from "../src/base";
import * as http from "../src/protocols/http";
import * as https from "../src/protocols/https";
import * as ftp from "../src/protocols/ftp";


describe("BaseProtocol", () => {
	it("parseUrl()", () => {
		let tests: any[] = [
			["", false],
			["https://google.com/path/to/resource", { protocol: "https", host: "google.com", port: NaN, user: "", password: "", uri: "/path/to/resource" }],
			["http://blog.tech.google.com:81/path", { protocol: "http", host: "blog.tech.google.com:81", hostname: "blog.tech.google.com", port: 81, user: "", password: "", uri: "/path" }],
			["ftp://demo:password@test.rebex.net:21/readme.txt", { protocol: "ftp", host: "test.rebex.net", port: NaN, user: "demo", password: "password", uri: "/readme.txt" }],
			["ftp://demo:password@test.rebex.net/readme.txt", { protocol: "ftp", host: "test.rebex.net", port: NaN, user: "demo", password: "password", uri: "/readme.txt" }],
			["ftp://demo:password@test.rebex.net:8990/path/readme.txt", { protocol: "ftp", host: "test.rebex.net:8990", hostname: "test.rebex.net", port: 8990, user: "demo", password: "password", uri: "/path/readme.txt" }],
		];

		tests.forEach((t) => {
			const res: any = BaseProtocol.parseUrl(t[0]);
			// console.log(t[1], res);
			// expect(res).to.equals(t[1]);
			for(let key in t[1]) {
				if(key === "port" && !t[1][key]) {
					expect(res[key]).to.be.NaN;
				} else {
					expect(res[key]).to.equal(t[1][key]);
				}
			}
		});
	});

	it("getInstance()", () => {

		let tests: any[] = [
			["", false],
			["http", http.Protocol],
			["https", https.Protocol],
			["ftp", ftp.Protocol],
			["sftp", false],
		];

		tests.forEach((t) => {
			const res = BaseProtocol.getInstance(t[0]);
			// console.log(res, t[1]);
			try {
				expect(res instanceof t[1]).to.equals(true);
			} catch(e) {
				expect(res).to.equals(false);
			}
		});
	});

	it("run()", (done: Function) => {
		let tests: any[] = [
			["", { error: 'Could not parsed url' }],
			["https://google.com/name", { error: "Server responded with 404: Not Found" }],
			["http://blog.tech.google.com/path/name", { error: "getaddrinfo ENOTFOUND blog.tech.google.com blog.tech.google.com:80" }],
			["ftp://blog.google.com/name", { error: "Timeout while connecting to server" }],
			["http://212.183.159.230/5MB.zip", { msg: "Success" }]
		];

		let promises: Promise<any>[] = [];
		tests.forEach((t) => {
			promises.push(BaseProtocol.run(t[0]));
		});

		Promise.all(promises).then((results: any[]) => {
			// console.log(results[1].error.message);
			for(let i in results) {
				let res = results[i];
				for(let key in tests[i][1]) {
					expect(res[key].message || res[key]).to.equals(tests[i][1][key]);
				}
			}
			done();
		}).catch(err => done(err) );
	});

	after(() => {
		fs.unlink("5MB.zip", () => {});
		fs.unlink("5MB(1).zip", () => {});
	});
});

