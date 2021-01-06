import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import {Button, Grid,Card,Form, Segment, Image, Placeholder } from 'semantic-ui-react';
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = {withCredentioals: true};

class UserProfileModal extends Component {

  constructor(props){
    super(props);
    this.state = {
      user: '',
      imgPath: '',
      s3_url: 'https://s3.ap-northeast-2.amazonaws.com/userprofileimg/',
      giveStar: false,
    }
  }

  componentDidMount(){
    this.getUserInfo();
  }

  //user정보 가져오기
  getUserInfo = () => {
    const send_param = {
      headers,
      user_id: this.props.user,
      req_user_id: $.cookie('user_unique_id')
    }

    axios
      .post("http://54.180.89.24:8080/user/getInfo",send_param)

      .then((response) =>{
        if(response.data.message){
          let user = response.data.user;
          this.setState({ 
            user: user,
            imgPath: this.state.s3_url + response.data.user.img_path,
            giveStar: response.data.giveStar
          });        
        }
        else{
          alert("유저 프로필 조회가 실패했습니다.");
          window.location.href = '/';
        }
        
      })
      .catch( err => {
        console.log(err);
        window.location.href = '/';
      })
  }

  //give star
  giveStar = () =>{
     const send_param = {
      headers,
      receiver_id: this.state.user._id,
      giver_id: $.cookie("user_unique_id")
    }

    axios
      .post("http://54.180.89.24:8080/user/giveStar",send_param)
        .then((response) =>{
          if(response.data.message){
            let user = response.data.user;
            this.setState({
              user: user,
              giveStar: response.data.giveStar
            });      
          } 
          else{
            alert("유저 프로필 조회가 실패했습니다.");
            window.location.href = '/';
          }
          
        })
        .catch( err => {
          console.log(err);
          window.location.href = '/';
        })
    
  }

  render(){

    const starStyle ={
      width:"15px",
      height: "15px",
      marginBottom: "3.5px",
      display: "inline-block"
    }

    return (
      <div className="container">
      <Modal show={this.props.show} onHide={this.props.showHandler} style={{textAlign:"center"}} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            User Profile
          </Modal.Title>
        </Modal.Header>
      <Modal.Body>
        <Segment style={{marginBottom: "20px", marginTop: "20px"}}>
      
            <Grid doubling columns={2} style={{marginBottom:"3%",marginTop:"3%"}}>
              <Grid.Column>
              <Card key={this.state.user.name} style={{width:"280px"}} >
                <Image src={this.state.imgPath} style={{height: "280px", width: "280px"}}/>
                <Placeholder>
                  <Card.Description>User Image</Card.Description>
                </Placeholder>
                <Card.Content>
                  {this.state.user.name} ({this.state.user.login_id})
                </Card.Content>
              </Card>
              </Grid.Column>
              <Grid.Column>
                <Form> 
                  <Form.Group widths={2}>
                    <Form.Input label="email" type="text" value={this.state.user.email} readOnly={true}/>  
                    <Form.Input label="star" style={{textAlign:"right"}} type="text" value={this.state.user.retained_star} readOnly={true}/>                    
                    
                  </Form.Group>
                  <Form.Group widths={2}>
                    <Form.Input label="name" type="text" value={this.state.user.name} readOnly={true}/>
                    <Form.Input label="user type" type="text" value={this.state.user.user_type} readOnly={true}/>
                  </Form.Group>
                  <Form.Group widths={2}>
                    <Form.Input label="age" type="text" value={this.state.user.age} readOnly={true}/>
                    <Form.Input label="telphone" type="text" value={this.state.user.telphone} readOnly={true}/>
                  </Form.Group>
                  <Form.TextArea label='Career' readOnly={true}>{this.state.user.career}</Form.TextArea>
                  {this.state.user._id === Number($.cookie('user_unique_id'))?
                  <div></div>
                  :
                  <div>
                    <Button style={{ verticalAlign: "middle"}} onClick={this.giveStar} active>
                    {this.state.giveStar ?
                      <Image src="/img/yellowStar.png" style={starStyle}/>
                    : 
                      <Image src="/img/darkStar.png" style={starStyle}/>
                    }
                    <span style={{paddingLeft:"3px"}}>Give Star</span>
                    </Button>
                    <NavLink to={{ 
                      pathname: `/email/send`,
                      query:{receiverEmail: this.state.user.email}}}>
                      <Button style={{marginLeft:"5px",height:"40.5px"}}active>
                        Send Email
                      </Button>
                    </NavLink>
                  </div>
                  }
                
                  
                </Form>
              </Grid.Column>
            </Grid>
          </Segment>
        </Modal.Body>
      </Modal>
     
      </div>
    );
  };
}
export default UserProfileModal;
