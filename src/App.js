import logo from './logo.svg';
import './App.css';
import { useRef, useState, useEffect,createRef} from 'react';
import axios from 'axios';

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [pokemonSearch, setPokemonSearch] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(0)
  const [totalCard, setTotalCard] = useState(0)
  const loadBasicstats = async (index)=>{
    axios.get(index)
    .then(res => {
      return res.data.stats;
    })
  }
  useEffect(() => {
    async function init() {
      window.timeout = null;
      if (typeof window !== "undefined" || window.initReady !== true) {
        loadMoreCards()
      }
    }
    init()
  }, [])


  const searchCards = ()=>{
    if (search.length < 1) return

    if(window.timeout !== null)  clearTimeout(window.timeout);
    setPokemonSearch(null)
    window.timeout = setTimeout(
      ()=>{
        axios.get(`https://pokeapi.co/api/v2/pokemon/${search}`)
        .then(res => {
          console.log(res.data)
          setPokemonSearch(res.data)
        })
        .catch(function (error) {
          console.log('Error', error.message);
        })
      }
    , 1000);

  }
  const loadMoreCards = ()=>{

    if (!window.isloading || window.initReady) {
      window.isloading = true
      axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${visible}&limit=20`)
      .then(res => {
        let listTemp = res.data.results;
        // listTemp.map(async (item,index)=>{
        //   item.stats = await loadBasicstats(item.url)
        // })
        let promiseArray = []
        listTemp.forEach((item, i) => {
          promiseArray.push(axios.get(item.url))
        });

        Promise.all(promiseArray).then((res0) => {
          window.isloading = false
          listTemp.map((item,index)=>{
            item.stats = res0[index].data.stats
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

        })
        .catch(function (error) {
          console.log('Error', error.message);
        })

      })
      .catch(function (error) {
        console.log('Error', error.message);
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
  const resultItem = ()=>{
    return(
      <li className='pokemonCard'>
        <div>
          <img className='App-logo' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonSearch.id}.png`} alt=""/>
          {pokemonSearch.name}
        </div>
        <div>

          {pokemonSearch.stats && pokemonSearch.stats.length > 0 ?
            <div>
              {pokemonSearch.stats.map((_item,index) => (
                <tr key= {index} >
                  <td>{
                      _item.stat.name == 'special-attack' ? 'sp.atk':
                      _item.stat.name == 'special-defense' ? 'sp.def':
                      _item.stat.name
                  }&nbsp;</td>
                  <td>{_item.base_stat}</td>
                </tr>
              ))}
            </div>
          : null}
        </div>

      </li>
    )
  }
  const listItems = pokemonList.map((item,index) =>
    <li key={index} className='pokemonCard'>
      <div>
        <img className='App-logo' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${index+1}.png`} alt=""/>
        {item.name}
      </div>
      <div>

        {item.stats && item.stats.length > 0 ?
          <tbody>
            {item.stats.map(_item => (
              <tr>
                <td>{
                    _item.stat.name == 'special-attack' ? 'sp.atk':
                    _item.stat.name == 'special-defense' ? 'sp.def':
                    _item.stat.name
                }&nbsp;</td>
                <td>{_item.base_stat}</td>
              </tr>
            ))}
          </tbody>
        : null}
      </div>

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
      searchCards()
  }, [search]);



  useEffect(() => {
    visible < totalCard && totalCard > 0 && window.initReady
      ? window.addEventListener("scroll", handleOnScroll)
      : window.removeEventListener("scroll", handleOnScroll);
    return () => {
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, [visible]);


  return (
    <div>
      <div className="searchbar">
        <input
          type="text"
          placeholder='Search by Name'
          onChange={
            (e)=>{
              setSearch(e.target.value)
            }
          }
        />
      </div>

      {
        search.length>0 ?
        <div className="App">
          {
            pokemonSearch !=null ?
            resultItem()
            :
            'Nothing Exist.'
          }
        </div>
        :
        <div className="App">
          {listItems}
        </div>
      }
    </div>
  );
}

export default App;
