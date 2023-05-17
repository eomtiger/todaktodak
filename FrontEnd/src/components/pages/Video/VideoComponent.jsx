// // class형
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import React, { Component } from "react";
import UserVideoComponent from "./UserVideoComponent";
import TopBar from "../../organisms/TopBar";
import BottomBar from "../../organisms/BottomBar";

// const APPLICATION_SERVER_URL =
//   process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";
// console.log(process.env.NODE_ENV);

const APPLICATION_SERVER_URL = "https://todaktodak.kr:8080/";
// const APPLICATION_SERVER_URL = "https://demos.openvidu.io/";
// ------------------------------------------------------------------------------------------------------

// 클래스형
class Video extends Component {
  constructor(props) {
    super(props);

    this.babyId = props.babyId[0].toString();
    this.jwtToken = props.jwtToken;
    this.deviceData = props.deviceData;
    console.log("deviceData", this.deviceData);

    // These properties are in the state's component in order to re-render the HTML whenever their values change
    this.state = {
      // SessionId는 Camera Serial Number(로그인 후 시도)
      mySessionId: "todaktodak1013",
      // mySessionId: this.deviceData.session_id,
      // UserName은 로그인 한 후 생성되는 pk 번호
      // myUserName: "Participant" + Math.floor(Math.random() * 100),
      myUserName: this.babyId,
      session: undefined,
      mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
      publisher: undefined,
      subscribers: [],
      tokenList: [],
      babyPK: undefined,
    };
    // console.log(this.state["mySessionId"]);

    this.code = new URL(document.location.toString()).searchParams.get("code");
    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    // 카메라 전후 변경(필요없음)
    // this.switchCamera = this.switchCamera.bind(this);
    // SessionId 변경(필요없음)
    // this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    // UserName 변경(필요없음)
    // this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  // leaveSession 함수 - 2
  onbeforeunload(event) {
    this.leaveSession();
  }

  // SessionId 변경
  // handleChangeSessionId(e) {
  //   this.setState({
  //     mySessionId: e.target.value,
  //   });
  // }

  // UserName 변경
  // handleChangeUserName(e) {
  //   this.setState({
  //     myUserName: e.target.value,
  //   });
  // }

  handleBabyInfo(code) {
    axios
      .get(
        `https://todaktodak.kr:8080/api/login/oauth2/code/kakao?code=${code}`
      )
      .then((response) => {
        let babyPk = response.data.babyId;
        console.log(babyPk);
      });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  // joinSession
  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session ---

        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);
          // console.log("subscribers", subscribers);

          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });

        // On every Stream destroyed...
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // Get a token from the OpenVidu deployment
        this.getToken().then((token) => {
          console.log("오픈비두 연결시도");
          console.log("connectionToken", token["connection_token"]);
          // let tokenList = this.state.tokenList;
          // tokenList.push(token);
          // console.log(tokenList);
          // console.log(tokenList);
          // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token["connection_token"], {
              clientData: this.state.myUserName,
            })
            .then(async () => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Obtain the current video device in use
              var devices = await this.OV.getDevices();
              var videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
              );
              var currentVideoDeviceId = publisher.stream
                .getMediaStream()
                .getVideoTracks()[0]
                .getSettings().deviceId;
              var currentVideoDevice = videoDevices.find(
                (device) => device.deviceId === currentVideoDeviceId
              );

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                currentVideoDevice: currentVideoDevice,
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log("There was an error connecting to the session:");
              console.log(error);
            });
        });
      }
    );
  }

  // leaveSession 함수 - 1
  // 방을 나가는 함수
  // todaktodak 서비스에서는 필요없음
  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "todaktodak1013",
      // mySessionId: this.deviceData["session_id"],
      // myUserName: "Participant" + Math.floor(Math.random() * 100),
      myUserName: this.babyId,
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }

  // 카메라 전후 변경 기능
  // todak Service에서 필요없음
  // async switchCamera() {
  //   try {
  //     const devices = await this.OV.getDevices();
  //     var videoDevices = devices.filter(
  //       (device) => device.kind === "videoinput"
  //     );

  //     if (videoDevices && videoDevices.length > 1) {
  //       var newVideoDevice = videoDevices.filter(
  //         (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
  //       );

  //       if (newVideoDevice.length > 0) {
  //         // Creating a new publisher with specific videoSource
  //         // In mobile devices the default and first camera is the front one
  //         var newPublisher = this.OV.initPublisher(undefined, {
  //           videoSource: newVideoDevice[0].deviceId,
  //           publishAudio: true,
  //           publishVideo: true,
  //           mirror: true,
  //         });

  //         //newPublisher.once("accessAllowed", () => {
  //         await this.state.session.unpublish(this.state.mainStreamManager);

  //         await this.state.session.publish(newPublisher);
  //         this.setState({
  //           currentVideoDevice: newVideoDevice[0],
  //           mainStreamManager: newPublisher,
  //           publisher: newPublisher,
  //         });
  //       }
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // parentFunction = (data) => {
  //   console.log(data);
  // };

  render() {
    const mySessionId = this.state.mySessionId;
    // const myUserName = this.state.myUserName;

    return (
      <>
        <TopBar />
        <div className="container">
          {this.state.session === undefined ? (
            // ? this.joinSession()
            ////////////////////////////////////////////////////////////////////////////////////////
            <div id="join">
              {/* <div id="img-div">
                  <img
                    src="resources/images/openvidu_grey_bg_transp_cropped.png"
                    alt="OpenVidu logo"
                  />
                </div> */}
              <div id="join-dialog" className="jumbotron vertical-center">
                {/* <h1> Join a video session </h1> */}
                <form className="form-group" onSubmit={this.joinSession}>
                  {/* userName 변경 form */}
                  {/* <p>
                      <label>Participant: </label>
                      <input
                        className="form-control"
                        type="text"
                        id="userName"
                        value={myUserName}
                        onChange={this.handleChangeUserName}
                        required
                      />
                    </p> */}
                  {/* SessionId 변경 form */}
                  {/* <p>
                      <label> Session: </label>
                      <input
                        className="form-control"
                        type="text"
                        id="sessionId"
                        value={mySessionId}
                        onChange={this.handleChangeSessionId}
                        required
                      />
                    </p> */}
                  <p className="text-center">
                    <input
                      className="btn btn-lg btn-success"
                      name="commit"
                      type="submit"
                      value="JOIN"
                    />
                  </p>
                  {/* <JoinButton /> */}
                </form>
              </div>
            </div>
          ) : ///////////////////////////////////////////////////////////////////////////////////////////////
          null}

          {this.state.session !== undefined ? (
            <div id="session">
              <div id="session-header">
                <h1 id="session-title">{mySessionId}</h1>
              </div>

              <div id="video-container" className="col-md-6">
                {this.state.subscribers.map((sub, i) => (
                  <div
                    key={sub.id}
                    className="stream-container col-md-6 col-xs-6"
                    onClick={() => this.handleMainVideoStream(sub)}
                  >
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <BottomBar
          joinSession={this.joinSession}
          leaveSession={this.leaveSession}
          handleBabyInfo={this.handleBabyInfo}
        />
      </>
    );
  }

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
  async getToken() {
    // const sessionId = await this.createSession(this.state.mySessionId);
    const sessionId = this.state.mySessionId;
    return await this.createToken(sessionId);
  }

  // // Session 생성
  // async createSession(sessionId) {
  //   // // Before
  //   // const response = await axios.post(
  //   // After
  //   console.log(sessionId);
  //   const response = await axios.post(
  //     // After
  //     APPLICATION_SERVER_URL + "api/iot/sessions",
  //     // // Before
  //     // APPLICATION_SERVER_URL + "api/sessions",

  //     { customSessionId: sessionId },
  //     {
  //       headers: {
  //         // After
  //         Authorization: `Bearer ${this.jwtToken}`,
  //         "Content-Type": "application/json;charset=UTF-8",
  //       },
  //     }
  //   );
  //   console.log(response);
  //   return response.data; // The sessionId
  // }

  // Session 입장에 필요한 Token
  async createToken(sessionId) {
    // // Before
    // const response = await axios.post(
    // After
    const response = await axios.patch(
      // // Before
      // APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      // After
      APPLICATION_SERVER_URL +
        "api/sessions/" +
        sessionId +
        "/connections/" +
        this.babyId,
      {},
      {
        headers: {
          // After
          Authorization: `Bearer ${this.jwtToken}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
    // console.log(response.data);
    return response.data; // The token
  }
}

export default Video;
