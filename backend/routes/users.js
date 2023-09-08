const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
router.post("/auth/register", async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });

    try {

      const user = await newUser.save();

      const {password, ...userInfo} = user._doc;

      res.status(200).json(userInfo);

    } catch(err) {
        res.status(500).json(err);
    }

});

// Login
router.post("/auth/login", async (req, res) => {

    try {
        
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(403).send("Wrong email or password!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send("Wrong email or password!");

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json(err);
    }

});

// Update User
router.put("/:id", async (req, res) => {

    try {
        
        if(req.body.userId === req.params.id || req.body.isAdmin) {

            if(req.body.password) {
                try {

                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);

                } catch (err) {
                    res.status(500).json(err);
                }
            }

            try {
                
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                });

                res.status(200).json("Account Updated!");

            } catch (err) {
                res.status(500).json(err);
            }

        } else {
            return res.status(401).json("You can only update your own account!")
        }

    } catch (err) {
        res.status(500).json(err);
    }

});

// Delete user
router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            
            await User.deleteOne({ _id: req.params.id });

            res.status(200).json("User Deleted!")

        } catch (err) {
            res.status(403).json(err);
        }
    } else {
        res.status(403).json("You can only delete your own account!");
    }

});

// Get One User
router.get("/", async (req, res) => {

    const userId = req.query.userId;
    const username = req.query.username;

    try {
        
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });

        const { password, isAdmin, ...userInfo } = user._doc;

        res.status(200).json(userInfo);

    } catch (err) {
        res.status(500).json(err);
    }

});

// Get Friends
router.get("/friends/:userId", async (req, res) => {

    try {

      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );

      let friendList = [];

      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });

      res.status(200).json(friendList);

    } catch (err) {
      res.status(500).json(err);
    }
    
  });

// Follow a User
router.put("/:id/follow", async (req, res) => {

    if(req.body.userId !== req.params.id) {

        try {
            
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)) {
                try {
                    
                    await user.updateOne({
                        $push: { followers: req.body.userId }
                    });

                    await currentUser.updateOne({
                        $push: { followings: req.params.id }
                    });

                    res.status(200).json("Following Success!");

                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(401).json("You already follow this user!");
            }

        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        res.status(403).json("You can't follow yourself!");
    }

});

// Unfollow User
router.put("/:id/unfollow", async (req, res) => {

    if(req.body.userId !== req.params.id) {
        
        try {
            
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)) {
                try {
                    
                    await user.updateOne({
                        $pull: { followers: req.body.userId }
                    });

                    await currentUser.updateOne({
                        $pull: { followings: req.params.id }
                    });

                    res.status(200).json("Unfollow Success!");

                } catch (err) {
                    res.status(500).json(err);
                }
            }

        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        res.status(403).json("You can't unfollow yourself!");
    }

});


module.exports = router;