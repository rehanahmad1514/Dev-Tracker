const express = require("express");
const router = express.Router();

const {auth} = require("../middleware/auth");
const {createProject,projectDetail,getSpecificProject,updateProject} = require("../controller/project");
const {deleteProject, addTeamMember, removeTeamMember} = require("../controller/project");

router.post('/', auth, createProject);
router.get('/', auth, projectDetail);
router.get('/:id',auth, getSpecificProject);
router.put('/:id',auth, updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/:id/members',auth, addTeamMember);
router.delete('/:id/members/:userId', auth, removeTeamMember);


// Export the router to be used in the main app
module.exports = router;