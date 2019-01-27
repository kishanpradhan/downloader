import { expect } from 'chai';

import { File } from "../src/file";
import { BaseProtocol } from "../src/base";


describe("#File", () => {
	/*
	it("getUniqueFileName()", (done: Function) => {
		const res: Promise<string> = File.getUniqueFileName("download.txt", process.cwd());
		expect(res instanceof Promise).to.equals(true);
		res.then((r: string) => {
			console.log(r);
			expect(r).to.equals("download(1).txt");
			done();
		}).catch((err: Error) => {
			done(err);
		});
	});
	 */

	it("process()", function(done: Function) {
		BaseProtocol.output = "./downloads/";
		const res: any = new File("./tt.txt").process();
		res.then((r: any) => {
			done();
		}).catch((err: Error)=> done(err));
		// this.timeout(100000);
	});

});

