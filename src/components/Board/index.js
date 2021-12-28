import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import './board.css';
import Tile from "./Tile";

function Board (props) {
    const tilesLength = 25;
    const [tiles, setTiles] = useState([]);
    const [blankIndex, setBlankIndex] = useState(tilesLength - 1);
    const [possibleTiles, setPossibleTiles] = useState([]);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [win, setWin] = useState(false);
    const [tileHeight, setTileHeight] = useState(100);
    const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853', '#663399'];

    function randomizeTile() {
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

    function checkWin(newTiles) {
        let currentValue = newTiles[0];
        const isWinning = !newTiles.some((val) => {
            if (val != currentValue) {
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
        return availableMoves;
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
    }

    function getTransitionClassName(index) {
        const id = possibleTiles.indexOf(index);
        return 'blank' + possibleMoves[id];
    }

    useEffect(function () {
        randomizeTile();
    }, []);

    useEffect(function () {
        const tileRef = ref.current && ref.current.querySelector('.tile-container');
        const newTileHeight = tileRef && tileRef.offsetWidth;
        if (newTileHeight && newTileHeight !== tileHeight) {
            setTileHeight(newTileHeight);
        }
    }, [tiles])

    const ref = React.createRef();
    return (<div>
        <Container>
        <div className="d-flex flex-column align-items-center mt-3">
            <h2>Slide Puzzle Game</h2>
            {/* <h1>Board Component, Blank = {blankIndex}</h1>
            <h3>Possible moves: {possibleMoves.join(', ')}</h3>
            <h3>Possible indexes: {possibleTiles.join(', ')}</h3>
            <h3>WIN: {win ? 'TRUE' : 'FALSE'}</h3> */}
            <Row className="w-100 justify-content-center">
                <Col xs="12" md="9" lg="7" xl="4">
                    <Row className="board justify-content-center" ref={ref}>
                        {tiles.map((val, key) => <Col 
                            key={key} 
                            xs={{ span: 2 }}
                            style={{height: `${tileHeight}px`}}
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
                </Col>
            </Row>
        </div>
        </Container>
    </div>);
}

export default Board;