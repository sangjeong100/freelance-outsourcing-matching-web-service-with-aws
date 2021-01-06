import React, {Component} from 'react';
import {} from './css/footer.css';
import { NavLink } from "react-router-dom";

class Footer extends Component{

  render(){
  return(
  <div className="site-footer">
  <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6>About Us</h6>
            <p className="text-justify"> 
              We provide matching web services for companies and developers. and You can share a outsourcing information.
              If you are a developer or a company that needs a developer, 
              Let's go to use FOM Web Site.</p> 
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Categories</h6>
            <ul className="footer-links">
              <li style={{float:"none"}}><NavLink to="/" style={{borderStyle:"none", width:"53px", backgroundColor:"#FF"}}>Home</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/postNotice" style={{borderStyle:"none", width:"60px"}}>공지사항</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/postDev" style={{borderStyle:"none", width:"90px"}}>개발자 게시판</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/postCompany" style={{borderStyle:"none", width:"75px"}}>업체 게시판</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/postFree" style={{borderStyle:"none", width:"75px"}}>자유 게시판</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/user/devRanking" style={{borderStyle:"none", width:"75px"}}>개발자 순위</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/user/companyRanking" style={{borderStyle:"none", width:"62px"}}>업체 순위</NavLink></li>
            </ul>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Contact Us</h6>
            <ul className="footer-links">
              <li style={{float:"none"}}>Address :</li>
              <li style={{float:"none"}}>아주대학교 사이버보안학과</li>
              <li style={{float:"none"}}>Email :</li>
              <li style={{float:"none"}}>sangjeong100@ajou.ac.kr</li>
              <li style={{float:"none"}}>telPhone :</li>
              <li style={{float:"none"}}>010-3716-6508</li>
            </ul>
          </div>
        </div>
        <hr />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">Copyright &copy; 2020 All Rights Reserved by FOM.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
  }

}

export default Footer;
