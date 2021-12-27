import { useState } from "react";

function Tile (props) {
    const {val, index, isBlank, clickFn, transitionClass, disabled} = props;
    const [transitioning, setTransitioning] = useState(false);

    function doTransition(index) {
        if (disabled) {
            return;
        }
        setTransitioning(true);
        setTimeout(() => {
            setTransitioning(false);
            clickFn(index);
        }, 300);
    }
    return (<div className={'tile position-absolute ' + 
        `${isBlank && !transitioning && 'blank' || ''} ${transitioning && transitionClass || ''}`}
                onClick={() => doTransition(index)}>
        ({index})
        <h3>{val}</h3>
    </div>);
}

export default Tile;