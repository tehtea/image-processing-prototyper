// contains image processing algorithms
const WrappedAlgorithms = {
    _cannyEdgeDetection: function _cannyEdgeDetection(src, dst, processingOptions) {
        window.cv.Canny(src, dst, processingOptions.lowerThreshold,
            processingOptions.upperThreshold,
            processingOptions.sobelApertureSize,
            processingOptions.moreAccurateGradient);
    },

    _histogramEqualization: function _histogramEqualization(src, dst, processingOptions) {
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY, 0); // need to leave this here even if its grayscale for some reason otherwise will crash
        window.cv.equalizeHist(src, dst);
    },

    _medianFilter: function _medianFilter(src, dst, processingOptions) {
        window.cv.medianBlur(src, dst, processingOptions.kernelSize);
    },

    _convertRGBToGray: function _convertRGBToGray(src, dst, processingOptions) {
        window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY, 0);
    },

    _simpleBinaryThresholding: function _binaryThresholding(src, dst, processingOptions) {
        window.cv.threshold(src, dst, processingOptions.threshVal, 255, window.cv.THRESH_BINARY);
    },

    _otsuThresholding: function _otsuThresholding(src, dst, processingOptions) {
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY, 0); // need to leave this here even if its grayscale for some reason otherwise will crash
        // thresh value does not matter for otsu,
        // so a placeholder value of 69 is placed.
        window.cv.threshold(src, dst, 69, 255, window.cv.THRESH_OTSU);
    },

    _adaptiveThresholding: function _adaptiveThresholding(src, dst, processingOptions) {
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY, 0);
        window.cv.adaptiveThreshold(src, dst,
            processingOptions.maxValue,
            window.cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            window.cv.THRESH_BINARY,
            processingOptions.kernelSize,
            processingOptions.C);
    }
};

export default WrappedAlgorithms;

export function executeWrappedAlgorithm(inputCanvas, outputCanvasID, processingOptions, functionToExecute) {
    console.debug(`---- Executing algorithm: ${functionToExecute} ----`);
    console.debug("showing some debug information for the algorithm to execute");
    console.debug("input canvas:");
    console.debug(inputCanvas);
    console.debug("output canvas:");
    console.debug(document.getElementById(outputCanvasID));
    console.debug("function to execute:");
    console.debug(functionToExecute);
    console.debug("================");
    let src = window.cv.imread(inputCanvas);
    let dst = new window.cv.Mat();

    functionToExecute(src, dst, processingOptions);
    window.cv.imshow(outputCanvasID, dst);

    src.delete();
    dst.delete();

    return document.getElementById(outputCanvasID);
}

export const InitialCardStates = [
    {
        id: 1,
        algoID: 1,
        text: "RGB to Grayscale",
        processingOptions: {}
    },
    {
        id: 2,
        algoID: 2,
        text: "Histogram Equalization",
        processingOptions: {}
    },
    {
        id: 3,
        algoID: 3,
        text: "Simple Image Thresholding",
        processingOptions: {
            threshVal: 127,
        }
    },
    {
        id: 4,
        algoID: 4,
        text: "Median Filtering",
        processingOptions: {
            kernelSize: 5,
        }
    },
    {
        id: 5,
        algoID: 5,
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
        algoID: 6,
        text: "Otsu Binarization",
        processingOptions: {},
    },
    {
        id: 7,
        algoID: 7,
        text: "Adaptive Thresholding",
        processingOptions: {
            maxValue: 200,
            kernelSize: 3,
            C: 2,
        },
    }
];

// look up the function to run, its label, and its possible options based on the id of the card.
// (rationale for not adding these functions into the card directly is to have human-readable label for each algo card)
export function functionIDLookup(algoID) {
    let functionToReturn = () => {
    };
    let label = InitialCardStates.filter(state => state.algoID === algoID)[0].text;
    let processingOptions = InitialCardStates.filter(state => state.algoID === algoID)[0].processingOptions;
    switch (algoID) {
        case 1: {
            functionToReturn = WrappedAlgorithms._convertRGBToGray;
            break;
        }
        case 2: {
            functionToReturn = WrappedAlgorithms._histogramEqualization;
            break;
        }
        case 3: {
            functionToReturn = WrappedAlgorithms._simpleBinaryThresholding;
            break;
        }
        case 4: {
            functionToReturn = WrappedAlgorithms._medianFilter;
            break;
        }
        case 5: {
            functionToReturn = WrappedAlgorithms._cannyEdgeDetection;
            break;
        }
        case 6: {
            functionToReturn = WrappedAlgorithms._otsuThresholding;
            break;
        }
        case 7: {
            functionToReturn = WrappedAlgorithms._adaptiveThresholding;
            break;
        }
        default: {
        }
    }
    return [functionToReturn, label, processingOptions];
}
