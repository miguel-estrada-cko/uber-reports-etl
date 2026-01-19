import { FloatDecimal } from '../../../types'
import { stringToFloat } from '../../../utils'

describe('stringToFloat util', () => {
    it('should create float from valid string', () => {
        const input = '3.14159'
        const float = stringToFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float?.toNumber()).toBeCloseTo(3.14159)
    })

    it('should return null for null input', () => {
        const input: null = null
        const float = stringToFloat(input)

        expect(float).toBeNull()
    })

    it('should return null for undefined input', () => {
        const input: undefined = undefined
        const float = stringToFloat(input)

        expect(float).toBeNull()
    })

    it('should return null for empty string', () => {
        const input: string = ''
        const float = stringToFloat(input)

        expect(float).toBeNull()
    })

    it('should return null for string with only spaces', () => {
        const input: string = '   '
        const float = stringToFloat(input)

        expect(float).toBeNull()
    })

    it('should return null for invalid number string', () => {
        const input: string = 'invalid-number'
        const float = stringToFloat(input)

        expect(float).toBeNull()
    })

    it('should create float from string with spaces around number', () => {
        const input: string = '   2.71828   '
        const float = stringToFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float?.toNumber()).toBeCloseTo(2.71828)
    })

    it('should create float from string with leading and trailing zeros', () => {
        const input: string = '000123.45000'
        const float = stringToFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float?.toNumber()).toBeCloseTo(123.45)
    })

    it('should create float from negative number string', () => {
        const input: string = ' -42.42 '
        const float = stringToFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float?.toNumber()).toBeCloseTo(-42.42)
    })

    it('should return null for string with non-numeric characters', () => {
        const input: string = '123abc'
        const float = stringToFloat(input)

        expect(float).toBeNull()
    })

    it('should return null for string with multiple dots', () => {
        const input: string = '12.34.56'
        const float = stringToFloat(input)

        expect(float).toBeNull()
    })
})
