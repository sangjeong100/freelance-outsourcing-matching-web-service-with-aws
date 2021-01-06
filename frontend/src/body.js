import React, { Component } from "react";
import JoinForm from "./User/JoinForm";
import LoginForm from "./User/LoginForm";
import PostIndex from "./Post/PostIndex";
import PostNewForm from "./Post/PostNewForm";
import PostShow from "./Post/PostShow";
import UserPageForm from "./User/UserPageForm";
import HomepageForm from "./HomePage/HomePage";
import SendEmailForm from "./User/SendEmail";
import { Route } from "react-router-dom";
import BoardList from "./Post/BoardList"
import RankingIndex from "./User/UserRankingIndex";

class Body extends Component {
  render() {
    return (
      <div >
        <Route path="/boardList" component={BoardList}/>

        <Route path="/post/new" component={PostNewForm}/>
        <Route path="/post/show/:id" component={PostShow}/>
        <Route path="/post/edit/:id" component={PostNewForm}/>
        <Route path="/postDev" component={PostIndex} />
        <Route path="/postNotice" component={PostIndex} />
        <Route path="/postFree" component={PostIndex} />
        <Route path="/postCompany" component={PostIndex} />
        
        <Route path="/user/edit" component={UserPageForm}/>
        <Route path="/user/login" component={LoginForm}/>
        <Route path="/user/join" component={JoinForm}/>
        <Route path="/email/send" component={SendEmailForm}/>

        <Route path="/user/devRanking" component={RankingIndex}/>
        <Route path="/user/companyRanking" component={RankingIndex}/>

        <Route exact path="/" component={HomepageForm}/>
      </div>
    );
  }
}

export default Body;
