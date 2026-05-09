const express = require('express')

const router =  express.Router()
const authMiddleware = require('../middlewares/auth_middleware');
const { registerUser,loginUser ,getUserProfile,addAddress,removeAddress,updateUserProfile} = require('../controllers/user_controller');

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile/edit', authMiddleware, updateUserProfile);
router.post('/profile/address', authMiddleware, addAddress); //
router.delete('/profile/address', authMiddleware, removeAddress); //
module.exports=router;