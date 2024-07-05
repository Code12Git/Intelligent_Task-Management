const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const taskSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    prioritized:{
        type:Boolean,
    },
    dueDate:{
        type:Date,
    },
    userId: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'completed'],
        default: 'pending'
    },
    collaborators: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }],
 },{timestamps:true})

module.exports = mongoose.model('Task',taskSchema);
