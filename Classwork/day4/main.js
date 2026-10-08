let userDetails=require("./userInfo.js")
let formatName=require("./formatName.js")
let formattedName=formatName(userDetails.name)
console.log(`Formatted name:`+formattedName);
console.log(`Hobby:`+userDetails.hobby.toUpperCase());
console.log(`Hobby length:`+userDetails.hobby.length);