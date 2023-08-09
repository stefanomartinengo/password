import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
const WS_URL = 'ws://127.0.0.1:8000';

function LoginSection({ onLogin }) {
    const [username, setUsername] = useState('');
    useWebSocket(WS_URL, {
      share: true,
      filter: () => false
    });
    function logInUser() {
      if(!username.trim()) {
        return;
      }
      onLogin && onLogin(username);
    }
  
    return (
      <div className="account">
        <div className="account__wrapper">
          <div className="account__card">
            <div className="account__profile">
              <p className="account__name">Hello, user!</p>
              <p className="account__sub">Join to play the Game!</p>
            </div>
            <input name="username" onInput={(e) => setUsername(e.target.value)} className="form-control" />
            <button
              type="button"
              onClick={() => logInUser()}
              className="btn btn-primary account__btn">Join</button>
          </div>
        </div>
      </div>
    );
  }

  export default LoginSection;