#!/usr/bin/env node

import { Downloader } from "./index";

new Downloader()
	.start(process.argv)
	.then(() => { console.log("Downloader Finished") })
	.catch(() => {});
