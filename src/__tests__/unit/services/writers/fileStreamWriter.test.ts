import { assertImplementsInterface } from '../../../assertImplementsInterface'
import { FileStreamWriter, Writer } from '../../../../services'
import fs from 'fs'
import { EventEmitter, once } from 'events'

jest.mock('fs', () => ({
    createWriteStream: jest.fn(),
    promises: {
        mkdir: jest.fn(),
        rename: jest.fn(),
    },
}))

jest.mock('events', () => {
    const original = jest.requireActual('events')
    return {
        ...original,
        once: jest.fn(),
    }
})

describe('FileStreamWriter Service', () => {
    let writer: Writer
    let mockStream: any

    beforeEach(() => {
        writer = new FileStreamWriter('test.txt')

        mockStream = new EventEmitter()
        mockStream.write = jest.fn().mockReturnValue(true)
        mockStream.end = jest.fn().mockImplementation(() => {
            mockStream.emit('finish')
        })
        ;(fs.createWriteStream as jest.Mock).mockReturnValue(mockStream)
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('should implement the interface', () => {
        expect(assertImplementsInterface<Writer>(writer)).toBeTruthy()
    })

    it('should open and create a write stream', async () => {
        const result = await writer.open()

        expect(result).toBe(true)
        expect(fs.promises.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true })
        expect(fs.createWriteStream).toHaveBeenCalledWith(expect.stringContaining('test.txt.tmp'), { encoding: 'utf8' })
    })

    it('should throw if open (mkdir) fails', async () => {
        ;(fs.promises.mkdir as jest.Mock).mockRejectedValueOnce(new Error('mkdir failed'))

        const result = writer.open()

        await expect(result).rejects.toThrow('mkdir failed')
    })

    it('should throw error if stream is not open', async () => {
        await expect(writer.write('some line')).rejects.toThrow('stream is not open')
    })

    it('should write a line directly to the stream', async () => {
        await writer.open()
        const result = await writer.write('hello world')

        expect(result).toBe(true)
        expect(mockStream.write).toHaveBeenCalledWith('hello world\n')
    })

    it('should handle backpressure (wait for drain)', async () => {
        await writer.open()
        mockStream.write.mockReturnValueOnce(false)
        ;(once as jest.Mock).mockResolvedValueOnce([undefined])

        const writePromise = writer.write('heavy line')

        await expect(writePromise).resolves.toBe(true)
        expect(once).toHaveBeenCalledWith(mockStream, 'drain')
    })

    it('should end stream and rename file', async () => {
        await writer.open()
        ;(once as jest.Mock).mockResolvedValueOnce([undefined])

        const result = await writer.close()

        expect(result).toBe(true)
        expect(mockStream.end).toHaveBeenCalled()
        expect(once).toHaveBeenCalledWith(mockStream, 'finish')
        expect(fs.promises.rename).toHaveBeenCalledWith(expect.any(String), 'test.txt')
    })

    it('should throw if close (rename) fails', async () => {
        await writer.open()
        ;(once as jest.Mock).mockResolvedValueOnce([undefined])
        ;(fs.promises.rename as jest.Mock).mockRejectedValueOnce(new Error('rename failed'))

        const result = writer.close()

        await expect(result).rejects.toThrow('rename failed')
    })

    it('should return true even if stream was never opened', async () => {
        const result = await writer.close()

        expect(result).toBe(true)
        expect(fs.promises.rename).not.toHaveBeenCalled()
    })
})
