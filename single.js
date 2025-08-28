// import http from "http";

// http.createServer((req,res)=>{
//     res.writeHead(200);
//     res.end(`Handled by single  process \n`);
// }).listen(3000);
// console.log(`single process server running on 3000 pid ${process.pid}`);



import os from "os";

const totalCPU = os.cpus().length;

console.log(`Total CPU cores available: ${totalCPU}`);