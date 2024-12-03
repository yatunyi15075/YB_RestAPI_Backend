import express from 'express';
import { createUser, getUsers, updateUser, deleteUser } 
from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// User registration route
router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.get('/protected-route', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

router.get('/admins-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.status(200).json({ message: 'This route is for admins only'});
});

export default router;
