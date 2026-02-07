/*
import { generateSettlementReport } from '../../../bin/generateSettlementReport'
import fs from 'fs'
import mock from 'mock-fs'
import { buildSettlementBreakdownCsvContent } from '../../buildSettlementBreakdownReport'
import { CkoSettlementBreakdownColumnType } from '../../../types'

describe('Inspección de salida con mock-fs', () => {
    const payoutId = 'test_abc'
    const payoutDate = new Date()

    beforeEach(() => {
        mock({
            ['fixtures/empty.csv']: buildSettlementBreakdownCsvContent(payoutId, payoutDate, [], { header: false }),
            ['fixtures/header.csv']: buildSettlementBreakdownCsvContent(payoutId, payoutDate, [], { header: true }),
            ['fixtures/sample1.csv']: buildSettlementBreakdownCsvContent(
                payoutId,
                payoutDate,
                [
                    {
                        type: CkoSettlementBreakdownColumnType.Charge,
                        quantity: 1,
                        amount: 20,
                        isFinancial: true,
                    },
                ],
                { header: true }
            ),
            ['fixtures/sample2.csv']: buildSettlementBreakdownCsvContent(
                payoutId,
                payoutDate,
                [
                    {
                        type: CkoSettlementBreakdownColumnType.Charge,
                        quantity: 1,
                        amount: 20,
                        isFinancial: false,
                    },
                ],
                { header: true }
            ),
            ['fixtures/sample3.csv']: buildSettlementBreakdownCsvContent(
                payoutId,
                payoutDate,
                [
                    {
                        type: CkoSettlementBreakdownColumnType.Charge,
                        quantity: 5,
                        amount: 20,
                        isFinancial: true,
                    },
                    {
                        type: CkoSettlementBreakdownColumnType.Charge,
                        quantity: 5,
                        amount: 20,
                        isFinancial: false,
                    },
                ],
                { header: true }
            ),
            ['generated/']: {},
        })
    })

    afterEach(() => {
        mock.restore()
    })

    it('should not generate by no provided filename', async () => {
        const generator: any = await generateSettlementReport(null)

        expect(generator.duration).toBeLessThan(5)
        expect(generator.success).toBeFalsy()
        expect(generator.error).toBeInstanceOf(Error)
    })

    it('should not generate by provided empty filename', async () => {
        const generator: any = await generateSettlementReport(null)

        expect(generator.duration).toBeLessThan(5)
        expect(generator.success).toBeFalsy()
        expect(generator.error).toBeInstanceOf(Error)
    })

    it('should not generate by a given unexisting file', async () => {
        const generator: any = await generateSettlementReport('fixtures/unexisting.csv')

        expect(generator.duration).toBeLessThan(5)
        expect(generator.success).toBeFalsy()
        expect(generator.error).toBeInstanceOf(Error)
    })

    it('should generate an empty file from an empty file', async () => {
        const generator: any = await generateSettlementReport('fixtures/empty.csv')

        expect(generator.duration).toBeLessThan(50)
        expect(fs.existsSync((generator as any).output)).toBe(true)
        expect(generator.metrics.rowsIn).toBe(0)
        expect(generator.metrics.rowsOut).toBe(0)
    })

    it('should generate an empty file from a header-only file', async () => {
        const generator: any = await generateSettlementReport('fixtures/header.csv')

        expect(generator.duration).toBeLessThan(50)
        expect(fs.existsSync((generator as any).output)).toBe(true)
        expect(generator.metrics.rowsIn).toBe(0)
        expect(generator.metrics.rowsOut).toBe(0)
    })

    it('should generate a file for 1 financial charge row', async () => {
        const generator: any = await generateSettlementReport('fixtures/sample1.csv')

        expect(generator.duration).toBeLessThan(50)
        expect(fs.existsSync((generator as any).output)).toBe(true)
        expect(generator.metrics.rowsIn).toBe(1)
        expect(generator.metrics.rowsOut).toBe(2)
        expect(generator.metrics.hasAdjustmentRow).toBeFalsy()
        expect(generator.metrics.hasPayoutRow).toBeTruthy()
    })

    it('should generate a file for 1 non-financial charge row', async () => {
        const generator: any = await generateSettlementReport('fixtures/sample2.csv')

        expect(generator.duration).toBeLessThan(50)
        expect(fs.existsSync((generator as any).output)).toBe(true)
        expect(generator.metrics.rowsIn).toBe(1)
        expect(generator.metrics.rowsOut).toBe(2)
        expect(generator.metrics.hasAdjustmentRow).toBeTruthy()
        expect(generator.metrics.hasPayoutRow).toBeTruthy()
    })

    it('should generate a file for 5 financial and 5 non-financial charge rows', async () => {
        const generator: any = await generateSettlementReport('fixtures/sample3.csv')

        expect(generator.duration).toBeLessThan(50)
        expect(fs.existsSync((generator as any).output)).toBe(true)
        expect(generator.metrics.rowsIn).toBe(10)
        expect(generator.metrics.rowsOut).toBe(5 + 2)
        expect(generator.metrics.hasAdjustmentRow).toBeTruthy()
        expect(generator.metrics.hasPayoutRow).toBeTruthy()
    })
})
*/
