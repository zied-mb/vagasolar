const express = require('express');
const router  = express.Router();
const {
  getProjects,
  getProjectById,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',        getProjects);                 // GET  /api/projects
router.get('/all',     protect, getAllProjects);      // GET  /api/projects/all  (admin)
router.get('/:id',     getProjectById);              // GET  /api/projects/:id (public)
router.post('/',       protect, createProject);      // POST /api/projects
router.put('/:id',     protect, updateProject);      // PUT  /api/projects/:id
router.delete('/:id',  protect, deleteProject);      // DEL  /api/projects/:id

module.exports = router;
