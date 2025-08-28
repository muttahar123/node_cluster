import cluster from "cluster";
import os from "os";
import http from "http";

if(cluster.isPrimary){
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...\n`);

    for(let i = 0; i<numCPUs; i++){
        cluster.fork();
    }
    cluster.on("exit",(worker,code,signal)=>{
        console.log(`worker ${worker.process.pid} died. forking  new one`);
        cluster.fork();
    });
}else{
    http.createServer((req,res)=>{
        res.writeHead(200);
        res.end(`Handled by worker ${process.pid} \n`);
    }).listen(3000);
   console.log(`worker ${process.pid} started`);

}

