const WrappedAlgorithms = {
    _cannyEdgeDetection: function _cannyEdgeDetection(inputCanvas, outputCanvasID, processingOptions) {
        let src = window.cv.imread(inputCanvas);
        let dst = new window.cv.Mat();
        window.cv.cvtColor(src, src, window.cv.COLOR_RGB2GRAY, 0);

        // You can try more different parameters
        window.cv.Canny(src, dst, processingOptions.lowerThreshold,
                                    processingOptions.upperThreshold,
                                    processingOptions.sobelApertureSize,
                                    processingOptions.moreAccurateGradient);

        console.log("performing Canny with the following parameters: ");
        console.log(processingOptions);
        window.cv.imshow(outputCanvasID, dst);
        src.delete();
        dst.delete();
    },
    _histogramEqualization: function _histogramEqualization(inputCanvas, outputCanvasID, processingOptions) {
        let src = window.cv.imread(inputCanvas);
        let dst = new window.cv.Mat();

        if (src.matSize.length > 2) {
            console.log("cannot do histogram equalization");
            return document.getElementById(outputCanvasID);
        }

        // console.log(src);
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY, 0); // need to leave this here even if its grayscale for some reason otherwise will crash
        // console.log(src);
        window.cv.equalizeHist(src, dst);
        window.cv.imshow(outputCanvasID, dst);

        src.delete();
        dst.delete();

        return document.getElementById(outputCanvasID);
    },
    _medianFilter: function _medianFilter(inputCanvas, outputCanvasID, processingOptions) {
        let src = window.cv.imread(inputCanvas);
        let dst = new window.cv.Mat();

        console.log("performing median blur with the following parameters: ");
        console.log(processingOptions);

        window.cv.medianBlur(src, dst, processingOptions.kernelSize);
        window.cv.imshow(outputCanvasID, dst);

        src.delete();
        dst.delete();

        return document.getElementById(outputCanvasID);
    },

    _convertRGBToGray: function _convertRGBToGray(inputCanvas, outputCanvasID, processingOptions) {
        let src = window.cv.imread(inputCanvas);
        let dst = new window.cv.Mat();

        window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY, 0);
        window.cv.imshow(outputCanvasID, dst);

        src.delete();
        dst.delete();

        return document.getElementById(outputCanvasID);
    },

    _simpleBinaryThresholding: function _binaryThresholding(inputCanvas, outputCanvasID, processingOptions) {
        let src = window.cv.imread(inputCanvas);
        let dst = new window.cv.Mat();

        window.cv.threshold(src, dst, processingOptions.threshVal, 255, window.cv.THRESH_BINARY);
        window.cv.imshow(outputCanvasID, dst);

        console.log("performing binary thresholding with the following parameters: ");
        console.log(processingOptions);

        src.delete();
        dst.delete();

        return document.getElementById(outputCanvasID);
    },

    _otsuThresholding: function _otsuThresholding(inputCanvas, outputCanvasID, processingOptions) {
        let src = window.cv.imread(inputCanvas);
        let dst = new window.cv.Mat();

        window.cv.threshold(src, dst, processingOptions.threshVal, 255, window.cv.THRESH_OTSU);
        window.cv.imshow(outputCanvasID, dst);

        console.log("performing otsu thresholding with the following parameters: ");
        console.log(processingOptions);

        src.delete();
        dst.delete();

        return document.getElementById(outputCanvasID);
    },
};

export default WrappedAlgorithms;

export const InitialCardStates = [
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
        text: "Otsu Binarization",
        processingOptions: {},
    },
    {
        id: 7,
        text: "Hough Circles Transform (For circle detection)",
        processingOptions: {},
    }
];

export function functionIDLookup(id) {
    let functionToReturn = () => {};
    switch (id) {
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
            break;
        }
        default: {
        }
    }
    return functionToReturn;
}
