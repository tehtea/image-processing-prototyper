import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Webcam from "react-webcam";

import AlgoContainer from "./Components/Container/AlgoContainer";
import {DndProvider} from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import WrappedAlgorithms from "./Algorithms";
import CanvasContainer from "./Components/CanvasContainer/CanvasContainer";

const INTERMEDIATE_OUTPUT_PREFIX = "intermediate-output-";

function App() {
    // life saviour: https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
    useEffect(() => {

        // // import openCV if it doesn't exist
        // if (!window.cv) {
        //   const openCVScript = document.createElement("script");
        //   // openCVScript.src = "https://docs.opencv.org/3.4.7/opencv.js";
        //   openCVScript.src = "https://docs.opencv.org/4.2.0/utils.js";
        //   // openCVScript.src = "https://cdn.jsdelivr.net/gh/tehtea/Opencv.js-Compiled-Exception-Enabled@1.0/opencv_exception_enabled.js";
        //   openCVScript.async = true;
        //   openCVScript.crossOrigin = "anonymous"; // enable CORS
        //   document.body.appendChild(openCVScript);
        //
        //   let utils = new Utils('errorMessage');
        //   utils.loadOpenCv();
        // }

        // // check for change in number of cards and reset image processing (and possibly delete or insert canvases) if so
        // if (!window.numberOfCards)
        //   window.numberOfCards = cards.length;
        // else if (window.numberOfCards !== cards.length) {
        //   beginImageProcessing();
        // }

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
                    if (typeof err === 'undefined') {
                        err = '';
                    } else if (typeof err === 'number') {
                        if (!isNaN(err)) {
                            if (typeof cv !== 'undefined') {
                                err = 'Exception: ' + window.cv.exceptionFromPtr(err).msg;
                            }
                        }
                    } else if (typeof err === 'string') {
                        let ptr = Number(err.split(' ')[0]);
                        if (!isNaN(ptr)) {
                            if (typeof cv !== 'undefined') {
                                err = 'Exception: ' + window.cv.exceptionFromPtr(ptr).msg;
                            }
                        }
                    } else if (err instanceof Error) {
                        err = err.stack.replace(/\n/g, '<br>');
                    }
                    console.error(err);
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

    const ITEMS = [
        {
            id: 1,
            text: "RGB to Grayscale",
            processingOptions: {}
        },
        {
            id: 2,
            text: "Histogram Equalization",
            processingOptions: {}
        },
        {
            id: 3,
            text: "Simple Image Thresholding",
            processingOptions: {
                threshVal: 127,
            }
        },
        {
            id: 4,
            text: "Median Filtering",
            processingOptions: {
                kernelSize: 5,
            }
        },
        {
            id: 5,
            text: "Canny Edge Detection",
            processingOptions: {
                lowerThreshold: 50,
                upperThreshold: 100,
                sobelApertureSize: 3,
                moreAccurateGradient: false,
            }
        },
        {
            id: 6,
            text: "Hough Lines Transform (For line detection)",
            processingOptions: {},
        },
        {
            id: 7,
            text: "Hough Circles Transform (For circle detection)",
            processingOptions: {},
        }
    ];
    let [cards, setCards] = useState(ITEMS);

    // dude you're using react why the hell do you need such a function when you can do ReactDOM.render

    // function initializeCanvasElements() {
    //   function initializeCanvasElement(id) {
    //     return <canvas
    //         key={id}
    //         id={id}
    //     ></canvas>
    //   }
    //
    //   // don't do this:
    //   // for (let card of cards) {
    //   //   return initializeVideoElement('output-'+card.id);
    //   // rationale to not do this is to decouple video element initialization from card information
    //
    //   // delete extra elements
    //   let existingCanvases = document.getElementsByTagName("canvas");
    //   if (existingCanvases.length > cards.length) {
    //     for (let i = cards.length; i < existingCanvases.length; i++) {
    //       let id = INTERMEDIATE_OUTPUT_PREFIX + i;
    //       console.log(`testing deleting card with id: ${id}`);
    //       // let currentCanvasToDelete = document.getElementById(id);
    //       console.log(document.getElementById(id));
    //       // document.getElementById(id).outerHTML = "";
    //     }
    //   }
    //
    //   // Generate elements if not created yet, so must do a check
    //   return (
    //       <div className={"intermediate-outputs"}>
    //         {cards.map(function(card, index){
    //           if (!document.getElementById(INTERMEDIATE_OUTPUT_PREFIX + index))
    //           return initializeCanvasElement(INTERMEDIATE_OUTPUT_PREFIX + index);
    //         })}
    //       </div>
    //   )
    // }

    // function beginImageProcessing() {
    //     console.log("resetting image processing");
    //
    //     // if (window.ImageProcessing)
    //     clearInterval(window.ImageProcessing);
    //
    //     window.ImageProcessing = setInterval(() => {
    //         if (!window.webcam)
    //             window.webcam = webcamRef.current;
    //         const originalCanvas = window.webcam.getCanvas();
    //         if (window.cv)
    //             console.log('opencv loaded');
    //         else {
    //             console.log('opencv not loaded, will exit');
    //             clearInterval(window.ImageProcessing);
    //             return;
    //         }
    //
    //         if (!originalCanvas) {
    //             clearInterval(window.ImageProcessing);
    //             return;
    //         }
    //
    //         // something like dequeueing
    //         let currentCanvas = originalCanvas;
    //         console.log(cards);
    //         console.log(cards.length);
    //         for (let i = 0; i < cards.length; i++) {
    //             console.log(i);
    //             let card = cards[i];
    //
    //             // for debug purposes
    //             console.log("----- CURRENT CARD STATUSES ----");
    //             console.log("CURRENT CANVAS TO INPUT FROM:");
    //             console.log(currentCanvas);
    //             console.log("CURRENT CANVAS TO OUTPUT TO:");
    //             console.log(INTERMEDIATE_OUTPUT_PREFIX + i);
    //             console.log("CURRENT SET OF PROCESSING OPTIONS");
    //             console.log(card.processingOptions);
    //             console.log("///////////");
    //
    //             // do sth based on card id
    //             try {
    //                 switch (card.id) {
    //                     case 1: {
    //                         currentCanvas = WrappedAlgorithms._convertRGBToGray(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions);
    //                         break;
    //                     }
    //                     case 2: {
    //                         currentCanvas = WrappedAlgorithms._histogramEqualization(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions); // process the current intermediate output
    //                         break;
    //                     }
    //                     case 3: {
    //                         currentCanvas = WrappedAlgorithms._binaryThresholding(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions);
    //                         break;
    //                     }
    //                     case 4: {
    //                         currentCanvas = WrappedAlgorithms._medianFilter(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions);
    //                         break;
    //                     }
    //                     case 5: {
    //                         currentCanvas = WrappedAlgorithms._cannyEdgeDetection(currentCanvas, INTERMEDIATE_OUTPUT_PREFIX + i, card.processingOptions);
    //                         break;
    //                     }
    //                     case 6: {
    //                         break;
    //                     }
    //                     case 7: {
    //                         break;
    //                     }
    //                     default: {
    //                     }
    //                 }
    //             } catch (err) {
    //               if (typeof err === 'undefined') {
    //                 err = '';
    //               } else if (typeof err === 'number') {
    //                 if (!isNaN(err)) {
    //                   if (typeof cv !== 'undefined') {
    //                     err = 'Exception: ' + window.cv.exceptionFromPtr(err).msg;
    //                   }
    //                 }
    //               } else if (typeof err === 'string') {
    //                 let ptr = Number(err.split(' ')[0]);
    //                 if (!isNaN(ptr)) {
    //                   if (typeof cv !== 'undefined') {
    //                     err = 'Exception: ' + window.cv.exceptionFromPtr(ptr).msg;
    //                   }
    //                 }
    //               } else if (err instanceof Error) {
    //                 err = err.stack.replace(/\n/g, '<br>');
    //               }
    //               console.error(err);
    //             }
    //
    //         }
    //     }, 1000);
    // }

    // entry point for image processing
    const onUserMedia = () => {
        window.webcam = webcamRef.current;
        // beginImageProcessing();
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
                            // beginImageProcessing={beginImageProcessing}
                            beginImageProcessing={() => {}}
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
