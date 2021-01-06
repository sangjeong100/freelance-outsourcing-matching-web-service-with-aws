import React, {Component} from 'react';
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import LoginForm from "./User/LoginForm";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = {withCredentioals: true};

class Header extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      loginState: false,
      loginFormShow: false,
    }
  }
  
  componentDidMount(){
    if ($.cookie("user_unique_id")){
      this.setState({
        loginState: true
      
      });
    } else{
      this.setState({
        loginState: false      
      });
    }
  }

  logout = () => {
    axios
      .get("http://54.180.89.24:8080/user/logout",{
        headers
      })
      .then( (response) => {
        if(response.data.message){
          $.removeCookie("user_unique_id");
          $.removeCookie("login_id");
          $.removeCookie("user_type");
          $.removeCookie("email");
          $.removeCookie("telphone");
          alert("로그아웃에 성공 했습니다.");
          window.location.href="/";
        }
      });
  };

  handleLoginFormShow = () =>{
    this.setState({
      loginFormShow: !this.state.loginFormShow
    });
    
  }

  render(){
    
    const categoryStyle = {
      color:"white",
      textDecoration: "none",
      padding: "8px" 
    }

    return(
    <> 
    <Navbar style={{backgroundColor: "#090707"}} expand="lg"  variant="dark">
      <Navbar.Brand href="/">
        <img
        alt=""
        src="/img/logo.png"
        width="30"
        height="30"
        className="d-inline-block align-top"
        />
        <span style={{paddingTop:"8px", paddingLeft:"3px"}}>FOM</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" style={categoryStyle}>
          <NavLink to="/boardList" style={categoryStyle}>게시판 리스트 </NavLink>
          <NavDropdown title="순위 게시판" id="collasible-nav-dropdown">
            <NavDropdown.Divider />
              <NavLink className="dropdown-item" to={{pathname:"/user/devRanking"}} style={{color:"black"}} >
                DEVELOPER
              </NavLink>  
            <NavDropdown.Divider />
              <NavLink  className="dropdown-item" to="/user/companyRanking" style={{color:"black"}}>              
                COMPANY
              </NavLink>
          </NavDropdown>
        </Nav>
        {this.state.loginState ? 
        <Nav inline="true">
          <NavLink to="/user/edit" style={categoryStyle}>회원정보</NavLink>
          <Nav.Link variant="dark" onClick={this.logout} style={categoryStyle}>로그아웃</Nav.Link>
        </Nav>          
        :
        <Nav inline="true">
          <NavLink to="/user/join" style={categoryStyle}>회원가입</NavLink>
          <Nav.Link variant="dark" onClick={this.handleLoginFormShow} style={categoryStyle}>로그인</Nav.Link>
          <LoginForm show = {this.state.loginFormShow} showHandler={this.handleLoginFormShow}/>
        </Nav>
        }

      </Navbar.Collapse>
    </Navbar>
    
    </>
    )
  }

}

export default Header;
