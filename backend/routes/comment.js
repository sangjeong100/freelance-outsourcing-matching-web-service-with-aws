const express = require('express');
var router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');


router.get(`/index/post_id=:post_id`, async (req, res, next) => {
  try{
    //내림차순
    comments = await Comment.find({post_id: req.params.post_id},null,{sort: {created_date: -1}})
    datas = [];
    
    for(let i=0;i<comments.length;i++){
      let user = await User.findById(comments[i].user_id);
      datas.push({
        comment: comments[i],
        user: user
      })
    }
    res.json({commentAndUserInfos: datas});  
  }
  catch(err){
    console.log(err);
    res.json({message: false});
  }
     
});

router.post('/create', async (req, res, next)=>{
  try{
    User.findById(req.body.user_id)
    .then((user) =>{
      
      Post.findById(req.body.post_id)
      .then((post) =>{
        const comment = new Comment({
          content: req.body.content,
          user_id: user._id,
          post_id: post._id,
          modified_date: Date.now()
        });
        comment.save();
        res.json({ message: "댓글을 작성하셨습니다."});
      })

    }   
    )
  }
  catch (err){
    console.log(err);
    res.json({message: false});
  }
});

router.put('/update/:id',(req,res,next)=>{
  Comment.findByIdAndUpdate(req.params.id,
    {
      content: req.body.content,
      modified_date: Date.now()
    },
    (async (err)=>{
      try{
      comment = await Comment.findById(req.params.id);
      res.json({ comment: comment, message: true});
      }
      catch(err){
        console.log(err);
        res.json({ message: false });
      }
    })
  )
  .catch((err) => {
    console.log(err);
    res.json({ message: false });
  });
});

router.delete('/delete/:id',(req, res, next) => {
  Comment.findByIdAndRemove(req.params.id).then(()=>{
    res.json({ message: true});
  })
  .catch((err) =>{
    console.log(err);
    res.json({message: false});
  });
});

module.exports = router;


