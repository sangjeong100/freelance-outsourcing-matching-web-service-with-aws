const express = require('express');
var router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

router.get('/:post_type/index', async (req, res, next) => {
  
  //내림차순
  Post.find({post_type: req.params.post_type},null,{sort: {created_date: -1}})
  .then((posts) => {
    res.json({posts: posts});
  })
  .catch((err) =>{
    console.log(err);
    res.json({message: false});
  });
});

router.post('/create', (req, res, next)=>{
  try{
    User.findById(req.body.user_id).then((user) =>{

      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        writer_id: user._id,
        writer_name: user.name,
        post_type: req.body.post_type,
        modified_date: Date.now()
      });
  
      post.save();
      res.json({ message: "게시글이 업로드 되었습니다."});
    }   
    )
  }
  catch (err){
    console.log(err);
    res.json({message: false});
  }
});

router.get('/show/:id',(req,res,next) =>{
  Post.findById(req.params.id)
  .then((post)=>{
    User.findById(post.writer_id)
    .then((user)=>{
      
      post.hit++;
      post.save();
      res.json({ post: post,writer: user});
    })
    .catch((err)=>{
      res.json({message: "게시글 조회에 실패했습니다."});
    });
  })
  .catch((err)=>{
    console.log(err);
    res.json({message: "게시글 조회에 실패했습니다."});
  });
});

router.put('/update/:id',(req,res,next)=>{
  Post.findByIdAndUpdate(req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
      modified_date: Date.now()
    },
    (err, post)=>{
      res.json({ message: "게시글이 수정되었습니다. "});
    }
  ).catch((err) => {
    console.log(err);
    res.json({ message: false });
  });
});

router.delete('/delete/:id',(req, res, next) => {
  Post.findByIdAndRemove(req.params.id).then(()=>{
    res.json({ message: true});
  })
  .catch((err) =>{
    console.log(err);
    res.json({message: false});
  });
});

module.exports = router;


