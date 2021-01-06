import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import {} from "../css/commentForm.css";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class CommentNewForm extends Component {
  componentDidMount() {
  }

  createComment = () => {

    if(!$.cookie('user_unique_id')) {
      alert("로그인 후 가능합니다!!");
      window.location.href = "/";   
    }
    let url;
    let send_param;

    const CommentContent = this.comment.value;

    if (CommentContent === undefined || CommentContent === "") {
      alert("댓글 내용을 입력 해주세요.");
      CommentContent.focus();
    }
      url = "http://54.180.89.24:8080/comment/create";
      send_param = {
        headers,
        user_id: $.cookie("user_unique_id"),
        post_id: this.props.post_id,
        content: CommentContent
      };


    axios
      .post(url, send_param)
      //정상 수행
      .then(response => {
        if (response.data.message) {
          alert(response.data.message);
          window.location.reload();
        } else {
          alert("댓글작성 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  onEnterPress = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.createComment();
    }
  }


  render() {
    

    return (
      <div className="comment_div">
        <h4>Comment</h4>
          <div className='comment_write'>
            <textarea 
              rows='3'
              ref={ref => (this.comment = ref)}
              maxLength='100'
              placehoder='150자 이내의 댓글을 입력해주세요.'
              onKeyDown={this.onEnterPress}
            >
            </textarea>
            <input type='button' id='comment_submit_button' value='등록' onClick={this.createComment} /> 
          </div>
      </div>
    );
  }
}

export default CommentNewForm;
