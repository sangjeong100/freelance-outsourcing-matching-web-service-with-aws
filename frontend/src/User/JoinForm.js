import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import {} from "jquery.cookie"; //로그인, 로그아웃 처리 (쿠키값이 있으면 게시글 보여주고, 쿠키값 없으면 회원가입, 로그인 보여줌)
axios.default.withCredentials = true; // node.js server와 통신 구현 -> 동일 기원(host)가 아니여도 접근할 수 있도록 구현 
const headers = {withCredentials: true};// node.js server와 통신 구현 // front와 back의 주소가 다른문제 해결

class JoinForm extends Component {
  //회원가입
  join = () => {
    const joinId = this.joinId.value;
    const joinEmail = this.joinEmail.value;
    const joinName = this.joinName.value;
    const joinPw = this.joinPw.value;
    const UserType = this.userType.value;

    const age = this.age.value;
    const career = this.career.value;
    const telphone = this.telphone.value;

    
    const ageRegExp = /^[0-9]{1,3}$/;
    const telPhoneRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
    const idRegExp = /^[0-9a-zA-Z]{4,15}$/; 
    const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const pwRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    
    if (joinId === "" || joinId === undefined) {
      alert("가입할 아이디를 입력해주세요.");
      this.joinId.focus();
      return;
    } 
    else if (
      joinId.match(idRegExp) === null ||joinId.match(idRegExp) === undefined) {
      alert("아이디 형식에 맞게 입력해주세요.");
      this.joinId.value = "";
      this.joinId.focus();
      return;
    }
    
    if (joinEmail === "" || joinEmail === undefined) {
      alert("이메일 주소를 입력해주세요.");
      this.joinEmail.focus();
      return;
    } 
    else if (
      joinEmail.match(emailRegExp) === null ||joinEmail.match(emailRegExp) === undefined) {
      alert("이메일 형식에 맞게 입력해주세요.");
      this.joinEmail.value = "";
      this.joinEmail.focus();
      return;
    } 
    
    if (joinName === "" || joinName === undefined) {
      alert("이름을 입력해주세요.");
      this.joinName.focus();
      return;
    } 
    
    if (joinPw === "" || joinPw === undefined) {
      alert("비밀번호를 입력해주세요.");
      this.joinPw.focus();
      return;
    } 
    else if ( joinPw.match(pwRegExp) === null || joinPw.match(pwRegExp) === undefined) {
      alert("비밀번호를 숫자와 문자, 특수문자 포함 8~16자리로 입력해주세요.");
      this.joinPw.value = "";
      this.joinPw.focus();
      return;
    }

    if (UserType === "" || UserType === undefined) {
      alert("유저 타입(개발자, 업체)를 선택해주세요.");
      this.joinPw.focus();
      return;
    } 

    if(telphone.match(telPhoneRegExp) === null || telphone.match(telPhoneRegExp) === undefined){
      alert("핸드폰 형식을 맞게 입력해주세요.");
      this.telphone.value = "";
      this.telphone.focus();
      return;
    }

    if(age !==null && (age.match(ageRegExp) === null || age.match(ageRegExp) === undefined )){
      alert("나이는 숫자로만 입력하세요.");
      this.age.value = "";
      this.age.focus();
      return;
    }

    const send_param = {
      headers,
      loginId: joinId,
      email: joinEmail,
      name: joinName,
      password: joinPw,
      userType: UserType,
      age: age,
      career: career,
      telphone: telphone
    };
    axios
      .post("http://54.180.89.24:8080/user/join", send_param)
      //정상 수행
      .then(returnData => {
        if (returnData.data.message) {
          alert(returnData.data.message);

          //Id 중복 체크
          if (returnData.data.dupIdCheck) {
            this.joinId.value = "";
            this.joinId.focus();
          }
          //이메일 중복 체크
          else if (returnData.data.dupEmailCheck){
            this.joinEmail.value = "";
            this.joinEmail.focus();
          }
          //home으로 보내야함
          else {
            window.location.href="/";
          }
        }
        else {
          alert("회원가입 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const formStyle = {
      width: "80%"
    };
    const buttonStyle = {
      marginTop: 10
    };
    const centerStyle ={
      border:"solid 1px gray",
      marginLeft: "15%",
      marginRight: "15%",
      backgroundColor:"#FFFFFF"
    }

    return (
    <div style={{backgroundColor:"#edf1f1"}} >
      <center style={centerStyle }>
      <h1 style={{marginTop:"3%"}}>회원가입</h1>
      <Form  style={formStyle}>
        <Form.Group controlId="joinId">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="id"
            maxLength="30"
            ref={ref => (this.joinId = ref)}
            placeholder="ID ( 숫자와 문자포함 4~15 자리 ) (필수)"
          />
        </Form.Group>
        <Form.Group controlId="joinPw">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            maxLength="64"
            ref={ref => (this.joinPw = ref)}
            placeholder="Password (필수)"
          />
        </Form.Group>
        <Form.Group controlId="joinEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            maxLength="100"
            ref={ref => (this.joinEmail = ref)}
            placeholder="Enter email (필수)"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="joinUserType">
          <Form.Label>User Type</Form.Label>
          <Form.Control as="select" ref={ref => (this.userType = ref)}>
              <option>DEVELOPER</option>
              <option>COMPANY</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="joinName">
          <Form.Label>name</Form.Label>
          <Form.Control
            type="text"
            maxLength="20"
            ref={ref => (this.joinName = ref)}
            placeholder="name"
          />
        </Form.Group>
        <Form.Group controlId="joinAge">
          <Form.Label>age</Form.Label>
          <Form.Control
            type="text"
            maxLength="5"
            ref={ref => (this.age = ref)}
            placeholder="age"
          />
        </Form.Group>
        <Form.Group controlId="joinTelPhone">
          <Form.Label>telphone</Form.Label>
          <Form.Control
            type="text"
            maxLength="20"
            ref={ref => (this.telphone = ref)}
            placeholder="telphone (형식: xxx-xxxx-xxxx)"
          />
        </Form.Group>
        <Form.Group controlId="joinCareer">
          <Form.Label>Career</Form.Label>
          <Form.Control 
            as="textarea"
            rows={4}
            ref={ref => (this.career = ref)}
          />
        </Form.Group>
        <Form.Group controlId="joinBtn">
          <Button
            style={buttonStyle}
            onClick={this.join}
            variant="dark"
            type="button"
            block
          >
            회원가입
          </Button>
        </Form.Group>
      </Form>
      <br/>
      </center>
    </div>
    );
  }
}

export default JoinForm;
