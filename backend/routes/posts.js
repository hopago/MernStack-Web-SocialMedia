const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Create single post
router.post("/", async (req, res) => {

    const newPost = await new Post(req.body);

    try {
        
        const savedPost = await newPost.save();

        res.status(200).json(savedPost);

    } catch (err) {
        res.status(500).json(err);
    }

});

// Update single post
router.put("/:id", async (req, res) => {
    
    try {

    const post = await Post.findOne({ _id: req.params.id });

    if(req.body.userId === post.userId) {
        try {
        
            await post.updateOne({ $set: req.body });

            res.status(200).json("Post updated!");

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only update your own post!");
    }

    } catch(err) {
        res.status(500).json(err);
    }

});

// Delete single post
router.delete("/:id", async (req, res) => {

    try {
        
        const post = await Post.findOne({ _id: req.params.id });

        if(post.userId === req.body.userId) {

            await post.deleteOne();

            res.status(200).json("Post deleted!");

        } else {
            res.status(401).json("You can only delete your own post!");
        }

    } catch (err) {
        res.status(500).json(err);
    }

});

// Like&Dislike single post
router.put("/:id/like", async (req, res) => {

    try {
        
        const post = await Post.findOne({ _id: req.params.id });

        if(!post.likes.includes(req.body.userId)) {

            await post.updateOne({ $push: {likes: req.body.userId} });

            res.status(200).json("Post liked!");

        } else {

            await post.updateOne({ $pull: {likes: req.body.userId }});

            res.status(200).json("Post disliked!");

        }

    } catch (err) {
        res.status(500).json(err);
    }

});

// heart&disheart single posts
router.put("/:id/heart", async (req, res) => {

    try {
        
        const post = await Post.findOne({ _id: req.params.id });

        if(!post.hearts.includes(req.body.userId)) {

            await post.updateOne({ $push: {hearts: req.body.userId} });

            res.status(200).json("Post hearted!");

        } else {

            await post.updateOne({ $pull: {hearts: req.body.userId }});

            res.status(200).json("Post dishearted!");
            
        }

    } catch (err) {
        res.status(500).json(err);
    }

});

// Get Single post
router.get("/:id", async (req, res) => {

    try {
        
        const post = await Post.findOne({ _id: req.params.id });

        res.status(200).json(post);

    } catch (err) {
        res.status(500).json(err);
    }

});

// Get timeline posts
router.get("/timeline/:userId", async (req, res) => {

    let postArray = [];

    try {
        
        const currentUser = await User.findOne({ _id: req.params.userId });

        try {
            
            const userPosts = await Post.find({
                userId: currentUser._id
            });

            const friendPosts = await Promise.all(
                currentUser.followings.map(friendId => {
                    return Post.find({ userId: friendId });
                })
            );

            postArray = userPosts.concat(...friendPosts);

            res.status(200).json(postArray);

        } catch (err) {
            res.status(500).json(err);
        }

    } catch (err) {
        res.status(500).json(err);
    }

});

// Get profile posts
router.get("/profile/:username", async (req, res) => {

    try {

        const user = await User.findOne({
            username: req.params.username
        });
        
        const posts = await Post.find({
            userId: user._id
        });

        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json(err);
    }

});


module.exports = router;