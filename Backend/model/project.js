const mongoose = require("mongoose");

const project = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    },
     teamMembers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
     ],
     createBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
     },
      status: {
         type: String,
         enum: ['To Do', 'In Progress', 'Done'],
         default: 'To Do'
     },
     createdBy:{
        type:Date,
        default:Date.now,
     },
     updateAt:{
        type:Date,
        default:Date.now,
     }
})

// Update the updatedAt timestamp before saving
project.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Project", project);