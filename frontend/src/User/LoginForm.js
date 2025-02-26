import React, { Component } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie"; //로그인, 로그아웃 처리 (쿠키값이 있으면 게시글 보여주고, 쿠키값 없으면 회원가입, 로그인 보여줌)
axios.default.withCredentials = true; // node.js server와 통신 구현 -> 동일 기원(host)가 아니여도 접근할 수 있도록 구현 
const headers = {withCredentials: true};// node.js server와 통신 구현 // front와 back의 주소가 다른문제 해결

class LoginForm extends Component {
  
  state = {
    show: false,
  }
  
  componentDidMount() {

  }

  //로그인
  login = () => {
    const loginId = this.loginId.value;
    const loginPw = this.loginPw.value;

    if (loginId === "" || loginId === undefined) {
      alert("아이디를 입력해주세요.");
      this.loginId.focus();
      return;
    } else if (loginPw === "" || loginPw === undefined) {
      alert("비밀번호를 입력해주세요.");
      this.loginPw.focus();
      return;
    }

    const send_param = {
      headers,
      loginId: this.loginId.value,
      password: this.loginPw.value
    };
    axios
      .post("http://54.180.89.24:8080/user/login", send_param)
      //정상 수행
      .then(response => {
        if (response.data.message === "로그인에 성공했습니다.") {
        
          $.cookie("user_unique_id", response.data._id, { expires: 1 });
          $.cookie("login_id", response.data.login_id, { expires: 1 });
          $.cookie("user_type",response.data.user_type, {expires: 1});
          $.cookie("email",response.data.email,{ expires: 1});
          $.cookie("telphone",response.data.telphone, {expires: 1});
          alert(response.data.message);
          window.location.href="/";
        } 
        else {
          alert(response.data.message);
          this.loginId.value = "";
          this.loginPw.value = "";
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.login();
    }
  };

  render() {
    const buttonStyle = {
      marginTop: 10
    };

    return (
      <Modal show={this.props.show} onHide={this.props.showHandler}>
      <Modal.Header closeButton>
      <Modal.Title>로그인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form className="container">
        <Form.Group>
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="id"
            maxLength="20"
            ref={ref => (this.loginId = ref)}
            placeholder="Enter ID"
            onKeyPress={this.handleKeyPress}
          />
          <br/>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            maxLength="20"
            ref={ref => (this.loginPw = ref)}
            placeholder="Password"
            onKeyPress={this.handleKeyPress}
          />
          <Button
            style={buttonStyle}
            onClick={this.login}
            variant="dark"
            type="button"
            block
          >
            로그인
          </Button>
        </Form.Group>
      </Form>
      </Modal.Body>
      </Modal>
     
    );
  }
}

export default LoginForm;
