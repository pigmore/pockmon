import logo from './logo.svg';
import './App.css';
import { useRef, useState, useEffect,createRef} from 'react';
import axios from 'axios';
import Card from './components/card';

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [pokemonSearch, setPokemonSearch] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
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
    setSearching(true)
    window.timeout = setTimeout(
      ()=>{
        axios.get(`https://pokeapi.co/api/v2/pokemon/${search.toString().toLowerCase()}`)
        .then(res => {
          console.log(res.data)
          setSearching(false)
          setPokemonSearch(res.data)
        })
        .catch(function (error) {
          setSearching(false)
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
      <Card index={pokemonSearch.id} item={pokemonSearch}/>
    )
  }
  const listItems = pokemonList.map((item,index) =>
    <Card key={'card'+index} index={index} item={item}/>
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
          placeholder='Search by Name or Number'
          onChange={
            (e)=>{
              setSearch(e.target.value)
            }
          }
        />
      </div>

      {
        search.length>0 ?
        <div className="App aligncenter">
          {
            pokemonSearch !=null ?
            resultItem()
            :
            searching ?
            'Searching...'
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
