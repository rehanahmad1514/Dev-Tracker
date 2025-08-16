const Project = require("../model/project");
const User = require("../model/auth");

// create project
exports.createProject = async(req,res) =>{
    try{
        const project = new Project({
            ...req.body,
            createdBy:req.user.id,
            teamMembers: [req.user.id] // Add creator as first team member
        });
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User Detail not found",
            })
        }
        await project.save();
        return res.status(200).json({
            success:true,
            message:"project created successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// list course 
exports.projectDetail = async(req, res) =>{
    try{
        const project = await Project.find({
                    $or: [
                    { createdBy: req.user.id },
                    { teamMembers: req.user.id }
                 ]
                       })
                       .populate("Auth")
                       .exec();
        if(!project){
            return res.status(404).json({
                success:false,
                message:"project not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"course detail found successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// get a spesific project
exports.getSpecificProject = async (req, res) =>{
    try{
        const id = req.params.id;
        if(!id){
            return res.status(404).json({
                success:false,
                 message:"id not found"
            })
        }
        const course = await Project.findById(
                      {id:id})
                      .populate("Auth")
                      .exes();
        if(!course){
            return res.status(404).json({
                success:false,
                message:"course not found"
            })
        }
        // Check if user has access to the project
            if (!course.teamMembers.includes(req.user.id) && course.createdBy.toString() !== req.user.id) {
               return res.status(403).json({ message: 'Access denied' });
            }
        return res.status(200).json({
            success:true,
            message:"course detail found successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// update project
exports.updateProject= async (req, res) =>{
    try{
        const id = req.params.id;
        if(!id) {
            return res.status(400).json({
                success:false,
                message:"Project id is required"
            })
        }
        const project = Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // Only creator can update project details
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only project creator can update project details' });
        }
        Object.assign(project, req.body);
        await project.save();

        return res.status(200).json({
            success:true,
            message:"course updated successfully"
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// delete a project
exports.deleteProject = async (req, res) =>{
    try{
        const project = await Project.findById(req.params.id);
        if(!project){
             return res.status(404).json({
                success:false,
               message: 'Project not found' 
             })
        }
        // Only creator can delete project
     if (project.createdBy.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Only project creator can delete project' });
     }
    await project.remove();
    return res.status(200).json({
        success:true,
        message:"project deleted successfully",
    })
    }catch(error){
       return res.status(500).json({
        success:false,
        message:error.message,
       })
    }
}

// Add team member 
exports.addTeamMember = async (req, res) =>{
    try{
        const {email} = req.body;
        const project = await Project.findById(req.body.params);
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
       }
       // Only creator can add members
        if (project.createdBy.toString() !== req.user.id) {
           return res.status(403).json({ message: 'Only project creator can add members' });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user is not exist",
            })
        }
        if(project.teamMembers.includes(user._id)){
            return res.status(400).json({
                success:false,
                message:"team member already exist",
            })
        }
        project.teamMembers.push(user._id);
        return res.status(200).json({
            success:false,
            message:"team added successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// removeteam member
exports.removeTeamMember = async (req, res) =>{
    try{
        const project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({
                message:"Project not found",
            })
        }
        // only creater can remove
        if(project.createdBy.toString() !== req.user.id){
            return res.status(403).json({message:"only project creater can remove team member"});
        }
        // Cannot remove creator
        if (req.params.userId === project.createdBy.toString()) {
          return res.status(400).json({ message: 'Cannot remove project creator' });
        }
        project.teamMembers = project.teamMembers.filter(
             member => member.toString() !== req.params.userId
        )
        await project.save();
        return res.status(200).json({
            success:true,
            message:"team member removed successfully",
        })
    }catch(error){
        console.log(error);
        return res.status({
            success:false,
            message:error.message,
        })
    }
}