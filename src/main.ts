import tar from "tar";
import axios from 'axios';
import os from "os";
import chalk from "chalk";
import path, { dirname } from "path";
import fs from "fs";
const pkgjsn: { version: string, bananenVersion: string } = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), { encoding: "utf8", flag: "r" }).toString())
import { execSync } from 'child_process';


const KIVI_VERSION = pkgjsn.version;

export class KiviBananen {
    bananenexecutable!: string;
    public info: { versions: { kivi: string; bananen: string; }; cwd: string; };
    constructor(cwd: string) {
        const shell = (cmd: string) => execSync(cmd, { encoding: 'utf8' });
        let locator = "which";
        if (os.platform() === "win32") { locator = "where" }
         const executableIsAvailable = (name: string) => {
            try { shell(`${locator} ${name}`); return true }
            catch (error) { return false }
        }
        if (executableIsAvailable("bananen")) {
            this.info = {
                versions: {
                    kivi: KIVI_VERSION,
                    bananen: execSync("bananen --minimal help version").toString().replace("\n", ""),
                },
                cwd: cwd
            }
            console.log(
                `Successfully initialised ${chalk.bold(
                    chalk.greenBright("Kivi! 🥝"),
                )} ${chalk.italic("v" + KIVI_VERSION)} by ${chalk.redBright("Straw") +
                chalk.green("melon") +
                chalk.yellowBright("juice")
                } ${chalk.magenta("Mar")}.\nusing Bananen version "${this.info.versions.bananen
                }", also by ${chalk.redBright("Straw") +
                chalk.green("melon") +
                chalk.yellowBright("juice")
                } ${chalk.magenta("Mar")}.`,
            );
        } else {
            this.info = {
                versions: {
                    kivi: KIVI_VERSION,
                    bananen: "none",
                },
                cwd: cwd
            }
            console.error("KiviError: Bananen executable not on path.");
            return;
        }
    }
    private bananenRun(cmd: string) {
        return execSync("bananen --minimal " + cmd, {
            cwd: this.info.cwd,
        }).toString();
    }
    add(type: number, breaking: boolean, change: string) {
        var cmd: string;
        var ctype: string;
        if (type === 1) ctype = "addition";
        else if (type === 2) ctype = "update";
        else if (type === 3) ctype = "fix";
        else ctype = "removal";
        if (breaking)
            cmd = `add ${ctype} "${change}" --breaking`;
        else cmd = `add ${ctype} "${change}"`;
        let cmmnd: string = cmd;
        // console.log(cmmnd);
        return this.bananenRun(cmmnd);
    }
    init(force: boolean = false) {
        if (force)
            return this.bananenRun("init --proceed");
        else return this.bananenRun("init");
    }
    dub(releasename: string) {
        return this.bananenRun(`dub ${releasename}`);
    }

    regen() {
        return this.bananenRun("regen");
    }
    chdir(cwd: string) {
        this.info.cwd = cwd;
    }
}
