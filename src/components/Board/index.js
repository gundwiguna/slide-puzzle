import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useHtmlToImage from "../../hooks/useHtmlToImage";
import ShareButtons from "../ShareButtons";
import './board.css';
import Tile from "./Tile";

function Board () {
    const tilesLength = 25;
    const [tiles, setTiles] = useState([]);
    const [blankIndex, setBlankIndex] = useState(tilesLength - 1);
    const [possibleTiles, setPossibleTiles] = useState([]);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [win, setWin] = useState(false);
    const [tileHeight, setTileHeight] = useState(0);
    const [ready, setReady] = useState(false);
    const [movesCount, setMovesCount] = useState(0);
    const [sharePanelActive, setSharePanelActive] = useState(false);

    const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853', '#663399'];
    const ref = React.createRef();

    const { convertToImage: downloadResult } = useHtmlToImage();

    function checkWin(newTiles) {
        let currentValue = newTiles[0];
        const isWinning = !newTiles.some((val) => {
            if (val !== currentValue) {
                return true;
            }
            currentValue++;
            return false;
        });
        setWin(isWinning);
    }

    function calculatePossibleMoves(bIndex) {
        const availableMoves = [], availableTileIndexes = [];
        let ableToMoveUp = bIndex >= 5,
            ableToMoveDown = bIndex <= 19,
            ableToMoveLeft = bIndex % 5 !== 0,
            ableToMoveRight = bIndex % 5 !== 4;
        if (ableToMoveUp) {
            availableMoves.push('Up');
            availableTileIndexes.push(bIndex - 5);
        }
        if (ableToMoveDown) {
            availableMoves.push('Down');
            availableTileIndexes.push(bIndex + 5);
        }
        if (ableToMoveLeft) {
            availableMoves.push('Left');
            availableTileIndexes.push(bIndex - 1);
        }
        if (ableToMoveRight) {
            availableMoves.push('Right');
            availableTileIndexes.push(bIndex + 1);
        }

        setPossibleTiles(availableTileIndexes);
        setPossibleMoves(availableMoves);
        if (!ready) {
            setReady(true);
        }
        return availableMoves;
    }

    function incrementMovesCount() {
        setMovesCount(movesCount + 1);
    }

    function clickTileHanler(newBlankIndex) {
        if (possibleTiles.indexOf(newBlankIndex) === -1) {
            return;
        }

        // Swapping the tiles
        const currentValue = tiles[blankIndex];
        const newValue = tiles[newBlankIndex];
        const newTiles = [...tiles];
        newTiles[blankIndex] = newValue;
        newTiles[newBlankIndex] = currentValue;

        setBlankIndex(newBlankIndex);
        calculatePossibleMoves(newBlankIndex);
        setTiles(newTiles);
        checkWin(newTiles);
        incrementMovesCount();
    }

    function getTransitionClassName(index) {
        const id = possibleTiles.indexOf(index);
        return 'blank' + possibleMoves[id];
    }

    let epoch = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();;
    if (win) {
        epoch = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();
    }
    
    useEffect(function () {
        if (ready) {
            setTimeout(() => {
                const tileRef = ref.current && ref.current.querySelector('.tile-container');
                const newTileHeight = tileRef && tileRef.offsetWidth;
                if (newTileHeight && newTileHeight !== tileHeight) {
                    setTileHeight(newTileHeight);
                }
            }, 300);
        }
    }, [ready, ref, tileHeight])

    useEffect(function () {
        const randomizeTile = () => {
            let tileNumbers = [];
            while (tileNumbers.length < tilesLength) {
                let randomNumber = (Math.floor((Math.random() * 100)) % tilesLength) + 1;
                if (tileNumbers.indexOf(randomNumber) === -1) {
                    tileNumbers.push(randomNumber);
                }
            }

            // For win debugging
            // for(let i=0; i<=22; i++) {
            //     tileNumbers.push(i);
            // }
            // tileNumbers.push(24, 23);
    
            let tempBlankIndex = tileNumbers.indexOf(tilesLength);
            setBlankIndex(tempBlankIndex);
            setTiles(tileNumbers);
            calculatePossibleMoves(tempBlankIndex);
        }
    
        randomizeTile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<div>
        <Container>
        <div style={{minHeight: '95vh'}} className="d-flex flex-column align-items-center mt-3">
            {/* <h1>Board Component, Blank = {blankIndex}</h1>
            <h3>Possible moves: {possibleMoves.join(', ')}</h3>
            <h3>Possible indexes: {possibleTiles.join(', ')}</h3> */}
            {ready &&
            <Row className="w-100 justify-content-center">
                <Col xs="12" md="9" lg="7" xl="4" id="board-container">
                    <h2 className="text-center">Slide Puzzle Game</h2>

                    {win && <h3 className="text-center text-danger">You Won With {movesCount} moves!</h3>}
                    {!win && <h5 className="mb-0 text-center">Moves: {movesCount}</h5>}
                    <Row className="board justify-content-center pt-2 pb-4" ref={ref}>
                        {tiles.map((val, key) => <Col 
                            key={key} 
                            xs={{ span: 2 }}
                            style={{height: `${tileHeight}px`, transition: 'height 100ms ease'}}
                            className={'p-0 position-relative tile-container ' + ((key+1)%5 === 0 ? 'me-1' : '')}>
                                <Tile
                                val={val}
                                index={key}
                                isBlank={key === blankIndex}
                                transitionClass={getTransitionClassName(key)}
                                disabled={possibleTiles.indexOf(key) === -1}
                                tileColor={colors[val%5]}
                                clickFn={clickTileHanler} />
                            </Col>)}
                    </Row>
                    {win && <div className="text-secondary text-italic text-center">{epoch}</div>}
                </Col>
            </Row>}
            <div className="mt-auto links-container">
                <a href="https://github.com/gundwiguna/slide-puzzle" rel="noreferrer" target="_blank">Source</a> • <a href="https://www.linkedin.com/in/anggun-dwiguna-53197511a/" rel="noreferrer" target="_blank">Anggun Dwiguna</a>
            </div>
            <ShareButtons 
                callback={() => downloadResult('board-container')}
                closeCallback={() => setSharePanelActive(false)}
                active={sharePanelActive} />
        </div>
        </Container>
    </div>);
}

export default Board;