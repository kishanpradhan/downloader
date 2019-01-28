# Download from urls having different protocols
## Requirements
1. Node JS >= 8.9.4

## Installation
1. Clone the project
2. Run `npm install`
3. Run `npm run test -- --timeout 1000000` \[optional] provide your own timeout
4. Run `npm run build`
5. Run `npm link`

Examples
==========
* Download from all urls in a file

```downloader file_path --output output_dir```

**Note:** If `--output` is not provided, it will take current working directory as output folder

* Read all files in a directory and download from urls of each file

```downloader folder_path --output output_dir -r```

**Note:** If `-r` is not provided, it will give en error.

* Write your own protocol folder and provide it with the path. While downloading, it will search from the user defined protocol folder in environments, then own protocols folder.

```DOWNLODER_PROTOCOL="/protocols/path1,/protocols1/path2" downloader file_path --output output_dir```

It will search in path1, path2 and then in own protocols folder. In this way you can defined your own downloader.
