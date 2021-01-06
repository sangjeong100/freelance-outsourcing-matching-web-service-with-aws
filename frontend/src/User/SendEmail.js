import React, { Component } from "react";
import { Button, Form} from "react-bootstrap";
import $ from "jquery";
import {} from "jquery.cookie";
import emailjs ,{ init } from 'emailjs-com';
import emailObj from '../config/email';
import axios from 'axios';

init(emailObj.init);

class SendEmail extends Component {
  constructor(props){
    super(props);
    this.state = {
      title: '',
      content: '',
      receiverEmail: '',
      showLoader: "none",
      sender: ''
    }
    this.handleChangeReceiverEmail = this.handleChangeReceiverEmail.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  componentDidMount() {
    if(!$.cookie('user_unique_id')) {
      alert("로그인 후 가능합니다!!");
      window.location.href = "/";   
    }
    if (this.props.location.query !== undefined) {
      this.setState({
        receiverEmail: this.props.location.query.receiverEmail
      });
      this.getSenderInfo();
    } else {
      alert("error");
      window.location.href = "/";
    }
  }

  getSenderInfo = () => {
    axios
      .post("http://54.180.89.24:8080/user/getInfo", {user_id: $.cookie('user_unique_id')})      
	.then((response) => {
              if(response.data.message){
                this.setState({	
		  sender: response.data.user	
		});
              }
        })
        .catch(err =>{
	        alert("에러 발생 관리자에게 문의하세요.");
	        window.location.href= '/';
	});

  }

  sendEmail = () => {



    const emailContent = this.emailContent.value;
    const receiverEmail = this.receiverEmail.value;

    if (emailContent === undefined || emailContent === "") {
      alert("메일 내용을 입력 해주세요.");
      this.emailContent.focus();
      return;
    } 
    else if (receiverEmail === undefined || receiverEmail === ""){
      alert("receiver Email을 입력해주세요.");
       this.receiverEmail.focus();
      return;

    }
    else {
      this.setState({
        showLoader: "block"
      });
    }
    const templateId = emailObj.templateId;
    const serviceId = emailObj.serviceId;

    const emailParam = {
      sender_email: this.state.sender.email,
      sender_telphone: this.state.sender.telphone,
      sender_star: this.state.sender.retained_star,
      sender_type: this.state.sender.user_type,
      message: this.state.content,
      reply_to: this.state.sender.email,
      receiver_email: this.state.receiverEmail
    }

    emailjs.send(serviceId,templateId,emailParam)
      .then(async (result) =>{
        await this.setState({showLoader: "none"});

        alert("이메일 전송에 성공했습니다.");
        this.props.history.goBack();
        
      })
      .catch((err) =>{
        alert(err);
      })

  
  };

  handleChangeReceiverEmail = (e) =>{
    this.setState({
      receiverEmail: e.target.value
    });
  }

  handleChangeContent = (e) => {
    this.setState({
      content: e.target.value
    });
  };

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

    const spinnerStyle = {
      position: "fixed",
      boxShadow : "rgba(0,0,0,0.5) 0 0 0 9999px",
      top: "50%",
      right: "50%",
      zIndex : "100",
      display: this.state.showLoader
    }

    return (
      <div className="container" style={divStyle}>
        <h2 style={titleStyle}>Email 전송</h2>
        <hr/>
        <Form>
           <Form.Group>
            <Form.Label>receiver Email</Form.Label>
            <Form.Control 
              type="email"
              placeholder="receiver Email" 
              value={this.state.receiverEmail}
              required
              onChange={this.handleChangeReceiverEmail} 
              ref={ref => (this.receiverEmail = ref)}
              />
              
          </Form.Group>
          <Form.Group>
            <Form.Control as="textarea" 
              id="test-mailing"
              name="test-mailing"
              onChange={this.handleChangeContent}
              placeholder="보내고자 하는 내용을 적어주세요. "
              required
              value={this.state.content}
              ref={ref => (this.emailContent = ref)}
              rows={8} />
          <Button style={buttonStyle} onClick={this.sendEmail} block>
            전송
          </Button>
          </Form.Group>
        </Form>
        
        <div className="loading" style={spinnerStyle}>
          <div className="spinner spinner-border" style={spinnerStyle} role="status">
            <span className="sr-only">Sending Email...</span>
          </div>
        </div>

       
      </div>
    );
  }
}

export default SendEmail;
