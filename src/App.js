import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Webcam from "react-webcam";

import AlgoContainer from "./Components/Container/AlgoContainer";
import {DndProvider} from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import WrappedAlgorithms from "./Algorithms";
import CanvasContainer from "./Components/CanvasContainer/CanvasContainer";

import {INTERMEDIATE_OUTPUT_PREFIX} from "./Constants";
import {resolveOpenCVErrorNumber} from "./utils.js";
import {ITEMS} from "./InitialCardStates";

function App() {
    // life saviour: https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
    useEffect(() => {
        if (!window.webcam)
            window.webcam = webcamRef.current;

        const interval = setInterval(() => {

            const originalCanvas = window.webcam.getCanvas();
            if (window.cv)
                console.log('opencv loaded');
            else {
                console.log('opencv not loaded, will exit');
                return;
            }

            if (!originalCanvas) {
                return;
            }

            // something like dequeueing
            let currentCanvas = originalCanvas;
            console.log(cards);
            console.log(cards.length);
            for (let i = 0; i < cards.length; i++) {
                console.log(i);
                let card = cards[i];

                // for debug purposes
                console.log("----- CURRENT CARD STATUSES ----");
                console.log("CURRENT CANVAS TO INPUT FROM:");
                console.log(currentCanvas);
                console.log("CURRENT CANVAS TO OUTPUT TO:");
                console.log(INTERMEDIATE_OUTPUT_PREFIX + i);
                console.log("CURRENT SET OF PROCESSING OPTIONS");
                console.log(card.processingOptions);
                console.log("///////////");

                // do sth based on card id
                try {
                    switch (card.id) {
                        case 1: {
                            currentCanvas = WrappedAlgorithms._convertRGBToGray(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions);
                            break;
                        }
                        case 2: {
                            currentCanvas = WrappedAlgorithms._histogramEqualization(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions); // process the current intermediate output
                            break;
                        }
                        case 3: {
                            currentCanvas = WrappedAlgorithms._binaryThresholding(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions);
                            break;
                        }
                        case 4: {
                            currentCanvas = WrappedAlgorithms._medianFilter(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions);
                            break;
                        }
                        case 5: {
                            currentCanvas = WrappedAlgorithms._cannyEdgeDetection(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions);
                            break;
                        }
                        case 6: {
                            break;
                        }
                        case 7: {
                            break;
                        }
                        default: {
                        }
                    }
                } catch (err) {
                    resolveOpenCVErrorNumber(err);
                }
            }

        }, 1000);

        return () => clearInterval(interval);
    });

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };
    const webcamRef = React.useRef(null);

    let [cards, setCards] = useState(ITEMS);

    // entry point for image processing
    const onUserMedia = () => {
        window.webcam = webcamRef.current;
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <div className={"processing-interface"}>
                    <div className={"video-pipeline"}>
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
                    <DndProvider backend={Backend}>
                        <AlgoContainer
                            cards={cards}
                            setCards={setCards}
                        />
                    </DndProvider>
                </div>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
