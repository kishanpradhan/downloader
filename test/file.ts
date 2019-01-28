import * as fs from "fs";
import { expect } from 'chai';

import { File } from "../src/file";
import { BaseProtocol } from "../src/base";


describe("#File", () => {
	it("getUniqueFileName()", (done: Function) => {
		const res: Promise<string> = File.getUniqueFileName("unique.txt", process.cwd());
		expect(res instanceof Promise).to.equals(true);
		res.then((r: string) => {
			console.log(r);
			expect(r).to.equals("unique.txt");
		}).then(() => {
			fs.writeFileSync("unique.txt", "This is data");
			File.getUniqueFileName("unique.txt", process.cwd())
				.then((name: string) => {
					expect(name).to.equals("unique(1).txt");
					File.unlink("unique.txt", () => {});
					done();
				}).catch(err => done(err) );
		}).catch((err: Error) => {
			done(err);
		});
	});

	it("process()", function(done: Function) {
		BaseProtocol.output = "./test/downloads/";
		const res: any = new File("./test/assets/download.txt").process();
		res.then((r: any) => {
			done();
		}).catch((err: Error)=> done(err));
		// this.timeout(100000);
	});

});

