export function resolveOpenCVErrorNumber(err) {
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