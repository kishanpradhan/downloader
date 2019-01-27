import { expect } from 'chai';

import { File } from "../src/file";


describe("#File", () => {
	it("getUniqueFileName()", (done: Function) => {
		const res: Promise<string> = File.getUniqueFileName("download.txt", process.cwd());
		expect(res instanceof Promise).to.equals(true);
		res.then((r: string) => {
			console.log(r);
			expect(r).to.equals("download(2).txt");
			done();
		}).catch((err: Error) => {
			done(err);
		});
	});
});

