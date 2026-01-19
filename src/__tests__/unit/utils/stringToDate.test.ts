import { stringToDate } from '../../../utils'

describe('stringToDate util', () => {
    it('should create Date from ISO string', () => {
        const input = '2024-01-01T12:00:00Z'
        const date = stringToDate(input)

        expect(date).toBeInstanceOf(Date)
        expect(date).not.toBeNull()
        expect(date?.toISOString()).toBe(new Date(input).toISOString())
    })

    it('should create Date from string', () => {
        const input = '2024-01-01T12:00:00'
        const date = stringToDate(input)

        console.log(date)
        expect(date).toBeInstanceOf(Date)
        expect(date).not.toBeNull()
        expect(date?.toISOString()).toBe(new Date(`${input}Z`).toISOString())
    })

    it('should return null for null input', () => {
        const input: null = null
        const date = stringToDate(input)
        expect(date).toBeNull()
    })

    it('should return null for undefined input', () => {
        const input: undefined = undefined
        const date = stringToDate(input)
        expect(date).toBeNull()
    })

    it('should return null for empty string', () => {
        const input: string = ''
        const date = stringToDate(input)
        expect(date).toBeNull()
    })

    it('should return null for invalid date string', () => {
        const input: string = 'invalid-date'
        const date = stringToDate(input)
        expect(date).toBeNull()
    })

    it('should return null for string with only spaces', () => {
        const input: string = '   '
        const date = stringToDate(input)
        expect(date).toBeNull()
    })

    it('should create Date from string with spaces around date', () => {
        const input: string = '   2024-01-01T12:00:00Z   '
        const date = stringToDate(input)

        expect(date).toBeInstanceOf(Date)
        expect(date).not.toBeNull()
        expect(date?.toISOString()).toBe(new Date('2024-01-01T12:00:00Z').toISOString())
    })

    it('should create Date from string with spaces around date without Z', () => {
        const input: string = '   2024-01-01T12:00:00   '
        const date = stringToDate(input)

        expect(date).toBeInstanceOf(Date)
        expect(date).not.toBeNull()
        expect(date?.toISOString()).toBe(new Date('2024-01-01T12:00:00Z').toISOString())
    })

    it('should return null for invalid date string with spaces', () => {
        const input: string = '   invalid-date   '
        const date = stringToDate(input)
        expect(date).toBeNull()
    })
})
