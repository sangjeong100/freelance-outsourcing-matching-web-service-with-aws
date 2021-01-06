import React, { Component } from "react";
import { Image } from "react-bootstrap"; 
import {} from "../css/home.css";



class HomePage extends Component{

  render(){
    
    return(
    <div>     
      <Image src="./img/home/bullet.jpg" style={{width:"100%" ,height:"10%", borderBottom:"1px solid black"}}/>
      <div className="hero-text">
        <h1 className="mt-3 ml-5" style={{zIndex:"-1"}}>외주 매칭을 위한 효율적인 사이트</h1>
        <h4 className="mt-4 ml-5">FOM을 이용하여 외주를 구하고, 정보공유를 하세요.</h4>
      </div>
      <div className="text-center" style={{height: "50%"}}>
        <h1 className="font-bold mt-5 mb-2">Freelance Outsourcing Matching</h1>
        <h6 className="font-bold">아래 서비스를 이용해 보세요.</h6>
        <div className="row mx-5" style={{marginTop: "80px"}}>
          <div className="card home-card col-md-3" style={{width: "18rem"}}>
            <div className="card-body">
              <Image className="card-img fas mb-4" style={{width:"150px", height:"120px"}}  src="./img/home/project.jpg"/>
              <h4 className="card-title">업체/개발자 게시판</h4>
              <h5 className="card-subtitle mt-2 text-muted">원하는 개발자 외주 정보를 게시</h5>
            </div>
          </div>
          <div className="card home-card col-md-3" style={{width: "18rem"}}>
            <div className="card-body">
              <Image className="card-img fas mb-4" style={{width:"150px", height:"120px"}}  src="./img/category/FreeBoard.png"/>
              <h4 className="card-title">자유 게시판</h4>
              <h5 className="card-subtitle mt-2 text-muted">외주 정보를 자유롭게 공유</h5>
            </div>
          </div>
          <div className="card home-card col-md-3" style={{width: "18rem"}}>
            <div className="card-body">
              <Image className="card-img fas mb-4" style={{width:"150px", height:"120px"}} src="./img/category/RankingBoard.PNG"/>
              <h4 className="card-title">순위 게시판</h4>
              <h5 className="card-subtitle mt-2 text-muted">개발자 및 업체의 별점 순위 확인</h5>
            </div>
          </div>
          <div className="card home-card col-md-3" style={{width: "18rem"}}>
            <div className="card-body">
              <Image className="card-img fas mb-4" style={{width:"150px", height:"120px"}} src="./img/home/emailService.png"/>
              <h4 className="card-title">이메일 시스템</h4>
              <h5 className="card-subtitle mt-2 text-muted">이메일 전송을 통한 외주 매칭</h5>
            </div>
          </div>
        </div>
        <br/>
      </div>
    </div>  
    );
  }

}

export default HomePage;
