const express = require('express');
const router = express.Router();
const { getUsers, registerUser, loginUser, updateUser, getUserByIdController, deleteUser } = require('../controllers/UserController');

const { verifyToken } = require('../middleware/authMiddleware'); 

// === ROUTE PUBLIK (Boleh diakses siapa saja tanpa token) ===
router.post('/login', loginUser);
router.post('/register', verifyToken, registerUser);


// === ROUTE RAHASIA (Harus bawa Token) ===)

router.get('/pengguna', verifyToken, getUsers); 

router.get('/pengguna/:id', verifyToken, getUserByIdController);
router.put('/pengguna/:id', verifyToken, updateUser);
router.delete('/pengguna/:id', verifyToken, deleteUser);

module.exports = router;