/**
 * A utility function to create an Error object from various types of exceptions
 *
 * @param exception
 * @returns
 */
export const createError = (exception: unknown): Error => {
    let error: Error

    if (exception instanceof Error) {
        error = exception
    } else if (typeof exception === 'string') {
        error = new Error(exception)
    } else if (typeof exception === 'number' || typeof exception === 'boolean' || typeof exception === 'bigint') {
        error = new Error(String(exception))
    } else if (!exception) {
        error = new Error()
    } else if (typeof exception === 'object') {
        try {
            error = new Error(JSON.stringify(exception))
        } catch {
            error = new Error()
        }
    } else {
        error = new Error(String(exception))
    }

    return error
}
