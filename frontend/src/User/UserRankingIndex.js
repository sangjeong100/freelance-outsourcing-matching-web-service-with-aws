import React, { Component } from "react";
import { Image, Table } from "react-bootstrap";
import axios from "axios";
import UserProfileModal from "./UserProfileModal";
import {} from '../css/userProfile.css';
import ReactPaginate from 'react-paginate';
import {} from '../css/pagination.css';
import $ from "jquery";
import {} from "jquery.cookie";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

//ranking 하나당 출력
class RankingRow extends Component {

  constructor(props){
    super(props);
    this.state = {
      userProfileModalShow: false,
      s3_url: 'https://s3.ap-northeast-2.amazonaws.com/userprofileimg/'
    }
  }

  handleUserProfileShow = () =>{
    this.setState({
      userProfileModalShow: !this.state.userProfileModalShow
    });
  }

  showRanking = () =>{
    if( this.props.index === 1){
      return (<Image src="/img/ranking/1.png" width="25" height="30"/>)
    } 
    else if( this.props.index === 2){
      return (<Image src="/img/ranking/2.png" width="25" height="30"/>)
    }
    else if( this.props.index === 3){
      return (<Image src="/img/ranking/3.png" width="25" height="30"/>)
    }
    else {
      return this.props.index;
    }
  }

  render() {

    const userProfileStyle = {
      border:"3px solid #fff", 
      boxShadow: "0 0 16px rgb(221,221,221",
      marginLeft:"15px", 
      cursor:"pointer",
      marginRight: "5px",
      marginBottom: "6px" 
    }

    return (
      <tr style={{fontWeight:"600"}}>
        <td style={{textAlign:"center"}}>
          {this.showRanking()}
        </td>
        <td style={{  marginTop:"10px",paddingTop:"17px"}}>
        <Image className="userProfile" 
              src={this.state.s3_url + this.props.user.img_path} 
              width="25" height="25" 
              style={userProfileStyle} 
              onClick={this.handleUserProfileShow}
              roundedCircle
              />
            {this.props.user.name}
        <>
        <UserProfileModal user={this.props.user} show ={this.state.userProfileModalShow} showHandler={this.handleUserProfileShow}/>
        </>
        </td>
        <td style={{textAlign:"center", marginTop:"10px",paddingTop:"17px"}}>
          {this.props.user.retained_star}
        </td>
      </tr>
    );
  }
}

class UserRankingIndex extends Component {
    state = {
      users: [], 
      userType: "",
      boardName: "",
      perPage: 10,
      pageNum: 0,
      totalItems: 0  
    }
  
  //userType에 따라서 가져올 데이터 분기
  Category = () =>{
    if(this.props.match.url === '/user/companyRanking'){
      this.setState({
        userType: "COMPANY",
        boardName: "업체 순위"
      });
      return {headers, user_type: "COMPANY"}
    }
    else if(this.props.match.url === '/user/devRanking'){
      this.setState({
        userType: "DEVELOPER",
        boardName: "개발자 순위"
      });
      return {headers, user_type: "DEVELOPER"}
    }
  }

  //component 시작하면 getUserRankingIndex 함수 실행
  componentDidMount() {
    if(!$.cookie('user_unique_id')){
    	alert("로그인 후 가능합니다!!");
	window.location.href = "/";
    }
    this.getUserRankingIndex();
  }
  
  getUserRankingIndex = () => {
    const send_param = this.Category();
    axios
      .get(`http://54.180.89.24:8080/user/${send_param.user_type}/getRanking`)
      .then(returnData => {
        let users;
        if (returnData.data.users.length > 0) {
          const returnedUsers = returnData.data.users;
          users = returnedUsers.map((user,index) => (
            <RankingRow
              index = {index+1}
              user = {user}
              key = {index}
            />
          ));
          //user목록 state에 저장
          this.setState({
            users: users
          });
        } else {
          //게시글 못 찾은 경우
          users = ([
            <tr key={0}>
              <td colSpan="3" style={{textAlign:"center"}}>유저가 존재하지 않습니다.</td>
            </tr>
          ]);
          this.setState({
            users: users
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //pagenation
  changePage = (select) =>{
    console.log(select)
    this.setState({
      pageNum: select.selected
    });
  }

  
  render() {
    const divStyle = {  
      marginTop: "3%",
      minWidth:"70%", 
      minHeight:"700px",
    };
    

    return (
      <div className="container" style={divStyle} >
        <div style={{marginBottom:"3%"}}>
          <h2>{this.state.boardName}</h2>
        </div>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr style={{textAlign:"center"}}>
                <th style={{width:"10%"}}>Ranking</th>
                <th style={{width:"80%"}}>User</th>
                <th style={{width:"10%"}}>Star</th>
              </tr>
            </thead>
            <tbody>{this.state.users.slice(this.state.pageNum*this.state.perPage,this.state.pageNum*this.state.perPage+this.state.perPage)}</tbody>
          </Table>
          
        </div>
        <div>
          <ReactPaginate
            previousLabel={'이전'}
            nextLabel={'다음'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil((this.state.users.length/this.state.perPage))}
            marginPagesDisplayed={0}
            pageRangeDisplayed={10}
            onPageChange={this.changePage}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>

	<br/><br/><br/>

      </div>
    );
  }
}

export default UserRankingIndex;
