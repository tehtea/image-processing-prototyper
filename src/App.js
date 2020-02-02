import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

// for webcam
import Webcam from "react-webcam";

// for cards and drag-and-drop
import {DndProvider} from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import AlgoContainer from "./Components/AlgoContainer/AlgoContainer";

// for the intermediate output
import CanvasContainer from "./Components/CanvasContainer/CanvasContainer";

// for the image processing algorithms
import {INTERMEDIATE_OUTPUT_PREFIX, DELAY} from "./Constants";
import {resolveOpenCVErrorNumber} from "./utils.js";
import {executeWrappedAlgorithm, functionIDLookup, allPossibleCards} from "./Algorithms";
import update from "immutability-helper";

function App() {

    // something like constructor
    //////////////////////////////////////////////////
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };
    const webcamRef = React.useRef(null);

    let appState = {
        cards: allPossibleCards,
        exceptionOccurred: false,
    };

    let [state, setState] = useState(appState);

    let cards = state.cards;

    let setCards = (setCardsSpec) => {
        return setState(update(state, {
            cards: setCardsSpec
        }))
    };

    // entry point for image processing
    const onUserMedia = () => {
        window.webcam = webcamRef.current;
    };
    //////////////////////////////////////////////////

    // life saviour: https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
    useEffect(() => {
        if (!window.webcam)
            window.webcam = webcamRef.current;

        if (window.cv) {
            if (state.exceptionOccurred) {
                console.log("resetting this");
                setState(
                    update(state, {$toggle: ["exceptionOccurred"]})
                );
            }
        } else {
            console.log('opencv not loaded, will exit');
            return;
        }

        const interval = setInterval(() => {

            console.log(`exception occurred status: ${state.exceptionOccurred}`)
            if (state.exceptionOccurred) {
                console.debug("unresolved exception. Pipeline will not run.");
                return;
            }

            const originalCanvas = window.webcam.getCanvas();

            if (!originalCanvas) {
                return;
            }

            // something like dequeueing
            let currentCanvas = originalCanvas;
            // console.log(cards);
            // console.log(cards.length);
            for (let i = 0; i < cards.length; i++) {
                // console.log(i);
                let card = cards[i];

                // for debug purposes
                console.debug("----- CURRENT CARD STATUSES ----");
                console.debug("CURRENT CANVAS TO INPUT FROM:");
                console.debug(currentCanvas);
                console.debug("CURRENT CANVAS TO OUTPUT TO:");
                console.debug(INTERMEDIATE_OUTPUT_PREFIX + i);
                console.debug("CURRENT SET OF PROCESSING OPTIONS");
                console.debug(card.processingOptions);
                console.debug("///////////");

                // do sth based on card id
                try {
                    let [functionToRun, ,] = functionIDLookup(card.algoID);
                    currentCanvas = executeWrappedAlgorithm(currentCanvas,
                        INTERMEDIATE_OUTPUT_PREFIX + i,
                        card.processingOptions,
                        functionToRun);
                } catch (err) {
                    let errorText = `Error on card ${card.id}, which does ${card.text}. Error message: ${resolveOpenCVErrorNumber(err)}`;
                    console.error(errorText);
                    document.getElementById("error-text").innerText = errorText;
                    if (!state.exceptionOccurred)
                        setState(
                            update(state, {$toggle: ["exceptionOccurred"]})
                        )
                }
            }

        }, DELAY);

        return () => clearInterval(interval);
    }, [state.cards]);

    return (
        <div className="App">
            <div className={"processing-interface"}>
                {/* video pipeline shows the input from the camera detected and all intermediate outputs from each stage */}
                <div className={"video-pipeline"}>
                    <h2>Video Input and Intermediate Outputs (in order from top to bottom)</h2>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        onUserMedia={onUserMedia}
                    />
                    <CanvasContainer
                        cards={cards}
                    />
                </div>
                {/* DndProvider needed for drag and drop functionality in AlgoContainer */}
                <DndProvider backend={Backend}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "30vw",
                    }}>
                        <p
                            id="error-text"
                            style={{
                                color: "red",
                                overflowWrap: "break-word",
                            }}
                        ></p>
                        <AlgoContainer
                            cards={cards}
                            setCards={setCards}
                        />
                    </div>
                </DndProvider>
            </div>
        </div>
    );
}

export default App;
