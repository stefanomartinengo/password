import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { UncontrolledTooltip } from 'reactstrap';
  import Avatar from 'react-avatar';

const WS_URL = 'ws://127.0.0.1:8000';

function isUserEvent(message) {
    let evt = JSON.parse(message.data);
    console.log('evt: ', evt);
    return evt.type === 'userevent';
  }
  
function Users(props) {
    useEffect( () => {}, [props.guesser]);
    const { lastJsonMessage } = useWebSocket(WS_URL, {
      share: true,
      filter: isUserEvent
    });
    const users = Object.values(lastJsonMessage?.data.tmpUsers || {});
    let guesser = '';
    users.map( e=> {
      if (e.guesser) {
        guesser = e.username
      };
    });
    props.setGuesser(guesser);
    return users.map(user => (
      <div key={user.username}>
        <span id={user.username} className="userInfo" key={user.username}>
          <Avatar name={user.username} size={40} round="20px"/>
        </span>
        <UncontrolledTooltip placement="top" target={user.username}>
          {user.username}
        </UncontrolledTooltip>
      </div>
    ));
  }

  export default Users