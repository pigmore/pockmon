import logo from './logo.svg';
import './App.css';
import { useRef, useState, useEffect,createRef} from 'react';
import axios from 'axios';

function App() {
  const [pokemonList, setPokemonList] = useState([])

  useEffect(() => {
    async function init() {
      if (typeof window !== "undefined" || window.initReady !== true) {
        window.initReady = true
        axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`)
        .then(res => {
          const listTemp = res.data.results;
          setPokemonList(listTemp)
        })
      }
    }
    init()
  }, [])

  const listItems = pokemonList.map((item) =>
    <li key={item.name} className='pokemonCard'>
      <img className='App-logo' src={logo} alt=""/>
      <br/>
    {item.name}</li>
  );

  return (
    <div className="App">
      {listItems}
    </div>
  );
}

export default App;
