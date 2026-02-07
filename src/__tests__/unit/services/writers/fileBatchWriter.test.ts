import { assertImplementsInterface } from '../../../assertImplementsInterface'
import { FileBatchWriter, Writer } from '../../../../services'
import { promises as fs } from 'fs'

jest.mock('fs', () => ({
    promises: {
        mkdir: jest.fn(),
        writeFile: jest.fn(),
        rename: jest.fn(),
    },
}))

describe('FileBatchWriter Service', () => {
    let writer: Writer

    beforeEach(() => {
        writer = new FileBatchWriter('test.txt')
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
        expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true })
    })

    it('should throw if open (mkdir) fails', async () => {
        ;(fs.mkdir as jest.Mock).mockRejectedValueOnce(new Error('mkdir failed'))

        const result = writer.open()

        await expect(result).rejects.toBeInstanceOf(Error)
    })

    it('should write a line in memory', async () => {
        const line = 'test line'

        const result = await writer.write(line)

        expect(result).toBe(true)
    })

    it('should close successfully', async () => {
        const result = await writer.close()

        expect(result).toBe(true)

        expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'utf-8')
        expect(fs.rename).toHaveBeenCalledWith(expect.any(String), expect.any(String))
    })

    it('should throw if close (writeFile) fails', async () => {
        ;(fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('writeFile failed'))

        const result = writer.close()

        await expect(result).rejects.toBeInstanceOf(Error)
    })

    it('should throw if close (rename) fails', async () => {
        ;(fs.rename as jest.Mock).mockRejectedValueOnce(new Error('rename failed'))

        const result = writer.close()

        await expect(result).rejects.toBeInstanceOf(Error)
    })
})
