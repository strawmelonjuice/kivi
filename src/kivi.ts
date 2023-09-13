import { Command } from 'commander';
// const program = new Command();
// const tomlParse = require("toml-parse") as class;
import pkgversion from "./pkgversion";
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
console.log(`${chalk.bold(`${chalk.greenBright("Kivi! 🥝")} v${pkgversion}`)}
by ${chalk.redBright("Straw") + chalk.green("melon") + chalk.yellowBright("juice")} ${chalk.magenta("Mar")}.`);
// println!("{style_bold}{color_yellow}Bananen! 🍌{color_reset} v{VERSION}\n{style_reset}By {color_red}Straw{color_green}melon{color_yellow}juice {color_magenta}Mar{color_reset}.");

if (fs.existsSync(path.join(process.cwd(), "/bananen.toml"))) {
    
}

if (fs.existsSync(path.join(process.cwd(), "../kivi.toml"))) {

}
