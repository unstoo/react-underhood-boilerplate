import OwnReact from "../src";
import Component from "../src/Component";
import Input from "./Input";
import alphabet from "./data";

function swap(arr, pairsIndecies) {
  const newArr = [...arr];
  pairsIndecies.forEach(([indexA, indexB]) => {
    const temp = newArr[indexA];
    newArr[indexA] = newArr[indexB];
    newArr[indexB] = temp;
  });
  return newArr;
}

function getRandom(max) {
  return Math.floor(Math.random() * max + 0);
}
function getRandomPair(max) {
  const first = getRandom(max);
  let second = getRandom(max);
  while (second === first) second = getRandom(max);
  return [first, second];
}

function shuffle(arr) {
  const max = arr.length;
  const numberOfPairsToSwap = getRandom(max);
  const pairsIndecies = [];
  for (let index = 0; index < numberOfPairsToSwap; index += 1) {
    const [indexA, indexB] = getRandomPair(max);
    pairsIndecies.push([indexA, indexB]);
  }
  return swap(arr, pairsIndecies);
}

class List extends Component {
  constructor(props) {
    super(props);
    const { colors, data } = props;
    this.state.data = data;
    this.state.colors = colors;
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(chars) {
    const { colors } = this.state;
    const { data } = this.props;
    const knownChars = [...chars].filter(char => data.includes(char));
    const filteredChars = data.filter(char => !knownChars.includes(char));

    this.setState({
      data: [...knownChars, ...filteredChars],
      colors: shuffle(colors)
    });
  }

  render() {
    const { data, colors } = this.state;

    return (
      <section>
        <h3 style={`color: ${colors[1]};`}>CSSSR School</h3>
        <Input type="text" changeHandler={this.changeHandler} />
        {data.map(item => (
          <div>{item}</div>
        ))}
      </section>
    );
  }
}

const colors = ["red", "green", "teal", "gold", "black"];

const App = <List data={alphabet} colors={colors} />;

export default App;
