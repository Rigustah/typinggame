import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./stylesheet.css";

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
      newseconds = 0;
      binding.setState({
        contentPlacement: {
          top: "10px"
        }
      });
    }
    binding.setState({
      secondsleft: newseconds
    });
  }, 1000);
};
//hello
const ResultScreen = ({ points, restart, style }) => {
  let words = Math.floor(points / 5) * 1;
  return (
    <div class="results-screen">
      <div class="results-content" style={style}>
        <h1 class="results">
          You wrote {points} letters in one minute!{" "}
          <h1 class="wpm">Your typing speed is {words} wpm</h1>
        </h1>
        <div class="button" onClick={restart}>
          <p class="button-text">Play again?</p>
        </div>
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
      contentPlacement: {}
    };
    this.dashvalue = React.createRef();
  }
  restart() {
    this.setState({
      contentPlacement: {
        top: "-500px"
      },
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
      return (
        <div>
          <ResultScreen
            points={this.state.letters}
            restart={this.restart.bind(this)}
            style={this.state.contentPlacement}
          />
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
        <Timer secondsLeft={this.state.secondsleft} />
        <div>{this.state.letters}</div>
      </div>
    );
  }
}

export default App;
