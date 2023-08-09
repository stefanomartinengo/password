import React, { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import  LoginSection  from './Components/Login';
import  Users  from './Components/UserTooltip';
import  PasswordPage  from './Components/PasswordPage';
import  GuesserPage  from './Components/GuesserPage';

import './App.css';

const WS_URL = 'ws://127.0.0.1:8000';



// function isDocumentEvent(message) {
//   let evt = JSON.parse(message.data);
//   return evt.type === 'contentchange';
// }

function App() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [timer, setTimer] = useState('0');
  const [guesser, setGuesser] = useState('');
  const [hintsGiven, setHintsGiven] = useState(0);
  const [password, setPassword] = useState(0);
  
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true
  });
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isPasswordEvent
  });
  useEffect( () => {}, [guesser]);
  useEffect(() => {
    if(username && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username,
        type: 'userevent'
      });
    }
  }, [username, readyState]);
  useEffect( () => {
    if (users.length === 2) {
      setTimeout( ()=> {
        sendJsonMessage({
          username,
          type: 'startgame'
        });
      },3000);
      sendJsonMessage({
        username,
        type: 'password'
      })
      sendJsonMessage({
        username,
        type: 'setguesser'
      })
    }
  }, [users]);
  useEffect( ()=> {}, [timer, readyState]);
  useWebSocket(WS_URL, {
    onMessage: (e) => {
      let data = JSON.parse(e.data);
      if (data.type === 'timerevent') {
        setTimer(data.data);
      } else if( data.type === 'userevent') {
        if (users.length < 2) {
          let users = [];
          for(var key in data.data.users) {
            users.push({username: data.data.users[key].username});
          }
          setUsers(users);
            let tmpUsers = [...users];
            setUsers(tmpUsers);
        }
      } else if (data.type === 'setguesser') {
        sendJsonMessage({
          username,
          type: 'setguesser'
        });

        setGuesser(e.data);
      } else if (data.type === 'password') {
        setPassword(data.data.pass.password);
      }
    },
  });
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarBrand href="/">PASSWORD</NavbarBrand>
        <p> { timer === '0:0' ? `${timer} - Round Over` : `${timer}` }  </p>
      </Navbar>
      <p style={{color: 'black'}}>
      </p>
      <div style={{display: 'flex', padding: '15px'}}>
        <Users guesser={guesser} />
      </div>
      <div style={{width: '100%', height: '3px', backgroundColor: 'black', margin: '15px'}}></div>
      <div className="container-fluid">
        {
        username ? <GameWindow timer={timer} users={users} password={password} guesser={guesser} username={username}/>
            : <LoginSection onLogin={setUsername}/> }
      </div>
    </>
  );
}
// function isUserEvent(message) {
//   let evt = JSON.parse(message.data);
//   return evt.type === 'userevent';
// }
function isPasswordEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'password';
}

// function History() {
//   const { lastJsonMessage } = useWebSocket(WS_URL, {
//     share: true,
//     filter: isUserEvent
//   });
//   const activities = lastJsonMessage?.data.userActivity || [];
//   return (
//     <ul>
//       {activities.map((activity, index) => <li key={`activity-${index}`}>{activity}</li>)}
//     </ul>
//   );
// }

function GameWindow(props) {
  useEffect(()=>{}, [props.guesser]);
  useEffect(()=>{}, [props.username]);
  useEffect(()=>{}, [props.timer]);
  if (!props.guesser) {
    return (<div style={{padding: '20px'}}> Waiting for other player... </div>)
  };
  if (props.guesser === props.username) {
    return (
      <div>
        <GuesserPage timer={props.timer}/>
      </div>
    )
  } else  {
    return (
      <div>
        <PasswordPage timer={props.timer} />
      </div>
    )
  }
}
export default App;
