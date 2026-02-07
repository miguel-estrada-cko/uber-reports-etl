import { assertImplementsInterface } from '../../../assertImplementsInterface'
import { ConsoleWriter, Writer } from '../../../../services'

describe('ConsoleWriter Service', () => {
    let writer: Writer
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
        writer = new ConsoleWriter()
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should implement the interface', () => {
        expect(assertImplementsInterface<Writer>(writer)).toBeTruthy()
    })

    it('should open successfully', async () => {
        const result = await writer.open()
        expect(result).toBe(true)
    })

    it('should write a line to the console', async () => {
        const line = 'test line'
        const result = await writer.write(line)

        expect(result).toBe(true)
        expect(consoleSpy).toHaveBeenCalledWith(line)
    })

    it('should close successfully', async () => {
        const result = await writer.close()
        expect(result).toBe(true)
    })
})
