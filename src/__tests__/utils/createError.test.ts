import { createError } from '../../utils'

describe('createError util', () => {
    it('should return same Error instance provided', () => {
        const input = new Error('test')
        const error = createError(input)
        expect(error).toBe(input)
    })

    it('should create Error from string', () => {
        const input = 'This is an error message'
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(input)
    })

    it('should create Error from number', () => {
        const input = 404
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(String(input))
    })

    it('should create Error from boolean', () => {
        const input = true
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(String(input))
    })

    it('should create Error from bigint', () => {
        const input = BigInt(9007199254741991)
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(String(input))
    })

    it('should create Error with empty message for null', () => {
        const input: unknown = null
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('')
    })

    it('should create Error with empty message for undefined', () => {
        const input: unknown = undefined
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('')
    })

    it('should create Error from object', () => {
        const input = { code: 500, detail: 'Internal Server Error' }
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(JSON.stringify(input))
    })

    it('should create Error with empty message for circular object', () => {
        const input: any = {}
        input.self = input // Create circular reference
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('')
    })

    it('should create Error from symbol', () => {
        const input = Symbol('sym')
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(String(input))
    })

    it('should create Error from function', () => {
        const input = function testFunc() {}
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(String(input))
    })

    it('should create Error from arrow function', () => {
        const input = () => {}
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(String(input))
    })

    it('should create Error from array', () => {
        const input = [1, 2, 3]
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(JSON.stringify(input))
    })

    it('should create Error from empty array', () => {
        const input: any[] = []
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(JSON.stringify(input))
    })

    it('should create Error from empty object', () => {
        const input = {}
        const error = createError(input)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(JSON.stringify(input))
    })
})
