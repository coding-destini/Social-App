const router = require('express').Router();
const postController = require('../../../controllers/api/v1/postController');

router.post('/createpost',postController.creatPost)
router.put('/updatepost/:id',postController.UpdatePost)
router.delete('/deletepost/:id',postController.DeletePost)
router.put('/likepost/:id',postController.LikePost)
router.get('/getpost/:id',postController.GetPost)
router.get('/timeline/:userId',postController.GetTimlinePost)
router.get('/profile/:username',postController.GetUserPost)
module.exports = router;