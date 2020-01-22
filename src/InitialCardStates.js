export const ITEMS = [
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