import logo from './logo.svg';
import './App.css';
import { useRef, useState, useEffect,createRef} from 'react';
import axios from 'axios';

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [page, setPage] = useState(1)
  const [visible, setVisible] = useState(0)
  const [totalCard, setTotalCard] = useState(0)
  const loadBasicStates = async (index)=>{
    axios.get(index)
    .then(res => {
      return res.data.stats;
    })
  }
  useEffect(() => {
    async function init() {
      if (typeof window !== "undefined" || window.initReady !== true) {
        loadMoreCards()
      }
    }
    init()
  }, [])


  const loadMoreCards = ()=>{

    if (!window.isloading || window.initReady) {
      window.isloading = true
      axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${visible}&limit=20`)
      .then(res => {
        let listTemp = res.data.results;
        // listTemp.map(async (item,index)=>{
        //   item.state = await loadBasicStates(item.url)
        // })
        let promiseArray = []
        listTemp.forEach((item, i) => {
          promiseArray.push(axios.get(item.url))
        });

        Promise.all(promiseArray).then((res0) => {
          window.isloading = false
          listTemp.map((item,index)=>{
            item.state = res0[index].data.stats
          })
          if (window.initReady) {
            setPokemonList((prev)=>[...prev,...listTemp])
            setVisible((prev)=>prev +listTemp.length)
          }else{
            setTotalCard(res.data.count)
            setPokemonList(listTemp)
            setVisible(listTemp.length)
            window.initReady = true
          }

        });


      })
    }
  }

  const statItems = (array) => {
    let stateTemp = ''
    array.forEach((_item, i) => {
      stateTemp += `${_item.stat.name}:${_item.base_stat}`
      stateTemp += '\n'
    });
    return stateTemp
  }
  const listItems = pokemonList.map((item,index) =>
    <li key={index} className='pokemonCard'>
      <img className='App-logo' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${index+1}.png`} alt=""/>
      <br/>
      {item.name}
      <br/>
      {item.state && item.state.length > 0 ? statItems(item.state) : null}
    </li>
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
    if (window.initReady) loadMoreCards();
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
    >
      {listItems}
    </div>
  );
}

export default App;
