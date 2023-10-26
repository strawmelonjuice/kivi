import { KiviBananen } from "./main";
console.log("first")
import path from 'path';
const kivi = new KiviBananen(path.join(__dirname, "../yes/"));
console.log("second")
kivi.init()
kivi.regen()