function Tile ({val, index, isBlank, clickFn}) {
    return (<div className={`tile ${isBlank && 'blank'}`}
                onClick={() => clickFn(index)}>
        ({index})
        <h3>{val}</h3>
    </div>);
}

export default Tile;