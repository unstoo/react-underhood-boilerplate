import OwnReact from "../src";
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

const getDataFactory = array => {
  let once = true;
  return () => {
    if (once) {
      once = false;
      return array;
    }
    return shuffle(array);
  };
};

const List = data => {
  return (
    <section>
      {data.map(letter => (
        <div>{letter}</div>
      ))}
    </section>
  );
};

export default List;
export const getData = getDataFactory(alphabet);
