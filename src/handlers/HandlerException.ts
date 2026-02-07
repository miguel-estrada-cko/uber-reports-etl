export class HandlerException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'HandlerException'

        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    static NoRegistryFound = class extends HandlerException {
        constructor(file: string) {
            super(`Not matching handler registry found, file: ${file}`)
            this.name = `${super.name}.NoRegistryFound`
        }
    }

    static InvalidMetadata = class extends HandlerException {
        constructor(file: string) {
            super(`Invalid metadata, file: ${file}`)
            this.name = `${super.name}.InvalidMetadata`
        }
    }
}
