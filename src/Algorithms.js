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

    _binaryThresholding: function _binaryThresholding(inputCanvas, outputCanvasID, processingOptions) {
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
};


export default WrappedAlgorithms;

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
            functionToReturn = WrappedAlgorithms._binaryThresholding;
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
