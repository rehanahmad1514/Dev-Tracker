const express = require("express");
const router = express.Router();

const {auth} = require("../middleware/auth");
const {createTicket, allTicket, getSpesificTicket, updateTicket,deleteTicket,assignTicket} = require("../controller/ticket");

router.post('/', auth, createTicket);
router.get('/project/:projectId', auth, allTicket);
router.get('/:id', auth, getSpesificTicket);
router.put('/:id', auth, updateTicket);
router.delete('/:id', auth, deleteTicket);
router.put('/:id/assign', auth, assignTicket);
// Export the router to be used in the main app
module.exports = router;