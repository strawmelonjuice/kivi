import os from "os";
import chalk from "chalk";
import path from "path";
const BANANEN_VERSION = "0.1.6-alpha";
export class KiviBananen {
    bananenexecutable: string;
    execute: (command: string, callback: CallableFunction) => void;

    constructor(cwd: string) {
        var exec = require('child_process').exec;
        this.execute = (command: string, callback: CallableFunction) => {
            exec(command, {
                cwd: cwd
            }, function (error: Error, stdout: string, stderr: string) { callback(stdout); });
        };
        let machine_double;
        switch (os.type().toLowerCase()) {
            case "windows_nt":
                switch (os.arch().toLowerCase()) {
                    case "x64":
                        machine_double = "windows_64";
                        break;
                    default:
                        throw new Error(chalk.red("ERROR: ") + "Unsupported processor architecture! Supported architectures on Windows are:\n- 64-bit (AMD64)");
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
                        throw new Error(chalk.red("ERROR: ") + "Unsupported processor architecture! Supported architectures on Linux are:\n- 64-bit (AMD64)\n- arm (aarch64)");
                        // process.exit(1);
                        break;
                }
                break;
            default:
                throw new Error(chalk.red("ERROR: ") + "Unsupported OS! Supported OS's are: \n- Windows\n- Linux");
                // process.exit(1);
        }
        switch (machine_double) {
            case "windows_64":
                this.bananenexecutable = path.join(__dirname, "/../bundled/" + machine_double + "_" + BANANEN_VERSION + ".exe");
                break;
            case "linux_64" || "linux_arm":
                this.bananenexecutable = path.join(__dirname, "/../bundled/" + machine_double + "_" + BANANEN_VERSION);
                break;
            default:
                throw new Error(chalk.red("ERROR: ") + "Unsupported machine!");
                // process.exit(1);
                break;
        }
        console.log(`Successfully initialised ${chalk.bold(chalk.greenBright("Kivi! 🥝"))} ${chalk.italic("v" + process.env.npm_package_version)} by ${chalk.redBright("Straw") + chalk.green("melon") + chalk.yellowBright("juice")} ${chalk.magenta("Mar")}.\n\nusing Bananen binairy "${this.bananenexecutable}", also by ${chalk.redBright("Straw") + chalk.green("melon") + chalk.yellowBright("juice")} ${chalk.magenta("Mar")}.`);
    }
    add(type: number, breaking: boolean, change: string) {
        var cmd: string;
        var ctype: string;
        if (type === 1) ctype = "addition"; else if (type === 2) ctype = "update"; else if (type === 3) ctype = "fix"; else ctype = "removal";
        if (breaking) cmd = `${this.bananenexecutable} add ${ctype} "${change}" --breaking`; else cmd = `${this.bananenexecutable} add ${ctype} "${change}"`;
        let cmmnd: string = cmd;
        // console.log(cmmnd);
        this.execute(cmmnd, () => { });
    }
    init(force: boolean = false) {
        if (force) this.execute(`${this.bananenexecutable} init --proceed`, () => { }); else this.execute(`${this.bananenexecutable} init`, () => {});
    }
    dub(releasename: string) {
        this.execute(`${this.bananenexecutable} dub ${releasename}`, () => { });
    }
    regen() {
        this.execute(`${this.bananenexecutable} regen`, () => { });
    }
}
const hi = new KiviBananen(path.join(__dirname, "../yes"));
hi.init();
hi.add(1, false, "testing ..");
hi.add(4, false, "testing.  ");
hi.add(2, true, "testing. .");
hi.add(2, false, "tested!");
hi.regen();
hi.dub("Completed test!");