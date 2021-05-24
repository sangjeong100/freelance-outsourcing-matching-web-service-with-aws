# freelance-outsourcing-matching-web-service-with-aws
외주 연결 사이트


1.	개요
1.1.	주제 선정 배경
-	개발자 측면
많은 개발자들이 커리어 증진이나, 용돈벌이 또는 프리랜서 희망 등을 이유로 외주를 받고 싶어하지만, 외주를 원하는 업체의 매칭에 대해 어려움을 겪는 경우가 많다. 
-	업체 측면
소규모 기업이나 스타트업의 경우, 상주하는 개발자가 필요한 경우보다 기업을 위한 서비스 웹, 앱 개발의 외주를 필요로 하는 경우가 많다. 하지만 외주 전문 업체의 비싼 가격으로 인하여 어려움을 겪는 경우가 많다.
	위의 같은 이유로 개발자와 업체를 연결해주는 매칭 시스템의 필요성을 느꼈다.
1.2.	프로젝트의 목표
-	외주를 원하는 개발자와 외주를 필요로 하는 업체의 연결을 위한 외주 매칭 사이트를 제공. 
-	더 나아가서 개발자들과 업체들 사이의 커뮤니케이션 장을 형성하여, 자율적으로 외주에 대한 정보, IT 정보 등을 공유하거나 협업 프로젝트의 인원을 구하는 등의 기능을 제공
-	개발자별, 업체별 순위 시스템 제공, 순위를 위한 Star기능 제공
-	매칭을 위한 이메일 서비스 제공
-	공지사항, 개발자 게시판, 업체 게시판, 자유 게시판, 순위 게시판, 유저프로필을 통해 위 기능 제공
2.	프로젝트 내용
2.1.	프로젝트의 요구사항 분석 및 세부 기능 정의
2.1.1.	개인프로젝트 가이드라인에 따른 요구사항
	MongoDB와 backend 연결을 통한 웹서비스의 DataBase 구현
	Client side에서 온 요청에 따라 필요한 각종 information을 MongoDB에 저장(Post 정보, User정보, Comment 정보, user간의 Star give 정보)
	AWS의 ec2를 활용하여 실제 접속가능한 서버 프로그램 구현
	Backend: node.js, frontend 프레임워크: React 통하여 프로젝트 구현
	Frontend code 내에 하나를 선택하여 테스트 코드 작성
	Ajou Gitlab의 repository에 코드를 올려서 작업
	Session 구현을 통한 로그인 기능 및 로그인 유지, 로그아웃 등의 기능 구현
	수업에서 다룬 기술 전제
	REST Architecture 구조를 따라 설계
	글쓰기 CRUD, 댓글 CRUD 등에 REST Architecture에 따라서 HTTP method를 get, post, put, delete로 구성
2.1.2.	본인의 프로젝트에 따른 요구사항
	회원가입, 로그인, 유저정보 수정, 유저 이미지 업로드, 회원 탈퇴 구현
	user_type에 따른 글쓰기 권한 부여
	유저가 다른 유저에게 star를 주는 기능 구현
	개발자, 업체의 star에 따른 순위 리스트 구현
	유저가 다른 유저에게 메일 보내는 기능 구현
	bootstrap을 활용하여 웹앱 구현
	유지 이미지 업로드를 aws의 s3 클라우드를 활용하여 구현
	유저에게 star를 주거나, 이메일을 보낼 수 있는 user profile modal 구현

3.	프로젝트 결과
3.1.	MongoDB와 backend 연결을 통한 웹서비스의 DataBase 구현 및 실제 접속가능한 서버 구현
	AWS의 EC2서버에서 MongoDB와 Backend를 설치하고, Server-Side에서 user의 요청에 따라서 DB Access를 한다. 즉, 유저가 기능을 유저가 요청하면, backend에서는 요청한 유저의 정보와 DB확인을 통해 해당 기능의 권한 여부를 파악한다. 그리고, 권한여부에 따라서 유저가 원하는 결과를 front로 전달해 준다. 그리고 필요한 각종 정보를 DB에 저장한다.



[그림1] Backend의 server.js내에 mongoDB 연결 코드
	AWS의 ec2를 활용하여 접속 가능한 서버 구현
	웹사이트 주소: http://54.180.89.24:3000/#/
	npm의 pm2 모듈을 이용해서 상시 운용이 될 예정이 였지만, AWS 프리티어 서버의 약한 성능으로 인하여 하루만에 서버폭발이 발생했습니다. 그래서, 서버 재설정을 진행하는 경우가 2번 발생했습니다. 따라서 죄송하지만 요청시에 서버를 켜드리는 방향으로 진행하겠습니다. 양해 부탁드립니다. 
3.2.	Ajou Gitlab의 repository에 코드를 올려서 작업
	local의 개발 서버 Project와 AWS의 ec2에 존재하는 운영 서버 Project를 분리하여 작업하였다. (소스를 다운 받을 수 있도록 public상태로 만들어 뒀다.)
	AWS의 ec2로 배포한 서버의 GitLab Project Url:
https://git.ajou.ac.kr/SangJeong/freelance-outsourcing-matching-web-service-with-aws.git
	Local의 개발 서버의 GitLab Project Url: https://git.ajou.ac.kr/SangJeong/freelance-outsourcing-matching-web-service.git  
3.3.	AWS의 s3 클라우드를 활용하여 유저 profile image 업로드 
	유저가 유저 정보에서 이미지 업로드를 통해, 사진을 업로드할 수 있다. 이때, 해당 프로젝트에서는 aws의 s3클라우드에 유저의 이미지가 업로드되고, url을 통해 유저 이미지를 보여준다. 
 
[그림2] 유저 이미지가 업로드 되는 과정 
3.4.	이메일 전송 기능 구현
	EmailJs에서 제공하는 ‘emailjs-com’모듈을 통해서 이메일 전송기능을 구현하였다. 
 
 




[그림3] email 전송 과정

3.5.	REST Architecture 구조를 따라 설계
	글쓰기CRUD, 댓글 CRUD, 회원정보 수정 등에서 HTTP method인 get, post, put, delete를 사용하여 REST Architecture구조로 설계하였다. 아래 [그림2]는 REST Architecture 중 put 예제이다. (이외의 사항은 소스코드 참조)
 
[그림2] CommentForm.js에서 comment 수정부분
3.6.	로그인 세션 구현 포함 나머지 기능들은 분량문제로 인하여 소스코드 또는 데모동영상 참고 바랍니다.
4.	프로젝트 운영 환경 및 기타
4.1.	운영체제
a.	Local 환경: windows10 WSL Ubuntu 20.04 LTS 
b.	AWS의 ec2환경: Ubuntu 18.04 LTS
4.2.	활용 프레임워크
a.	프론트 프레임워크: React 
b.	Backend: Node.js
c.	DataBase: MongoDB
4.3.	사용된 기술
-	Mongoose (backend와 MongoDB 연결), Bootstrap(전체적인 UI 구성의 틀), Axios (backend와 frontend의 통신), Express (backend 구성), React-router-dom, 테스트코드, email전송 기능(emailJS), aws의 ec2와 s3, jquery, jquery.cookie, react-paginate, ckeditor4 등등 
