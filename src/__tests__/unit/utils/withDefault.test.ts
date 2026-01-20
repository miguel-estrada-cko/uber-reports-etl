import { withDefault } from '../../../utils'

describe('withDefault util', () => {
    it('returns the original value if it is defined', () => {
        expect(withDefault('abc', 'fallback')).toBe('abc')
        expect(withDefault(42, 0)).toBe(42)
        expect(withDefault(false, true)).toBe(false)
    })

    it('returns the fallback if value is null', () => {
        expect(withDefault(null, 'fallback')).toBe('fallback')
        expect(withDefault(null, 0)).toBe(0)
        expect(withDefault(null, true)).toBe(true)
    })

    it('returns the fallback if value is undefined', () => {
        expect(withDefault(undefined, 'fallback')).toBe('fallback')
        expect(withDefault(undefined, 0)).toBe(0)
        expect(withDefault(undefined, true)).toBe(true)
    })
})
