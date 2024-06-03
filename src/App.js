import logo from './logo.svg';
import './App.css';
import { useRef, useState, useEffect,createRef} from 'react';
import axios from 'axios';

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [page, setPage] = useState(1)
  const [visible, setVisible] = useState(0)
  const [totalCard, setTotalCard] = useState(0)

  useEffect(() => {
    async function init() {
      if (typeof window !== "undefined" || window.initReady !== true) {

        axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`)
        .then(res => {
          const listTemp = res.data.results;

          setTotalCard(res.data.count)
          setPokemonList(listTemp)
          setVisible(listTemp.length)
          window.initReady = true
        })
      }
    }
    init()
  }, [])

  const loadMoreCards = ()=>{
    axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`)
    .then(res => {
      const listTemp = res.data.results;

      setPokemonList((prev)=>[...prev,...listTemp])
      setVisible((prev)=>prev +listTemp.length)
    })
  }

  const listItems = pokemonList.map((item,index) =>
    <li key={index} className='pokemonCard'>
      <img className='App-logo' src={logo} alt=""/>
      <br/>
    {item.name}</li>
  );

  const handleOnScroll = () => {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight
      && window.initReady
    ) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    loadMoreCards();
  }, [page]);

  useEffect(() => {
    visible < totalCard && totalCard > 0 && window.initReady
      ? window.addEventListener("scroll", handleOnScroll)
      : window.removeEventListener("scroll", handleOnScroll);
    return () => {
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, [visible]);


  return (
    <div className="App"
      onClick={loadMoreCards}
    >
      {listItems}
    </div>
  );
}

export default App;
