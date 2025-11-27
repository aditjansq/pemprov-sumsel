const express = require('express');
const router = express.Router();
const { getUsers, registerUser, loginUser, updateUser, getUserByIdController, deleteUser } = require('../controllers/UserController');

// Definisikan Endpoint
router.get('/pengguna', getUsers);
router.get('/pengguna/:id', getUserByIdController);
router.put('/pengguna/:id', updateUser);
router.delete('/pengguna/:id', deleteUser);

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;