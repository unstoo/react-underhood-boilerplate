import OwnReact from "../src";
import Component from "../src/Component";
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
    const { colors, data, shuffleRate } = props;
    this.state.data = data;
    this.state.colors = colors;
    this.state.shouldShuffle = false;
    this.state.timer =
      shuffleRate && setInterval(this.shuffle.bind(this), shuffleRate);
  }

  shuffle() {
    const { data, colors } = this.state;
    this.setState({
      shouldShuffle: true,
      data: shuffle(data),
      colors: shuffle(colors)
    });
  }

  render() {
    const { data, colors } = this.state;

    return (
      <section>
        <h3 style={`color: ${colors[1]};`}>CSSSR School</h3>
        {data.map(item => (
          <div>{item}</div>
        ))}
      </section>
    );
  }
}

const colors = ["red", "green", "teal", "gold", "black"];

const App = <List shuffleRate={5000} data={alphabet} colors={colors} />;

export default App;
