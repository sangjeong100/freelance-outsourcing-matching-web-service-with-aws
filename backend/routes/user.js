const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Star = require("../models/star");
const crypto = require("crypto");

//사진 업로드
var AWS = require('aws-sdk');
let awskey = require("../config/aws");
let s3_url = "https://s3.ap-northeast-2.amazonaws.com/userprofileimg/";

//회원가입
router.post("/join", async (req, res) => {
  try {
    let obj = { login_id: req.body.loginId };

    let userIdCheck = await User.findOne(obj);
    
    obj = {email: req.body.email};
    let userEmailCheck = await User.findOne(obj);

    if (userIdCheck) {
      res.json({
        message: "아이디가 중복되었습니다. 새로운 아이디을 입력해주세요.",
        dupIdCheck: true
      });
    }
    else if (userEmailCheck){
      res.json({
        message: "이메일이 중복되었습니다. 새로운 이메일을 입력해주세요.",
        dupEmailCheck: true
      });
    }
    else {
      crypto.randomBytes(64, (err, buf) => {
        if (err) {
          console.log(err);
        } 
        else {
          //pw 암호화 sha 512 방식
          crypto.pbkdf2(
            req.body.password, buf.toString("base64"), 100000, 64, "sha512",
              async (err, key) => {
                if (err) {
                  console.log(err);
                } 
                else {
                  console.log(key.toString("base64"));
                  buf.toString("base64");
                  obj = {
                    login_id: req.body.loginId,
                    email: req.body.email,
                    name: req.body.name,
                    passwd: key.toString("base64"),
                    user_type: req.body.userType,
                    age: req.body.age,
                    career: req.body.career,
                    telphone: req.body.telphone,
                    salt: buf.toString("base64") //pw 복호화에 필요
                  };
                  let user = new User(obj);
                  await user.save();
                  res.json({ message: "회원가입 되었습니다!" });
                }
              }
          );
        }
      });
    }
  } 
  catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

//로그인
router.post("/login", async (req, res) => {
  try {
    //이메일 값으로 아이디가 존재하는지 확인
    await User.findOne({ login_id: req.body.loginId }, async (err, checkUser) => {
      if (err) {
        console.log(err);
      } 
      else {
        if (checkUser) {
          //아이디가 존재할 경우 이메일과 패스워드가 일치하는 회원이 있는지 확인
          //PW 암호화
          crypto.pbkdf2(req.body.password, checkUser.salt, 100000, 64, "sha512",
            async (err, key) => {
              if (err) {
                console.log(err);
              } 
              else {
                const obj = {
                  login_id: req.body.loginId,
                  passwd: key.toString("base64")
                };
                //pw맞는지 확인
                const user = await User.findOne(obj);
                if (user) {
                  // 있으면 로그인 처리
                  req.session.login_id = user._id;

                  res.json({
                    message: "로그인에 성공했습니다.",
                    _id: user._id,
                    login_id: user.login_id,
                    user_type: user.user_type,
                    email: user.email,
                    user_img_path: user.img_path,
                    s3_url: s3_url
                  });
                } 
                else { 
                  res.json({message: "아이디나 패스워드가 일치하지 않습니다."}); 
                }    
              }
            }
          );
        } 
        else {
          res.json({ message: "아이디나 패스워드가 일치하지 않습니다." });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "로그인 실패" });
  }
});

router.put("/:id/changePw", async (req,res) => {
  try{
    await User.findById(req.params.id , async (err, checkUser) => {
      if (err) {
        console.log(err);
      } 
      else {
        if (checkUser) {
          //아이디가 존재할 경우 패스워드가 일치하는지 확인
          //PW 암호화
          crypto.pbkdf2(req.body.currentPw, checkUser.salt, 100000, 64, "sha512",
            async (err, key) => {
              try{
                let inputPasswd= key.toString("base64");
                
                //pw맞는지 확인
                if(checkUser.passwd === inputPasswd){
                  //new PW 암호화
                  crypto.pbkdf2(req.body.newPw, checkUser.salt, 100000, 64, "sha512",
                    async (err, key) =>{
                      try{
                        let changedPasswd = key.toString("base64");

                        User.findByIdAndUpdate(req.params.id,{ passwd:changedPasswd})
                          .then(()=>{
                            res.json({check:true, message: "비밀번호 변경에 성공했습니다."});
                          })
                          .catch((err)=>{
                            console.log(err);
                            res.json({message: "비밀번호 변경에 실패했습니다."});
                          });

                      }
                      catch(err){
                        console.log(err);
                        res.json({message: "에러가 발생했습니다."});
                      }
                    });

                }
                else{
                  res.json({message: "비밀번호가 틀렸습니다."});
                }
              }
              catch(err){
                console.log(err);
                res.json({message: "에러가 발생했습니다."});
                
              }
            }
          );
        } 
        else {
          res.json({ message: "아이디나 패스워드가 일치하지 않습니다." });
        }
      }
    });
  }
  catch(err){
    console.log(err);
    res.json({ message: false});
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: true });
  });
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.put(`/update/:id`, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id,{
      age: req.body.age,
      telphone: req.body.telphone,
      career: req.body.career
    });
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getInfo", async (req,res) => {
  try{
    const user = await User.findById(req.body.user_id);
    if(user){
      let star = await Star.find({receiver_id: req.body.user_id, giver_id: req.body.req_user_id});
      if(star.length>0){
        res.json({ message: true, user: user, giveStar: true});
      }
      else{
        res.json({message: true, user: user, giveStar: false});
      }
    }
    else {
      res.json({message:false});
    }

  }
  catch(err){
    console.log(err);
    res.json({ message: false});
  }
});

router.post(`/:id/profile-upload`, async (req, res, next) =>{
  
  const file = req.files.file;
  //아마존 S3 설정
  AWS.config.region = 'ap-northeast-2';
  AWS.config.update({
    accessKeyId: awskey.AWSAccessKeyId,
    secretAccessKey: awskey.AWSSecretKey
  });

  var s3_params = {
    Bucket: 'userprofileimg',
    Key: `${file.name}`,
    ACL: 'public-read',
    ContentType: file.mimetype,
    Body: file.data
  };

  var s3_obj = new AWS.S3({ params: s3_params});
  s3_obj
    .upload()
    .on('httpUploadProgress', function(event){})
    .send((err,data) =>{

      User.findByIdAndUpdate(req.params.id,{
        img_path: data.key
      })
      .then((user) =>{
        res.json({message: true, img_path: data.key}); //파일 url 획득
        
      })
      .catch(err => {
        console.log(err);
        res.json({message: false});
      }) 
      
    });

});

//user 순위 획득
router.get("/:user_type/getRanking", (req, res) =>{
  User.find({user_type: req.params.user_type}).sort({"retained_star": -1})
  .then((users) =>{
    res.json({message: true, users: users});
  })
  .catch((err) => {
    console.log(err);
    res.json({message: false});
  });
})

//star 주기
router.post("/giveStar", async (req,res)=> {
  try{
    let findStar = await Star.findOne({receiver_id: req.body.receiver_id, giver_id: req.body.giver_id});
    if(findStar){
      await Star.findByIdAndRemove(findStar._id);
      let user =await User.findById(findStar.receiver_id);
      await user.retained_star--;
      user.save();

      res.json({message: true, user: user, giveStar: false});
    }
    else{
      let star = await new Star({
          receiver_id: req.body.receiver_id,
          giver_id: req.body.giver_id
        });
        
      await star.save();
      

      let user = await User.findById(star.receiver_id);
      await user.retained_star++;
      await user.save();
      
      res.json({message: true, user: user, giveStar: true});
    }
  }
  catch(err){
    console.log(err);
    res.json({message: false});
  }

  

});

module.exports = router;
