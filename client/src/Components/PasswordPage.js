import React from 'react';

const styles = {
    button: {
        height: '55px',
        width: '150px',
        borderRadius: '7px'
    },
    smMargin: {
        margin: '5px'
    },
    mdMargin: {
        margin: '10px'
    },
    mtop: { marginTop: '25px'}
}

function PasswordPage(props) {
    console.log('props.password: ', props.password);
    
    return (
      <div style={{padding: '25px'}}> 
              <p> { (props.timer === '0:0') ? `${props.timer} - Round Over` : `${props.timer}` }  </p>

        <h5> The Password is: {props.password} </h5> 

        <div style={styles.mtop}>
            <button style={styles.button}> Hint Given </button>
        </div>
        <div style={styles.mtop}>
            <p> Hints Count: 2 </p>
        </div>
      </div>
    )
  }

export default PasswordPage;