import mongoose, { Types } from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'category name already exists']
    },
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
});
export const Category = mongoose.model("category", categorySchema);
