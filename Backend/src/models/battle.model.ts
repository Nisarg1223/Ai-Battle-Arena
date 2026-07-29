import mongoose from 'mongoose';

const battleSchema = new mongoose.Schema({
    problem: {
        type: String,
        required: [true, 'The problem/prompt is required'],
        trim: true
    },
    model_1: {
        type: String,
        required: [true, 'Model 1 is required'],
        trim: true
    },
    model_2: {
        type: String,
        required: [true, 'Model 2 is required'],
        trim: true
    },
    judge_model: {
        type: String,
        required: [true, 'Judge model is required'],
        trim: true
    },
    solution_1: {
        type: String,
        required: [true, 'Solution 1 is required']
    },
    solution_2: {
        type: String,
        required: [true, 'Solution 2 is required']
    },
    solution_1_score: {
        type: Number,
        required: [true, 'Solution 1 score is required']
    },
    solution_2_score: {
        type: Number,
        required: [true, 'Solution 2 score is required']
    },
    question_score: {
        type: Number,
        required: [true, 'Question score is required']
    },
    solution_1_feedback: {
        type: String,
        trim: true
    },
    solution_2_feedback: {
        type: String,
        trim: true
    },
    winner: {
        type: String,
        required: [true, 'Winner is required'],
        trim: true
    },
    loser: {
        type: String,
        required: [true, 'Loser is required'],
        trim: true
    }
}, { timestamps: true });

const BattleModel = mongoose.model('Battle', battleSchema);

export default BattleModel;
export { BattleModel as Battle };
