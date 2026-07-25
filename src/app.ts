import express from 'express'
import runGraph from "./ai/graph.ai.js"
const app = express();

app.get('/',async (req,res)=>{
    const result = await runGraph("what is the defination of a creative web developer??")

    res.json(result);
})

export default app;