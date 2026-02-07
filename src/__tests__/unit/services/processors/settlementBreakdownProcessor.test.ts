/*
import { assertImplementsInterface } from '../../../assertImplementsInterface'
import {
    CkoSettlementBreakdownColumnType,
    CkoSettlementBreakdownRecord,
    UberSettlementBreakdownColumnType,
    UberSettlementBreakdownRecord,
} from '../../../../types'
import {
    ProcessorInterface,
    SettlementBreakdownProcessor,
    SettlementBreakdownProcessorMetrics,
} from '../../../../services/processors'
import { buildSettlementBreakdownRecords } from '../../../buildSettlementBreakdownReport'

describe('SettlementBreakdownProcessor Service', () => {
    let processor: ProcessorInterface<
        CkoSettlementBreakdownRecord,
        UberSettlementBreakdownRecord,
        SettlementBreakdownProcessorMetrics
    >
    const payoutId = 'test_abc'
    const payoutDate = new Date()

    beforeEach(() => {
        processor = new SettlementBreakdownProcessor(payoutDate, 'test.csv')
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should implement the interface', () => {
        expect(
            assertImplementsInterface<
                ProcessorInterface<
                    CkoSettlementBreakdownRecord,
                    UberSettlementBreakdownRecord,
                    SettlementBreakdownProcessorMetrics
                >
            >(processor)
        ).toBeTruthy()
    })

    it('should process with no records', async () => {
        const records: CkoSettlementBreakdownRecord[] = []

        const rows: UberSettlementBreakdownRecord[] = []
        for await (const row of processor.process(records)) {
            rows.push(row)
        }

        const metrics = processor.metrics()

        expect(rows).toHaveLength(0)
        expect(metrics.rowsIn).toBe(0)
        expect(metrics.rowsOut).toBe(0)
    })

    it('should process 1 financial charge record with no payoutId', async () => {
        const records = buildSettlementBreakdownRecords('', payoutDate, [
            {
                type: CkoSettlementBreakdownColumnType.Charge,
                quantity: 1,
                amount: 20,
                isFinancial: true,
            },
        ])

        const rows: UberSettlementBreakdownRecord[] = []
        for await (const row of processor.process(records)) {
            rows.push(row)
        }

        const metrics = processor.metrics()

        expect(metrics.rowsIn).toBe(1)
        expect(metrics.rowsOut).toBe(1)
        expect(metrics.hasPayoutRow).toBeFalsy()
    })

    it('should process 1 financial charge record', async () => {
        const records = buildSettlementBreakdownRecords(payoutId, payoutDate, [
            {
                type: CkoSettlementBreakdownColumnType.Charge,
                quantity: 1,
                amount: 20,
                isFinancial: true,
            },
        ])

        const rows: UberSettlementBreakdownRecord[] = []
        for await (const row of processor.process(records)) {
            rows.push(row)
        }

        const metrics = processor.metrics()
        const chargeRow = rows.at(-2)
        const payoutRow = rows.at(-1)

        expect(metrics.rowsIn).toBe(1)
        expect(metrics.rowsOut).toBe(2)
        expect(chargeRow?.Type).toBe(UberSettlementBreakdownColumnType.Charge)
        expect(payoutRow?.Type).toBe(UberSettlementBreakdownColumnType.Payout)
    })

    it('should process 1 non-financial charge record', async () => {
        const records = buildSettlementBreakdownRecords(payoutId, payoutDate, [
            {
                type: CkoSettlementBreakdownColumnType.Charge,
                quantity: 1,
                amount: 20,
                isFinancial: false,
            },
        ])

        const rows: UberSettlementBreakdownRecord[] = []
        for await (const row of processor.process(records)) {
            rows.push(row)
        }

        const metrics = processor.metrics()
        const feeAdjustmentRow = rows.at(-2)
        const payoutRow = rows.at(-1)

        expect(metrics.rowsIn).toBe(1)
        expect(metrics.rowsOut).toBe(2)
        expect(feeAdjustmentRow?.Type).toBe(UberSettlementBreakdownColumnType.FeeAdjustment)
        expect(payoutRow?.Type).toBe(UberSettlementBreakdownColumnType.Payout)
    })

    it('should process 5 financial and 5 non-financial charge records', async () => {
        const records = buildSettlementBreakdownRecords(payoutId, payoutDate, [
            {
                type: CkoSettlementBreakdownColumnType.Charge,
                quantity: 5,
                amount: 20,
                isFinancial: true,
            },
            {
                type: CkoSettlementBreakdownColumnType.Charge,
                quantity: 5,
                amount: 10,
                isFinancial: false,
            },
        ])

        const rows: UberSettlementBreakdownRecord[] = []
        for await (const row of processor.process(records)) {
            rows.push(row)
        }

        const metrics = processor.metrics()
        const feeAdjustmentRow = rows.at(-2)
        const payoutRow = rows.at(-1)

        expect(metrics.rowsIn).toBe(10)
        expect(metrics.rowsOut).toBe(5 + 2)
        expect(feeAdjustmentRow?.Type).toBe(UberSettlementBreakdownColumnType.FeeAdjustment)
        expect(payoutRow?.Type).toBe(UberSettlementBreakdownColumnType.Payout)
    })
})
*/
