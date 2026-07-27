import express from 'express'
import runGraph from "./ai/graph.ai.js"
const app = express();

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.get('/',async (req,res)=>{
    const result = await runGraph("what is the defination of a creative web developer??")

    res.json(result);
})

app.post('/api/battle', async (req, res) => {
    const { problem, model_1, model_2, judge_model } = req.body;
    if (!problem) {
        res.status(400).json({ error: "Missing parameter: problem" });
        return;
    }

    try {
        const result = await runGraph(problem, model_1, model_2, judge_model);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error?.message || "Internal server error" });
    }
});

export default app;