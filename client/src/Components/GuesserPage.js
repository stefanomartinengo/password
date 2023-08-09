import React from 'react';

const styles = {
    padding: '25px',
    stopwatch: {
        border: '1px solid',
        display: 'flex',
        justifyContent: 'center',
        height: '125px',
        width: '70%',
        borderRadius: '55px',
        fontSize: '2em',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: '1em 0 1em 0'
    }
}
function GuesserPage(props) {
    return (
        <div style={styles}>
            <div style={styles.stopwatch}>
                <p> {props.timer} </p>
            </div>
            Guesses: 
            Hints: 
        </div>
    )
};

export default GuesserPage;