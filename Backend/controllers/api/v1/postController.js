const Post = require("../../../models/Post");
const User = require('../../../models/User')
//create post
module.exports.creatPost = async (req, res) => {
  try {
    // const newpost = new Post(req.body);
    // const savedPost = await newpost.save();
    //OR
    const newpost = await Post.create(req.body);
    res.status(200).json({
      message: "post created successfully",
      post: newpost,
    });
  } catch (error) {
    res.status(500).json("Error in creating post");
  }
};
//update post
module.exports.UpdatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id);
    if (post.userId == req.body.userId) {
      //In your code snippet, you are comparing the userId of the post (post.userId) with the userId provided in the request body (req.body.userId) to determine if the user has permission to update the post.
      await post.updateOne({ $set: req.body });
      res.status(200).json("post Updated Successfully");
    } else {
      res.status(403).json("You cannot update this post");
    }
  } catch (error) {
    res.status(500).json("Error in updating post");
  }
};
//delete post
module.exports.DeletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId == req.body.userId) {
      //In your code snippet, you are comparing the userId of the post (post.userId) with the userId provided in the request body (req.body.userId) to determine if the user has permission to update the post.
      await post.deleteOne();
      res.status(200).json("post deleted Successfully");
    } else {
      res.status(403).json("You cannot delete this post");
    }
  } catch (error) {
    res.status(500).json("Error in deleting post");
  }
};
//like post
module.exports.LikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Now i will find wheather this post's like array has the userId or not
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json(`Post is liked successfully`);
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json(`Post is unliked successfully`);
    }
  } catch (error) {
    res.status(500).json("Error in liking post");
    console.log(error);
  }
};
//get a post
module.exports.GetPost=async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(403).json("Unable to get the post")
        }
        return res.status(200).json(post)
    } catch (error) {
      console.log(error)
        return res.status(500).json("Error in getting a post")
    }
}
//get timeline posts :user's followings all post
module.exports.GetTimlinePost = async(req,res)=>{
    try {
        const currentUser = await User.findById(req.params.userId)
        // Fetching all posts by the user
        const userPost = await Post.find({userId:currentUser._id})
        // Fetching all posts by user's friends
        const friendPost = await Promise.all(
            currentUser.following.map((friendId)=>{
              return  Post.find({userId:friendId})
            })
        )
        // Combining user's posts and friend's posts
     return res.status(200).json(userPost.concat(...friendPost))


    } catch (error) {
        return res.status(500).json("Error in getting posts")
    }
}
//get user's all posts
module.exports.GetUserPost = async (req, res) => {
  try {
      const user = await User.findOne({ username: req.params.username }); // Using findOne to find user by username
      if (!user) {
          return res.status(404).json("User not found");
      }

      const posts = await Post.find({ userId: user._id });
      return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
      return res.status(500).json("Error in getting user's posts");
  }
};
