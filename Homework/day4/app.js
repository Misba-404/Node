const managerInfo = require("./managerInfo");
const capitalizeName = require("./capitalizeName");
let capitalized=capitalizeName(managerInfo.name)
console.log("Name:",capitalized);
console.log(`UpperCased: ${managerInfo.role.toUpperCase()}`);
console.log(`Length :${managerInfo.role.length}`);
console.log(`position:`,managerInfo.role.search("inventory"));