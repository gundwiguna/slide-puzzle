import { useState } from "react";

function Tile (props) {
    const {val, index, isBlank, clickFn, transitionClass, disabled, tileColor} = props;
    const [transitioning, setTransitioning] = useState(false);
    const transitionDuration = 200;

    function doTransition(index) {
        if (disabled) {
            return;
        }
        setTransitioning(true);
        setTimeout(() => {
            setTransitioning(false);
            clickFn(index);
        }, transitionDuration);
    }
    return (<div className={'tile position-absolute d-flex align-items-center justify-content-center ' + 
                `${isBlank && !transitioning && 'blank' || ''} ${transitioning && transitionClass || ''}`}
                style={{transition: `transform ${transitionDuration/1000}s ease`, backgroundColor: tileColor}}
                onClick={() => doTransition(index)}>
        {/* ({index}) */}
        <span className="number">{val}</span>
    </div>);
}

export default Tile;