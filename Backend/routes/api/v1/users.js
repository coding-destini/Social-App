const router = require('express').Router();
const UserControllers = require('../../../controllers/api/v1/userController')
const User = require('../../../models/User')

router.post('/register',UserControllers.createUser)
router.post('/SignIn',UserControllers.signIn)
router.put('/update/:id',UserControllers.UpdateUser)
router.delete('/delete/:id',UserControllers.DeleteUser)
router.get('/',UserControllers.GetUser)
router.put('/:id/follow',UserControllers.follow)
router.put('/:id/unfollow',UserControllers.unfollow)
router.get('/friends/:userId',UserControllers.getFriends)

router.put('/updateProfilePicture', async (req, res) => {
    const { userId, profilePicture } = req.body;
    console.log("Received userId:", userId);
console.log("Received profilePicture:", profilePicture);

    try {
      // Update profilePicture in the database
      await User.findByIdAndUpdate(userId, { profilePicture });
      res.status(200).json("Profile picture updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json("Error updating profile picture");
    }
  });
  
  router.put('/updateCoverPicture', async (req, res) => {
    const { userId, coverPicture } = req.body;
    try {
      // Update coverPicture in the database
      await User.findByIdAndUpdate(userId, { coverPicture });
      res.status(200).json("Cover picture updated successfully");
    } catch (error) {
      res.status(500).json("Error updating cover picture");
    }
  });
  
module.exports=router;