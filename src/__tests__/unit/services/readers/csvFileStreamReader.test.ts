import { CsvFileStreamReader, ReaderException, ReaderInterface } from '../../../../services/readers'
import { assertImplementsInterface } from '../../../assertImplementsInterface'
import fs from 'fs'
import { Readable } from 'stream'

jest.mock('fs')

describe('CsvFileStreamReader Service', () => {
    let reader: ReaderInterface
    const mockFilePath = 'test.csv'

    beforeEach(() => {
        reader = new CsvFileStreamReader(mockFilePath)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should implement the interface', () => {
        expect(assertImplementsInterface<ReaderInterface>(reader)).toBeTruthy()
    })

    it('should open a file', async () => {
        ;(fs.existsSync as jest.Mock).mockReturnValue(true)
        ;(fs.createReadStream as jest.Mock).mockReturnValue(new Readable({ read() {} }))

        const result = await reader.open()

        expect(result).toBeTruthy()
        expect(fs.createReadStream).toHaveBeenCalledWith(expect.stringContaining(mockFilePath), expect.any(Object))
    })

    it('should throw ResourceNotFound when file does not exist', async () => {
        ;(fs.existsSync as jest.Mock).mockReturnValue(false)

        await expect(reader.open()).rejects.toThrow(ReaderException.ResourceNotFound)
    })

    it('should throw ResourceAccessDeniend when file exists but has no permissions', async () => {
        ;(fs.existsSync as jest.Mock).mockReturnValue(true)
        ;(fs.createReadStream as jest.Mock).mockReturnValue(false)

        await expect(reader.open()).rejects.toThrow(ReaderException.ResourceAccessDenied)
    })

    it('should read and parse CSV content correctly', async () => {
        ;(fs.existsSync as jest.Mock).mockReturnValue(true)
        ;(fs.createReadStream as jest.Mock).mockReturnValue(
            Readable.from(['Header1,Header2\nvalue1,value2\nvalue3,value4\n'])
        )

        await reader.open()
        const results = []
        for await (const row of await reader.read()) {
            results.push(row)
        }

        expect(results).toHaveLength(2)
        expect(results[0]).toEqual({ Header1: 'value1', Header2: 'value2' })
    })

    it('should destroy the stream when closing', async () => {
        ;(fs.existsSync as jest.Mock).mockReturnValue(true)
        ;(fs.createReadStream as jest.Mock).mockReturnValue(Readable.from(['Header1\nvalue1']))

        await reader.open()
        const internalStream = (reader as any).fileStream
        const destroySpy = jest.spyOn(internalStream, 'destroy')
        await reader.close()

        expect(destroySpy).toHaveBeenCalled()
    })
})
