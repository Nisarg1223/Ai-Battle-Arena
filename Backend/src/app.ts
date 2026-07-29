import express from 'express'
import runGraph from "./ai/graph.ai.js"
import { Battle } from "./models/battle.model.js"
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
        
        // Save the result to MongoDB only after the judge has successfully given the results (scores)
        const hasJudgeResult = result.judge && 
            typeof result.judge.solution_1_score === 'number' && 
            typeof result.judge.solution_2_score === 'number';

        if (hasJudgeResult) {
            const score1 = result.judge.solution_1_score;
            const score2 = result.judge.solution_2_score;

            let winner = 'draw';
            let loser = 'draw';
            if (score1 > score2) {
                winner = model_1;
                loser = model_2;
            } else if (score2 > score1) {
                winner = model_2;
                loser = model_1;
            }

            const qScore = result.judge.question_score ?? 0;

            try {
                await Battle.create({
                    problem,
                    model_1,
                    model_2,
                    judge_model,
                    solution_1: result.solution_1,
                    solution_2: result.solution_2,
                    solution_1_score: score1,
                    solution_2_score: score2,
                    question_score: qScore,
                    solution_1_feedback: result.judge.solution_1_feedback || '',
                    solution_2_feedback: result.judge.solution_2_feedback || '',
                    winner,
                    loser
                });
                console.log("Battle result saved to database successfully.");
            } catch (dbError) {
                console.error("Failed to save battle result to database:", dbError);
            }
        } else {
            console.log("Skipping database save: Judge did not return valid scores/results.");
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error?.message || "Internal server error" });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const battles: any[] = await Battle.find({});
        
        // Define metadata for all known models
        const modelMeta: Record<string, { name: string; provider: string; handle: string; icon: string; id: string }> = {
            claude: { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', handle: '@anthropic', icon: '/logos/claude.png', id: '1587667' },
            openai: { name: 'OpenAI GPT-4o', provider: 'OpenAI', handle: '@openai', icon: '/logos/GPT_2.png', id: '1587634' },
            gemini: { name: 'Gemini 3.5 Flash', provider: 'Google', handle: '@google', icon: '/logos/gemini.png', id: '1587699' },
            deepseek: { name: 'DeepSeek V3', provider: 'DeepSeek', handle: '@deepseek', icon: '/logos/deepseek.png', id: '1587712' },
            mistral: { name: 'Mistral Medium', provider: 'Mistral', handle: '@mistral', icon: '/logos/mistral.png', id: '1587789' },
            cohere: { name: 'Cohere Command', provider: 'Cohere', handle: '@cohere', icon: '/logos/cohere.png', id: '1587823' },
            groq: { name: 'Groq Llama 3.3', provider: 'Groq', handle: '@groq', icon: '/logos/groq.svg', id: '1587901' },
        };

        // Initialize stats for each model
        const stats: Record<string, { wins: number; matches: number; elo: number; victories: number; totalScore: number }> = {};
        Object.keys(modelMeta).forEach(key => {
            stats[key] = { wins: 0, matches: 0, elo: 1000, victories: 0, totalScore: 0 };
        });

        // Simple loop to calculate wins, matches, and points
        for (let i = 0; i < battles.length; i++) {
            const battle = battles[i];
            const m1 = (battle.model_1 || '').toLowerCase();
            const m2 = (battle.model_2 || '').toLowerCase();
            const winner = (battle.winner || '').toLowerCase();
            const loser = (battle.loser || '').toLowerCase();

            if (stats[m1]) {
                stats[m1].matches += 1;
                stats[m1].totalScore += battle.solution_1_score || 0;
            }
            if (stats[m2]) {
                stats[m2].matches += 1;
                stats[m2].totalScore += battle.solution_2_score || 0;
            }

            if (winner === 'draw') {
                if (stats[m1]) stats[m1].elo += 5;
                if (stats[m2]) stats[m2].elo += 5;
            } else {
                if (winner && stats[winner]) {
                    stats[winner].wins += 1;
                    stats[winner].victories += 1;
                    stats[winner].elo += 10;
                }
                if (loser && stats[loser]) {
                    stats[loser].elo -= 10;
                }
            }
        }

        // Map stats to standings format
        const standings = Object.keys(modelMeta).map(key => {
            const meta = modelMeta[key]!;
            const stat = stats[key] || { wins: 0, matches: 0, elo: 1000, victories: 0, totalScore: 0 };
            const successRateVal = stat.matches > 0 ? (stat.wins / stat.matches) * 100 : 0;
            const avgScoreVal = stat.matches > 0 ? (stat.totalScore / stat.matches).toFixed(1) : '0.0';

            return {
                name: meta.name,
                provider: meta.provider,
                handle: meta.handle,
                icon: meta.icon,
                id: meta.id,
                wins: stat.wins,
                matches: stat.matches,
                victories: stat.victories,
                successRate: `${successRateVal.toFixed(1)}%`,
                speed: '1.2s',
                bestWin: `${avgScoreVal}/10`,
                elo: stat.elo
            };
        });

        // Sort by Elo descending
        standings.sort((a, b) => b.elo - a.elo);

        // Assign ranks
        const rankedStandings = standings.map((item, index) => ({
            rank: index + 1,
            ...item
        }));

        res.json({
            standings: rankedStandings,
            totalBattles: battles.length,
            totalModels: Object.keys(modelMeta).length
        });
    } catch (error: any) {
        res.status(500).json({ error: error?.message || "Internal server error" });
    }
});

app.get('/api/prompts', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        const battles: any[] = await Battle.find({});

        // Sort: question_score >= 8 first, then others. Within each group, sort by score descending.
        const sortedBattles = [...battles].sort((a, b) => {
            const scoreA = a.question_score || 0;
            const scoreB = b.question_score || 0;
            
            const isHighA = scoreA >= 8 ? 1 : 0;
            const isHighB = scoreB >= 8 ? 1 : 0;

            if (isHighA !== isHighB) {
                return isHighB - isHighA;
            }
            return scoreB - scoreA;
        });

        const paginatedBattles = sortedBattles.slice(skip, skip + limit);

        const formattedPrompts = paginatedBattles.map(battle => {
            let answerText = `**Evaluation Score:** ${battle.question_score}/10\n\n`;
            answerText += `**Winner:** ${battle.winner === 'draw' ? 'Draw' : battle.winner.toUpperCase()}\n\n`;
            answerText += `**Solution 1 (Model: ${battle.model_1.toUpperCase()} | Score: ${battle.solution_1_score}/10):**\n${battle.solution_1}\n\n`;
            answerText += `**Solution 2 (Model: ${battle.model_2.toUpperCase()} | Score: ${battle.solution_2_score}/10):**\n${battle.solution_2}`;

            return {
                question: battle.problem,
                answer: answerText,
                score: battle.question_score || 0
            };
        });

        res.json({
            prompts: formattedPrompts,
            total: battles.length,
            page,
            totalPages: Math.ceil(battles.length / limit)
        });
    } catch (error: any) {
        res.status(500).json({ error: error?.message || "Internal server error" });
    }
});

export default app;