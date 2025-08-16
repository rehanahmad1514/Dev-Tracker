const Ticket = require("../model/ticket");
const Project = require("../model/project");

exports.createTicket = async (req, res) => {
    try{
        const project = await Project.findById(req.body.projectId);

        if(!project){
            return res.status(404).json({
                success:false,
                message:'Project not found',
            })
        }

        // Check if user has access to the project
        if (!project.teamMembers.includes(req.user.id) && project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const ticket = new Ticket({
            ...req.body,
            createdBy:req.user.id,
        })
        await ticket.save();
        return res.status(200).json({
            success:true,
            message:"ticket created successfully",
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//  Get all tickets for a project
exports.allTicket = async (req, res) => {
    try{
        const project = await Project(req.prams.projectId);
        if(!project){
            return res.status(404).json({
                success:false,
                message:"project not found",
            })
        }

        // cheack user has access to project
        if(!project.teamMembers.includes(req.user.id) && project.createdBy.toString() !==  req.user.id){
            return res.status(403).json({
                message:"Access denied",
            })
        }
        const ticket = await Ticket.find({projectId: req.params.projectId})
                       .populate('assignee', 'name email')
                       .populate('createdBy', 'name email');
        return res.status(200).json({
            success:true,
            ticket:ticket,
            message:"all project finded successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// Get a specific ticket
exports.getSpesificTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const project = await Project.findById(ticket.projectId);
    
    // Check if user has access to the project
    if (!project.teamMembers.includes(req.user.id) && project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// update ticket
exports.updateTicket = async (req, res) =>{
    try{
        const ticket = await Ticket.findById(req.params.id);

        if(!ticket){
            return res.status(404).json({
                success:false,
                message:"ticket is not founded",
            })
        }
        const project = await Project.findById(ticket.projectId);

         // Check if user has access to the project
        if (!project.teamMembers.includes(req.user.id) && project.createdBy.toString() !== req.user.id) {
           return res.status(403).json({ message: 'Access denied' });
        }

        Object.assign(ticket, req.body);
        await ticket.save();
        return res.status(200).json({
            success:true,
            message:"Update ticket successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// Delete Ticket
exports.deleteTicket = async (req, res) => {
    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket){
            return res.status(404).json({nessage:"ticket not found"})
        }

        const project = await Project.findById(ticket.projectId);
         // Only project creator or ticket creator can delete
        if (project.createdBy.toString() !== req.user.id && ticket.createdBy.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Access denied' });
        }

         
        await ticket.remove();
        return res.status(200).json({
            success:false,
            message:"Ticket remove successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// Assign Ticket 
exports.assignTicket = async (req, res) =>{
    try{
        const { assigneeId } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
          return res.status(404).json({ message: 'Ticket not found' });
        }
        const project = await Project.findById(ticket.projectId);

        // Check if user has access to the project
        if (!project.teamMembers.includes(req.user.id) && project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
         // Check if assignee is a project member
        if (!project.teamMembers.includes(assigneeId)) {
          return res.status(400).json({ message: 'Assignee must be a project member' });
        }
         ticket.assignee = assigneeId;
         await ticket.save();
         return res.status(200).json({
            success:true,
            message:"ticket assigned successfully",
         })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}