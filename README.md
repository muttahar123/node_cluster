# Node.js Cluster Learning 

##  Overview

This repo shows how Node.js handles requests **with and without cluster module**
We compare a **single process server** vs a **clustered server** and test performance using **autocannon**

---

##  Project Structure

```
node_cluster/
│── single.js    # Normal single-threaded Node.js server
│── cluster.js   # Multi-core server using Node.js cluster module
```

---

##  How It Works

### single.js

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Hello from single server");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

* Runs only **one process**
* Handles all requests on a single CPU core
* If traffic increases → server becomes slow

---

### cluster.js

```js
const cluster = require("cluster");
const http = require("http");
const os = require("os");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, starting a new one`);
    cluster.fork();
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`Hello from worker ${process.pid}`);
    })
    .listen(3000);

  console.log(`Worker ${process.pid} started`);
}
```

* Uses Node.js **cluster module**
* Master forks **workers = number of CPU cores**
* Each worker handles requests independently
* Master does **load balancing**
* If worker crashes → new worker starts automatically

---

##  Architecture Diagram

### Single Process (single.js)

```
        ┌───────────────┐
Request →  Single Process  → Response
        └───────────────┘
```

### Clustered Server (cluster.js)

```
              ┌─────────────┐
Request  →    │   Master    │
              └──────┬──────┘
                     │
   ┌─────────────────┼─────────────────┐
   │                 │                 │
┌───────┐        ┌───────┐        ┌───────┐
│Worker1│        │Worker2│  ...   │WorkerN│
└───────┘        └───────┘        └───────┘
   │                 │                 │
 Response         Response         Response
```

---

##  Running the Project
###  Start single server

```bash
node single.js
```

### 2️⃣ Start cluster server

```bash
node cluster.js
```

---

## Load Testing with Autocannon

Install autocannon:

```bash
npm install -g autocannon
```

Run test:

```bash
autocannon -c 100 -d 10 http://localhost:3000
```

 Compare results for **single.js** and **cluster.js**

---

##  Sample Autocannon Results

### single.js

```
Running 10s test @ http://localhost:3000
100 connections

Requests/sec: 2000
Latency: 50 ms
```

### cluster.js

```
Running 10s test @ http://localhost:3000
100 connections

Requests/sec: 8000
Latency: 12 ms
```

### Screenshot Example

*(add your actual screenshot here after running test)*

![Autocannon Results](./assets/autocannon_results.png)

---

## Conclusion

* Node.js single-threaded by default
* Cluster uses all CPU cores
* Boosts scalability and reliability
* Production apps often use **PM2 with cluster** for managing multiple processes

