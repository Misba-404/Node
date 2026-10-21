const buf1 = Buffer.from("NodeJS is fast");
const slicedBuf = buf1.subarray(0, 6);

const buf2 = Buffer.from("Powerful");

const result = buf1.compare(buf2);
const converted = buf1.toJSON();

console.log(slicedBuf.toString());
console.log(result);
console.log(converted);
