function Card(props) {
  return (
    <li className='pokemonCard'>
      <div>
        <img className='App-logo' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${props.index+1}.png`} alt=""/>
        {props.item.name}
      </div>
      <div>

        {props.item.stats && props.item.stats.length > 0 ?
          <table>
            <tbody>
              {props.item.stats.map((_item,_index) => (
                <tr key={_index+'states'}>
                  <td>&nbsp;&nbsp;{
                      _item.stat.name == 'special-attack' ? 'sp.atk':
                      _item.stat.name == 'special-defense' ? 'sp.def':
                      _item.stat.name
                  }&nbsp;</td>
                  <td>{_item.base_stat}&nbsp;&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        : null}
      </div>
    </li>
  );
}
export default Card;
