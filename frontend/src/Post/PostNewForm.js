import React, { Component } from "react";
import CKEditor from "ckeditor4-react-advanced";
import { Button, Form} from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class PostNewForm extends Component {
  constructor(props){
    super(props);
    this.state= {
      content:"",
      post_type: "",
      title: ""
    }
  }

  componentDidMount() {
    //edit인 경우만 title 날라옴
    if (this.props.location.query.title !== undefined) {
      this.postTitle.value = this.props.location.query.title;
      this.setState({
        title: this.props.location.query.title,
        post_type: this.props.location.query.post_type,
      })
    }else{
      this.setState({
        post_type: this.props.location.query.post_type
      });
    }
  }

  componentWillMount(){
    //edit인 경우만 content query 존재
    if (this.props.location.query.content !== undefined) {
      this.setState({
        content: this.props.location.query.content,
      });
    }
    
  }

  createPost = () => {

    if(!$.cookie('user_unique_id')) {
      alert("로그인 후 가능합니다!!");
      window.location.href = "/";   
    }

    let url;
    let send_param;

    const postTitle = this.postTitle.value;
    const postContent = this.state.content;

    if (postTitle === undefined || postTitle === "") {
      alert("글 제목을 입력 해주세요.");
      this.postTitle.focus();
      return;
    } else if (postContent === undefined || postContent === "") {
      alert("글 내용을 입력 해주세요.");
      return;
    }
    
    if (this.props.location.query.content !== undefined) {
      url = `http://54.180.89.24:8080/post/update/${this.props.match.params.id}`;
      send_param = {
        headers,
        title: postTitle,
        content: postContent,
      };
      axios
        .put(url, send_param)
        //정상 수행
        .then(response => {
          if (response.data.message) {
            alert(response.data.message);
            this.props.history.goBack();
          } else {
            alert("글 수정 실패");
          }
        })
        //에러
        .catch(err => {
          console.log(err);
        });
    } else {
      url = "http://54.180.89.24:8080/post/create";
      send_param = {
        headers,
        user_id: $.cookie("user_unique_id"),
        title: postTitle,
        post_type: this.state.post_type,
        content: postContent
      };
      axios
        .post(url, send_param)
        //정상 수행
        .then(response => {
          if (response.data.message) {
            alert(response.data.message);
            this.props.history.goBack();
          } else {
            alert("글쓰기 실패");
          }
        })
        //에러
        .catch(err => {
          console.log(err);
        });

    }
  };

  onEditorChange = (e) => {
    this.setState({
      content: e.editor.getData()
    });
  };

  onChangeTitle = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  render() {
    const divStyle = {
      marginTop:"3%",
      minWidth:"70%", 
      minHeight:"700px"
    };
    const titleStyle = {
      marginBottom: 5
    };
    const buttonStyle = {
      marginTop: 5
    };

    return (
      <div className="container" style={divStyle}>
        <h2>글쓰기</h2>
        <Form.Control
          type="text"
          style={titleStyle}
          placeholder="글 제목"
          ref={ref => (this.postTitle = ref)}
          value={this.state.title}
          onChange={this.onChangeTitle}
        />
        <CKEditor
          data={this.state.content}
          onChange={this.onEditorChange}
        />
        <Button style={buttonStyle} onClick={this.createPost} block>
          저장하기
        </Button>
      </div>
    );
  }
}

export default PostNewForm;
