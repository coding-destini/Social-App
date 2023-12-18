const User = require("../../../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//create User || Sign up
module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    //check if email is already in Database
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.json(400, { message: "Email is already takes" });
    }
    //bcrypting password
    const hashpassword = bcrypt.hashSync(password, saltRounds);
    //creating user
    const user = await User.create({
      username: username,
      email: email,
      password: hashpassword,
    });
    //success respones
    return res.json(200, {
      message: "User created Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "Internal server error while creating User",
    });
  }
};

//Log in || Sign in
module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    //3: check weather user exist or not
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        data: {},
      });
    }

    const validPassword = await bcrypt.compareSync(password, user.password);
    //4.1: if not match -> name/email is incorrect
    if (!validPassword) {
      return res.status(400).json({
        message: "email or Password is incorrect",
        data: {},
      });
    }

    return res.status(200).json({
      message: "User Sign In Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error while signing in user",
    });
  }
};

//update user
module.exports.UpdateUser = async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {

      if (req.body.password) {
        try {
          req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        } catch (error) {
          return res.status(500).json({
            message: "Internal server error",
          });
        }
      }


      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      return res.status(200).json(
        {
          message: "User updated successfully",
        }
      );
    }
    catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Error while updating the user",
      });
    }
  }
  else {
    return res.status(403).json("You can Update only your account");
  }
};

//delete user
module.exports.DeleteUser = async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {


      const user = await User.findByIdAndDelete(req.params.id)
      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      return res.status(200).json(
        {
          message: "User deleted successfully",
        }
      );
    }
    catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Error while updating the user",
      });
    }
  }
  else {
    return res.status(403).json("You can delete only your account");
  }
};

//get a user
module.exports.GetUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    const username = req.query.username;
    const user = userId 
    ?await User.findById(userId) :
    await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc; //This line of code is using object destructuring in JavaScript to extract specific properties from the user._doc object.
    res.status(200).json(other)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Error while getting the user",
    });
  }
}

//follow a user
module.exports.follow = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); // The another user
      const currentUser = await User.findById(req.body.userId); //The login user Who wants to follow
     console.log(user)
     console.log(currentUser)
     
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } })
        await currentUser.updateOne({ $push: { following: req.params.id } })
        return res.status(200).json(`${currentUser.name} is now following ${user.name}`);
      } else {
        return res.status(403).json("You already follow this user")
      }
    } catch (error) {
      return res.status(500).json(error)
    }

  } else {
    return res.status(403).json("You cannot follow yourself");
  }
}

//unfollow a user
module.exports.unfollow = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); // The another user
      const currentUser = await User.findById(req.body.userId); //The login user Who wants to follow
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { following: req.params.id } })
        return res.status(200).json(`${user.name} unfollowed by ${currentUser.name} `);
      } else {
        return res.status(403).json("You don't follow this user")
      }
    } catch (error) {
      console.log("Unfollow",error)
      return res.status(500).json(error)
    }

  } else {
    
    return res.status(403).json("You cannot unfollow yourself");
  }
}

//get friends
module.exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId)
      })
    )
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture })
    })
    return res.status(200).json(friendList);
  } catch (error) {
    return res.status(500).json(error)
  }
}