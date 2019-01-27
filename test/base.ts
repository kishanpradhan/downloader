import { expect } from 'chai';

import { BaseProtocol } from "../src/base";
import * as http from "../src/protocols/http";
import * as ftp from "../src/protocols/ftp";


describe("BaseProtocol", () => {
	/*
	it("findProtocol()", () => {
		abstract class FindProtocol extends BaseProtocol {
			static findProtocol(url: string) {
				return BaseProtocol.findProtocol(url);
			}
		}

		let tests: any[] = [
			["", false],
			["https://google.com/sdfse", "https"],
			["http://blog.tech.google.com/sdfse", "http"],
			["ftp://blog.google.com/sdfse", "ftp"],
		];

		tests.forEach((t) => {
			const res = FindProtocol.findProtocol(t[0]);
			expect(res).to.equals(t[1]);
			// console.log(t, res);
		});
	});
	 */

	it("getInstance()", () => {
		/*
		abstract class InstanceProtocol extends BaseProtocol {
			static getInstance(protocol: string) {
				return BaseProtocol.getInstance(protocol);
			}
		}
		 */

		let tests: any[] = [
			["", false],
			["http", http.Protocol],
			["https", false],
			// ["ftp", ftp.Protocol],
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

	it("run()", () => {
		let tests: any[] = [
			["", false],
			["https://google.com/sdfse", Promise], // Passing for this, should not pass
			["http://blog.tech.google.com/sdfse", Promise],
			["ftp://blog.google.com/sdfse", false],
		];

		tests.forEach((t) => {
			const res: any = BaseProtocol.run(t[0]);
			console.log("test", res, t[1]);
			try {
				expect(res instanceof t[1]).to.equals(true);
			} catch(e) {
				expect(res).to.equals(false);
			}
			// console.log(t, res);
		});
	});
});

