import React, {Component} from "react";
import {} from "react-bootstrap";
import {Button, Grid,Card,Form, Segment, Image, Placeholder  } from 'semantic-ui-react';
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import PwChangeModalForm from "./PwChangeModal";
import ImageUploader from "react-images-upload";
axios.defaults.withCredentials = true;
const headers = {withCredentioals: true};

class UserPageForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      user: '',
      age: '',
      telphone: '',
      career: '',
      email: '',  
      pictures: [],
      imgPath: '',
      s3_url: 'https://s3.ap-northeast-2.amazonaws.com/userprofileimg/',
      pwChangeModalShow: false,
      userDeleteModalShow: false,
      hidden: '',
      retained_star: ''
    }
    this.onDrop = this.onDrop.bind(this);
  }

  handlePwChangeModalShow = () =>{
    this.setState({
      pwChangeModalShow: !this.state.pwChangeModalShow
    });
  
  }

  async onDrop(pictureFiles, pictureDataURLs) {
    try{
      await this.setState({
        pictures: this.state.pictures.concat(pictureFiles)
      });
      this.fileUploadHandler();
    }
    catch(err){
      console.log(err);
    }
    
  }

  fileUploadHandler = () => {
    const data = new FormData();
    data.append('file',this.state.pictures[0]); //key value 저장 후 전송
    data.append('filename',this.state.pictures[0].name);
    axios.post(`http://54.180.89.24:8080/user/${this.state.user._id}/profile-upload`, data)
    .then( response => { //응답받은 url 저장
        this.setState({
          imgPath: this.state.s3_url + response.data.img_path
        });
	this.setState({
	  pictures: []
   	 });
    });
    return;
  }

  componentDidMount(){
    this.getUserInfo();
  }

  getUserInfo = () => {
    const send_param = {
      headers,
      user_id: $.cookie("user_unique_id")
    }

    axios
      .post("http://54.180.89.24:8080/user/getInfo",send_param)
      .then((response) =>{
        if(response.data.message){
          let user = response.data.user;
          this.setState({ 
            user: user,
            age: user.age,
            telphone: user.telphone,
            career: user.career,
            email: user.email,
            imgPath: this.state.s3_url + user.img_path
          });          
        }
        else{
          alert("유저정보 조회가 실패했습니다.");
          window.location.href = '/';
        }
        
      })
      .catch( err => {
        console.log(err);
        window.location.href = '/';
      })
  }

  //change 체크
  handleAgeChange = (e) =>{
    this.setState({
      age: e.target.value
    });
  }
  handleTelphoneChange = (e) =>{
    this.setState({
      telphone: e.target.value
    });
  }
  handleCareerChange = (e) =>{
    this.setState({
      career: e.target.value
    });
  }
  handleEmailChange = (e) =>{
    this.setState({
      email: e.target.value
    })
  }

  handleHidden = (e) =>{
    this.setState({
      hidden: e.target.value
    })
  }

  handleUserTypeChange = (e) => {
    this.setState({
      user: this.state.user
    })
  }
  handleUserNameChange = (e) =>{
    this.setState({
      user: this.state.user
    })
  }
  userInfoUpdate = () =>{

    const telPhoneRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
    const ageRegExp = /^\d{1,3}$/;
    const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    
    if (this.state.email === "") {
      alert("이메일 주소를 입력해주세요.");
      return;
    } 
    else if (this.state.email.match(emailRegExp) === null ||this.state.email.match(emailRegExp) === undefined) {
      alert("이메일 형식에 맞게 입력해주세요.");
      this.setState({
        email: ""
      });
      return;
    }

    if(this.state.telphone.match(telPhoneRegExp) === null || this.state.telphone.match(telPhoneRegExp) === undefined){
      alert("핸드폰 형식을 맞게 입력해주세요.");
      this.setState({
        telphone: ""
      });
      return;
    }
    
    if(this.state.age !=='' && (this.state.age.match(ageRegExp)=== null || this.state.age.match(ageRegExp)=== undefined )){
      alert("나이는 숫자로만 입력하세요.");
      this.setState({
        age: ""
      });
      return;
    }

    const send_param = {
      headers,
      age: this.state.age,
      telphone: this.state.telphone,
      career: this.state.career,
      email: this.state.eamil
    }

    axios
      .put(`http://54.180.89.24:8080/user/update/${this.state.user._id}`,send_param)
        .then((response) => {
          if(response.data.message){
            $.removeCookie("email");
            $.cookie("email",this.state.email,{ expires: 1});
            $.removeCookie("telphone");
	    $.cookie("telphone",this.state.telphone,{ expires: 1});
            alert("유저정보 업데이트에 성공했습니다.");
            window.location.href = '/';
          }
        })
        .catch( (err) => {
          console.log(err);
          alert("유저정보 업데이트에 실패했습니다.");
            window.location.href = '/';

        });
  }

  //유저 삭제 루틴 
  userDeleteCheck = () =>{
    if(window.confirm('정말 회원탈퇴를 하시겠습니까?')){
      this.userDelete();
    }
    else{
      return;
    }
  }

  userDelete = () => {
    const send_param = {
      headers,
    }

    axios
      .delete(`http://54.180.89.24:8080/user/delete/${this.state.user._id}`,send_param)
        .then((response) => {
          if(response.data.message){
            $.removeCookie("user_unique_id");
            $.removeCookie("login_id");
            $.removeCookie("user_type");
            $.removeCookie("email");
            $.removeCookie("telphone");
            alert("회원탈퇴에 성공했습니다.");  
            window.location.href = '/';
          }
        })
        .catch( (err) => {
          console.log(err);
          alert("회원탈퇴에 실패했습니다.");
          return;
        });

  }

  onChange = (e) => {
    this.setState({
      retained_star: e.target.value
    })
  }

  render(){
    return (
      <div className="container">
      
        <center>
        <Segment style={{marginBottom: "20px", marginTop: "20px", width: "80%" }}>
      
                <Grid doubling columns={2} style={{marginBottom:"3%",marginTop:"3%"}}>
                  <Grid.Column>
                  <Card key={this.state.user.name} style={{width:"280px"}} >
                    <Image src={this.state.imgPath} style={{height: "280px", width: "280px"}}/>
                    <Placeholder>
                      <Card.Description>User Image</Card.Description>
                    </Placeholder>
                    <Card.Content>
                      <ImageUploader
                              withIcon={false}
                              buttonText="유저 이미지 변경"
                              onChange={this.onDrop}
                              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                              maxFileSize={5242880}
                              withLabel={false}
                              singleImage ={true}
                            />
                    </Card.Content>
                     
                  </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Form> 
                  <Form.Group widths={2}>
                    <Form.Input  label="email" name="email" type="text" value={this.state.email} onChange={this.handleEmailChange} />                  
                    <Form.Input label="star" style={{textAlign:"right"}} type="text" value={this.state.user.retained_star} onChange={this.onChange} readOnly={true}/>                    
                    </Form.Group>
                <Form.Group widths={2}>
                  <Form.Input label="name" name="user_name"type="text" value={this.state.user.name} onChange={this.handleUserNameChange} readOnly={true}/>
                  <Form.Input label="user type" name="user_type" type="text" value={this.state.user.user_type} onChange={this.handleUserTypeChange} readOnly={true}/>
                </Form.Group>
                <Form.Group widths={2}>
                  <Form.Input label="age" name="age" type="text"  value={this.state.age} onChange={this.handleAgeChange}/>
                  <Form.Input label="telphone" name="telphone" type="text"  value={this.state.telphone} onChange={this.handleTelphoneChange}/>
                </Form.Group>
                  <Form.TextArea label='Career' name="career" value={this.state.career} onChange={this.handleCareerChange} />
                <Button onClick={this.handlePwChangeModalShow} active>
                  비밀번호 변경
                </Button>
                <Button onClick={this.userInfoUpdate} active>
                  회원정보 수정
                </Button>
                <Button onClick={this.userDeleteCheck} active>
                  회원 탈퇴
                </Button>
                </Form>
                </Grid.Column>
                </Grid>
          </Segment>
          <PwChangeModalForm show = {this.state.pwChangeModalShow} showHandler={this.handlePwChangeModalShow}/>
        </center>
      </div>
    );
  };
}
export default UserPageForm;
