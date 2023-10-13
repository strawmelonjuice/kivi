import tar from "tar";
import axios from 'axios';
import os from "os";
import chalk from "chalk";
import path, { dirname } from "path";
import fs from "fs";
const pkgjsn: { version: string, bananenVersion : string} = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), { encoding: "utf8", flag: "r" }).toString())
const KIVI_VERSION = pkgjsn.version;
const BANANEN_VERSION = pkgjsn.bananenVersion;
export class KiviBananen {
    bananenexecutable!: string;
    execute: (command: string, callback: CallableFunction) => void;
    public info: { versions: { kivi: string; bananen: string; }; cwd: string; };
    cwd: string;
    constructor(cwd: string) {
        const exec = require("child_process").exec;
        this.info = {
            versions: {
                kivi: KIVI_VERSION,
                bananen: BANANEN_VERSION
            },
            cwd: cwd
        }
        this.cwd = this.info.cwd;
        this.execute = (command: string, callback: CallableFunction) => {
            exec(
                command,
                {
                    cwd: cwd,
                },
                function (error: Error, stdout: string, stderr: string) {
                    callback(stdout);
                },
            );
        }
    }
    do(callback: (KiviInstance: typeof this) => void): void {
        const exec = require("child_process").exec;

        exec(
            "cargo --version",
            {
                cwd: process.cwd(),
            },
             async (b: Error, a: string, c: string) => {
                try {
                if (b == null) {
                    console.log("Cargo: `" + a.replace(/(\r\n|\n|\r)/gm, "") + "` was found. Compiling Bananen from source!\n");
                    const bananensourcedir = path.join(__dirname, "../bananen-source/");
                    const bananensourcepack = path.join(bananensourcedir,`./packed-${BANANEN_VERSION}.tar.gz`);
                    if (!fs.existsSync(bananensourcedir)) {
                    fs.mkdirSync(bananensourcedir);
                    }
                    if (!fs.existsSync(bananensourcepack)) {
                        const res = await axios.get(`https://github.com/strawmelonjuice/bananen/archive/refs/tags/v${BANANEN_VERSION}.tar.gz`, { responseType: 'arraybuffer' });
                        fs.writeFileSync(bananensourcepack, res.data);
                    };
                    tar.extract({
                        file: bananensourcepack,
                        cwd: bananensourcedir,
                        sync: true,
                        strip: 1
                    });
                    exec(
                        "cargo build -r",
                        {
                            cwd: bananensourcedir,
                        },
                        function (error: Error, stdout: string, stderr: string) {
                            if (error !== null) throw new Error("Compile fail.");
                        },
                    );
                    this.bananenexecutable = path.join(bananensourcedir,"./target/release/bananen");
                    if (os.type().toLowerCase() == "windows_nt") {
                        this.bananenexecutable = path.join(bananensourcedir, "./target/release/bananen.exe");
                    }
                } else { throw new Error("No cargo found. Using bundled Bananen executables!")}}
                catch {
                    let machine_double;
                    switch (os.type().toLowerCase()) {
                        case "windows_nt":
                            switch (os.arch().toLowerCase()) {
                                case "x64":
                                    machine_double = "windows_64";
                                    break;
                                default:
                                    throw new Error(
                                        chalk.red("ERROR: ") +
                                        "Unsupported processor architecture! Supported architectures on Windows are:\n- 64-bit (AMD64)",
                                    );
                                    // process.exit(1);
                                    break;
                            }
                            break;
                        case "linux":
                            switch (os.arch().toLowerCase()) {
                                case "x64":
                                    machine_double = "linux_64";
                                    break;
                                case "arm":
                                    machine_double = "linux_arm";
                                    break;
                                default:
                                    throw new Error(
                                        chalk.red("ERROR: ") +
                                        "Unsupported processor architecture! Supported architectures on Linux are:\n- 64-bit (AMD64)\n- arm (aarch64)",
                                    );
                                    // process.exit(1);
                                    break;
                            }
                            break;
                        default:
                            throw new Error(
                                chalk.red("ERROR: ") +
                                "Unsupported OS! Supported OS's are: \n- Windows\n- Linux",
                            );
                        // process.exit(1);
                    }
                    switch (machine_double) {
                        case "windows_64":
                            this.bananenexecutable = path.join(
                                __dirname,
                                "/../bundled/" +
                                machine_double +
                                "_" +
                                BANANEN_VERSION +
                                ".exe",
                            );
                            break;
                        case "linux_64" || "linux_arm":
                            this.bananenexecutable = path.join(
                                __dirname,
                                "/../bundled/" + machine_double + "_" + BANANEN_VERSION,
                            );
                            this.execute(`chmod +x '${this.bananenexecutable}'`, () => { console.log(`Successfully made '${this.bananenexecutable}' executable.`) })
                            break;
                        default:
                            throw new Error(chalk.red("ERROR: ") + "Unsupported machine!");
                            // process.exit(1);
                            break;
                    }
                }
                 console.log(
                     `Seemingly successfully initialised ${chalk.bold(
                         chalk.greenBright("Kivi! 🥝"),
                     )} ${chalk.italic("v" + KIVI_VERSION)} by ${chalk.redBright("Straw") +
                     chalk.green("melon") +
                     chalk.yellowBright("juice")
                     } ${chalk.magenta("Mar")}.\nusing Bananen binairy "${this.bananenexecutable
                     }", also by ${chalk.redBright("Straw") +
                     chalk.green("melon") +
                     chalk.yellowBright("juice")
                     } ${chalk.magenta("Mar")}.`,
                 );
                 callback(this);
            },
        );
    }
    add(type: number, breaking: boolean, change: string) {
        var cmd: string;
        var ctype: string;
        if (type === 1) ctype = "addition";
        else if (type === 2) ctype = "update";
        else if (type === 3) ctype = "fix";
        else ctype = "removal";
        if (breaking)
            cmd = `${this.bananenexecutable} add ${ctype} "${change}" --breaking`;
        else cmd = `${this.bananenexecutable} add ${ctype} "${change}"`;
        let cmmnd: string = cmd;
        // console.log(cmmnd);
        this.execute(cmmnd, () => {});
    }
    init(force: boolean = false) {
        if (force)
            this.execute(`${this.bananenexecutable} init --proceed`, () => {});
        else this.execute(`${this.bananenexecutable} init`, () => {});
    }
    dub(releasename: string) {
        this.execute(`${this.bananenexecutable} dub ${releasename}`, () => {});
}

    regen() {
        this.execute(`${this.bananenexecutable} regen`, () => {});
    }
    chdir(cwd: string) {
        this.cwd = cwd;
        var exec = require("child_process").exec;
        this.execute = (command: string, callback: CallableFunction) => {
            exec(
                command,
                {
                    cwd: cwd,
                },
                function (error: Error, stdout: string, stderr: string) {
                    callback(stdout);
                },
            );
        };
    }
}
