import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./stylesheet.css";

function animation(binding) {
  let downAnimation = setInterval(function() {
    console.log("signal here")
    binding.setState({
      room1Style: {
        top: "500x"
      },
        contentPlacement: {
          top: "500px"
        }
    })
    console.log(binding.state.room1Style)
    console.log(binding)
    clearInterval(downAnimation)
  }, 1000)
}


function interVall(binding, newRoom)
    {let eventTimer = setInterval(function() {
      binding.setState({
        roomNumber: newRoom,
      })
      clearInterval(eventTimer)
    }, 400)
}

let earlierLetterCount = 0;
let start = false;
const timer = (binding, option) => {
  var mömmö = setInterval(function() {
    let newseconds;
    if (binding.state.secondsleft > 0) {
      newseconds = binding.state.secondsleft - 1;
      if (binding.state.letters === 0) {
        newseconds = 60;
      }
    } else {
      if (binding.state.paused === false) {
        binding.setState({
          paused: true,
          contentPlacement: {
            top:"10px"
          }
        })
      }
      newseconds = 0;}
    binding.setState({
      secondsleft: newseconds
    });
  }, 100);
};
//hello

const HighScoreRoom = ({changeRoom, style}) => {
  return(
    <div className="room-container"  style={style}>
    hello
    <div onClick={() => changeRoom(0)}>Back</div>
    </div>
  )
}

const ResultScreen = ({ points, restart, style, changeRoom}) => {
  let words = Math.floor(points / 5) * 1;
  return (
      <div class="results-content" style={style}>
        <h1 class="results">
          You wrote {points} letters in one minute!{" "}
          <h1 class="wpm">Your typing speed is {words} wpm</h1>
        </h1>
        <div class="button" onClick={restart}>
          <p class="button-text">Play again?</p>
        </div>
        <div class="button" onClick={() => changeRoom(1)}>
          <p class="button-text">High Scores</p>
        </div>
      </div>
  );
};

const Textfield = ({ handleChange, value, placeholder, color }) => {
  return (
    <input
      style={{ color: color }}
      value={placeholder}
      className="input"
      onChange={() => {
        handleChange(value.current.value);
      }}
      ref={value}
    />
  );
};
const Timer = ({ secondsLeft }) => {
  return <div>{secondsLeft}</div>;
};
const WantedWord = ({ wantedword, border }) => {
  return (
    <div class="word-container" style={{ width: "fit-content" }}>
      <div class="wantedword" style={border}>
        {wantedword}
      </div>
      <div style={border} class="meter" />
    </div>
  );
};
let request =
  "https://raw.githubusercontent.com/words/an-array-of-english-words/master/words.json";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dash: "",
      wantedWord: "hello",
      color: "red",
      length: 0,
      border: {
        width: "0%"
      },
      loading: false,
      array: "",
      secondsleft: 60,
      letters: 0,
      words: 0,
      contentPlacement: {},
      room1Style: {
      
      },
      roomNumber: 0,
      paused: false,
    };
    this.dashvalue = React.createRef();
  }
  changeRoom(newRoom) {

this.setState({
  room1Style: {
    top: "-500px"
  },
    contentPlacement: {
      top: "-500px"
    }
})

interVall(this, newRoom)
animation(this)


console.log(this.state.room1Style)

  }
  restart() {
    this.setState({

      contentPlacement: {
        top: "-500px",
      },
      paused: false,
      letters: 0,
      dash: "",
      secondsleft: 60,
      wantedWord: "hello",
      border: {
        width: "0%"
      }
    });
    earlierLetterCount = 0;
  }
  newWord() {
    let newWord = this.state.array[
      Math.floor(Math.random() * this.state.array.length)
    ];
    let newWordcount = this.state.words + 1;
    this.setState({
      wantedWord: newWord,
      length: newWord.length,
      border: {
        width: "0%"
      }
    });
    this.dashvalue.current.value = "";
    earlierLetterCount = 0;
  }
  componentDidMount() {
    fetch(request)
      .then(res => res.json())
      .then(out => {
        this.setState({
          loading: false,
          array: out
        });
      })
      .catch(err => console.error(err));
  }
  setValue(newValue) {
    if (this.state.secondsleft === 60 && start === false) {
      timer(this);
    }
    console.log(this.state.letters);
    start = true;
    if (this.state.secondsleft > 0) {
      if (this.state.wantedWord.slice(0, newValue.length) === newValue) {
        let newletters = this.state.letters;
        if (newValue.length > earlierLetterCount) {
          newletters += 1;
        }
        let newLength = (100 / this.state.wantedWord.length) * newValue.length;
        this.setState({
          letters: newletters,
          color: "green",
          border: {
            width: `${newLength}%`
          }
        });
      } else {
        this.setState({
          color: "red"
        });
      }
      if (newValue.length > earlierLetterCount) {
        earlierLetterCount = newValue.length;
      }
      if (newValue === this.state.wantedWord) {
        this.newWord();
      }
      this.setState({
        dash: this.dashvalue.current.value
      });
    }
  }
  render() {
    if (this.state.loading === true) {
      return <div>loading...</div>;
    }
    if (this.state.secondsleft === 0) {
      let rooms = [<ResultScreen            points={this.state.letters}
        restart={this.restart.bind(this)}
        style={this.state.contentPlacement}
        changeRoom = {this.changeRoom.bind(this)}/>, <HighScoreRoom changeRoom={this.changeRoom.bind(this)} style={this.state.room1Style}/>]
        let currentRoom = rooms[this.state.roomNumber]
      return (
        <div class="results-screen">
        {currentRoom}
        </div>
      );
    }
    return (
      <div className="App">
        <Textfield
          handleChange={this.setValue.bind(this)}
          value={this.dashvalue}
          placeholder={this.state.dash}
          color={this.state.color}
        />
        <WantedWord
          wantedword={this.state.wantedWord}
          border={this.state.border}
        />
        <Timer secondsLeft={this.state.secondsleft  } />
        <div>{this.state.letters}</div>
      </div>
    );
  }
}
//whas good
export default App;
