import fs from "fs";
import path from "path";
const packageJSON = fs.readFileSync(path.join(__dirname, "../package.json"), {
	encoding: "utf8",
	flag: "r",
});
const packageData = JSON.parse(packageJSON);
const JS = `const pkgversion = "${packageData.version}";
export default pkgversion;`.toString();

try {
	fs.writeFileSync(path.join(__dirname, "../src/pkgversion.ts"), JS);
} catch (err: unknown) {
	console.error(err);
}
