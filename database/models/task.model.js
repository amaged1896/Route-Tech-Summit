import mongoose, { Types } from "mongoose";

const taskSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'list'],
        required: true
    },
    visible: {
        type: Boolean,
        default: false
    },
    creator: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    textBody: String,
    listTasks: [{ type: String }],
    category: {
        type: Types.ObjectId,
        ref: 'category'
    },
});

export const Task = mongoose.model('task', taskSchema);