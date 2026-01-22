export class ReaderException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ReaderException'

        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    static ResourceNotFound = class extends ReaderException {
        constructor(file: string) {
            super(`File not found: ${file}`)
            this.name = 'ReaderException.ResourceNotFound'
        }
    }

    static ResourceAccessDenied = class extends ReaderException {
        constructor(file: string) {
            super(`Access denied: ${file}`)
            this.name = 'ReaderException.ResourceAccessDenied'
        }
    }
}
