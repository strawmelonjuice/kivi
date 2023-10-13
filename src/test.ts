import { KiviBananen } from "./main";
console.log("first")
import path from 'path';
const kivi = new KiviBananen(path.join(__dirname, "../yes/"));
// console.log("second")
// kivi.regen()

kivi.do((kivi) => {
console.log("second")
kivi.regen()
});