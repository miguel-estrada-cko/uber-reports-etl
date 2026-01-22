import { ReaderException } from '../../../../services/readers'

describe('ReaderException', () => {
    it('should create a base ReaderException with correct name and message', () => {
        const error = new ReaderException('Custom error')

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ReaderException)
        expect(error.name).toBe('ReaderException')
        expect(error.message).toBe('Custom error')
    })

    describe('ResourceNotFound', () => {
        it('should have the correct name and formatted message', () => {
            const fileName = 'test.csv'
            const error = new ReaderException.ResourceNotFound(fileName)

            expect(error).toBeInstanceOf(ReaderException)
            expect(error.name).toBe('ReaderException.ResourceNotFound')
            expect(error.message).toBe(`File not found: ${fileName}`)
        })
    })

    describe('ResourceAccessDenied', () => {
        it('should have the correct name and formatted message', () => {
            const fileName = 'secret.csv'
            const error = new ReaderException.ResourceAccessDenied(fileName)

            expect(error.name).toBe('ReaderException.ResourceAccessDenied')
            expect(error.message).toBe(`Access denied: ${fileName}`)
        })
    })
})
