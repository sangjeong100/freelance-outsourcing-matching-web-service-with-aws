import React, { Component } from "react";
import { ButtonGroup, Button, Jumbotron, Image } from "react-bootstrap";
import CommentNewForm from "./CommentNewForm";
import CommentForm from "./CommentForm";
import UserProfileModal from "../User/UserProfileModal";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Moment from "moment";
import $ from 'jquery';
import {} from '../css/userProfile.css';

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const bucket = 'https://s3.ap-northeast-2.amazonaws.com/userprofileimg/';

class PostShow extends Component {
  state = {
    post: [],
    postType: "",
    boardName: "",
    user: '',
    userProfileModalShow: false,
  };

  componentDidMount() {
    if (this.props.match.params.id !== undefined) { 
      this.getShow();
    } else {
      window.location.href = "/";
    }
  }

  DateFormat = (date) =>{
    return Moment(date).format('YYYY-MM-DD hh:mm:ss');
  }

  deletePost = () => {
    const send_param = {
      headers
    };
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`http://54.180.89.24:8080/post/delete/${this.props.match.params.id}`, send_param)
        //정상 수행
        .then(response => {
          alert("게시글이 삭제 되었습니다.");
          this.goBack();
        })
        //에러
        .catch(err => {
          console.log(err);
          alert("글 삭제 실패");
        });
    }

  };

  //메뉴 분기
  Category = (post_type) =>{
    if(post_type === 'SUPER'){
      this.setState({
        postType: "SUPER",
        boardName: "공지사항"
      });
    }
    else if(post_type === 'DEVELOPER'){
      this.setState({
        postType: "DEVELOPER",
        boardName: "개발자 게시판"
      });
    }
    else if(post_type === 'COMPANY'){
      this.setState({
        postType: "COMPANY",
        boardName: "업체 게시판"
      });
     
    }
    else if(post_type === 'FREE'){
      this.setState({
        postType: "FREE",
        boardName: "자유 게시판"
      });
      
    }
  }
  //유저 프로필 show 컨트롤
  handleUserProfileShow = () =>{

    this.setState({

      userProfileModalShow: !this.state.userProfileModalShow
    });
  }

  //뒤로가기
  goBack = () => {
    this.props.history.goBack();
  }
  
  //post render
  getShow = () => {
    const send_param = {
      headers,
    };
    axios
      .get(`http://54.180.89.24:8080/post/show/${this.props.match.params.id}`, send_param)
      //정상 수행
      .then(response => {
        if (response.data.post) {

          const post = (
            <div>
              <h1>{response.data.post.title}</h1>
              <div className="row">
                <div onClick={this.handleUserProfileShow}  >
                  <Image className="userProfile" src={bucket + response.data.writer.img_path} width="25" height="25" style={{ border:"3px solid #fff", boxShadow: "0 0 16px rgb(221,221,221",marginLeft:"15px", cursor:"pointer"}} roundedCircle/>
                </div>
                <h6 style={{marginTop:"5px",marginLeft:"10px", fontWeight:"600"}}>{response.data.post.writer_name}( {response.data.writer.login_id} )</h6>
                <h6 style={{display: "inline-block", marginLeft: ".5em", color: "rgba(0,0,0,.4)", fontSize: ".875em",marginTop:"6px"}}>{this.DateFormat(response.data.post.modified_date)}</h6>
              </div>
              <hr/>
              <div style={{minHeight:"300px"}}>
                <p dangerouslySetInnerHTML={{ //ckeditor의 형식이 html이기 때문에 html형식으로 넣어줘야함
                          __html: response.data.post.content
                        }}>
                </p>
              </div>
                    {response.data.post.writer_id === Number($.cookie('user_unique_id')) || $.cookie('login_id') === 'admin'?  // 글을 쓴 유저거나 admin일때만 btn 활성화
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="secondary" onClick={this.goBack}>뒤로가기</Button>
                      <NavLink 
                        to={{ 
                          pathname: `/post/edit/${response.data.post._id}`,
                          query: {
                            title: response.data.post.title,
                            content: response.data.post.content
                          }
                        }}
                      >
                        <Button variant="secondary">
                          글 수정
                        </Button>
                      </NavLink>
                      <Button variant="secondary" onClick={this.deletePost}>글 삭제</Button>
                    </ButtonGroup>
                    : 
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="secondary" onClick={this.goBack}>뒤로가기</Button>
                    </ButtonGroup>
                    }
              <hr/>
              <CommentNewForm post_id={response.data.post._id}/>
              <CommentForm post_id={response.data.post._id}/>
          </div>
          );
          
          this.setState({
            post: post,
            user: response.data.writer
          });
          this.Category(response.data.post.post_type);
        } else {
          alert("글 상세 조회 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
    };
    
    render() {
      return (
        <div className="container" style={{marginTop:"3%"}}>
          <Jumbotron style={{backgroundColor:"#f0f2f4"}}>
          <h6 style={{color:"green"}} >[{this.state.boardName}]</h6>
          {this.state.post}
          </Jumbotron>
          {this.state.user?
          <UserProfileModal user={this.state.user} show ={this.state.userProfileModalShow} showHandler={this.handleUserProfileShow}/>
          :<></>}
        </div>
    )
  }
}

export default PostShow;
