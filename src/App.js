import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./stylesheet.css";

let nameEntered = false

function interVall(binding, newRoom)
    {let eventTimer = setInterval(function() {
      binding.setState({
        roomNumber: newRoom,
      })
      clearInterval(eventTimer)
    }, 300)
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
      localStorage.setItem(binding.state.currentUser, binding.state.letters)
      console.log(localStorage)
      clearInterval(mömmö)
      if (binding.state.paused === false) {
        binding.setState({
          paused: true,
          contentPlacement: {
            top:"10px"
          }
        })
      }
   }
    binding.setState({
      secondsleft: newseconds
    });
  }, 100);
};
//hello

const EnterName = ({reference, setName}) => {
  console.log(reference.current)
  return (<div class="results-screen enter-name">
    <h1>Enter your name here</h1>
    <input ref={reference} className="name-input"></input>
    <div class="button" onClick={() => setName(reference.current.value)}><p>Enter Game</p></div>
  </div>)
}

const HighScoreRoom = ({changeRoom, style}) => {
  let scores = Object.keys(localStorage).sort(function(x, y) {
    if (localStorage[x] > localStorage[y]) return -1
    if (localStorage[x] < localStorage[y]) return 1
    return 0
  }).map(key => {
    return <div>
    {key}:{localStorage[key]}
  </div>

  })
  return(
    <div className="room-container" style={style}>
    <h1>Scoreboards</h1>
    {scores}
    <div onClick={() => changeRoom(0)} class="button back">Back</div>
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
      currentUser: undefined
    };
    this.dashvalue = React.createRef();
    this.nameValue = React.createRef()
  }
setName(newName) {
  this.setState({
    currentUser: newName
  })
  nameEntered = true
}
  changeRoom(newRoom) {
    let newRoom1Style;
    let newContentPlacement;
if (newRoom !== 0) {
newContentPlacement = "-500px"
newRoom1Style = "10px"
} else {
newContentPlacement ="10px"
newRoom1Style = "-1000px"
}


this.setState({
  room1Style: {
    top: newRoom1Style
  },
    contentPlacement: {
      top: newContentPlacement
    }
})

interVall(this, newRoom)


console.log(this.state.room1Style)
  }
  restart() {
    nameEntered = false
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
      this.nameValue.current.value = ""
  }
  setValue(newValue) {
    console.log(this.state.currentUser)
    if (this.state.secondsleft === 60 && this.state.paused === false) {
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
    if (this.state.paused === true) {
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
    if (nameEntered === false) {
      return <div>hi <EnterName reference = {this.nameValue} setName={this.setName.bind(this)}/></div>
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
