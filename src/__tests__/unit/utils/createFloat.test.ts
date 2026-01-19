import { FloatDecimal } from '../../../types'
import { createFloat } from '../../../utils'

describe('createFloat util', () => {
    it('should return same number instance provided', () => {
        const input: number = 3.14

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(input)
    })

    it('should create Float from string', () => {
        const input: string = '2.718'

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(Number(input))
    })

    it('should create Float with value 0 for null', () => {
        const input: null = null

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(0)
    })

    it('should create Float with value 0 for undefined', () => {
        const input: undefined = undefined
        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(0)
    })

    it('should create Float with value 0 for empty string', () => {
        const input: string = ''

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(0)
    })

    it('should create Float with value 0 for string with spaces', () => {
        const input: string = '   '

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(0)
    })

    it('should create Float from string with spaces around number', () => {
        const input: string = '   42.42   '

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(42.42)
    })

    it('should create Float from string with leading zeros', () => {
        const input: string = '000123.456'

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(123.456)
    })

    it('should create Float from string with negative number', () => {
        const input: string = '-78.9'

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(-78.9)
    })

    it('should create Float from string with positive number sign', () => {
        const input: string = '+56.78'

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(56.78)
    })

    it('should create Float from string with exponential notation', () => {
        const input: string = '1.23e4'

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(12300)
    })

    it('should create Float from string with large number', () => {
        const input: string = '1234567890123456789012345678901234567890'

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(1234567890123456789012345678901234567890)
    })

    it('should create Float from string with small number', () => {
        const input: string = '0.00000000000000000000000000000123456789'

        const float = createFloat(input)

        expect(float).toBeInstanceOf(FloatDecimal)
        expect(float.toNumber()).toStrictEqual(0.00000000000000000000000000000123456789)
    })
})
