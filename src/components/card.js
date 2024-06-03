function Card(props) {
  return (
    <li key={props.index} className='pokemonCard'>
      <div>
        <img className='App-logo' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${props.index+1}.png`} alt=""/>
        {props.item.name}
      </div>
      <div>

        {props.item.stats && props.item.stats.length > 0 ?
          <div>
            {props.item.stats.map(_item => (
              <tr>
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
  );
}
export default Card;
