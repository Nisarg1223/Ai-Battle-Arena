import dns from 'dns';
import app from "./src/app.js";
import connectedtoDB from "./src/config/db.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder("ipv4first");
}

connectedtoDB();

app.listen(3000,()=>{
   console.log("server is running on the port 3000");
});