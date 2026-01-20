import { CkoSettlementBreakdownColumnType } from '../../../types'
import { generateSettlementBreakdownRows, createSettlementBreakdownRowsMetrics } from '../../../utils'
import { buildSettlementBreakdownReport } from '../../buildSettlementBreakdownReport'

describe('settlementBreakdown util', () => {
    it('should create settlement breakdown rows metrics', () => {
        const metrics = createSettlementBreakdownRowsMetrics()

        expect(metrics).toEqual({ rowsIn: 0, rowsOut: 0, hasAdjustmentRow: false, hasPayoutRow: false })
    })

    it('should yield nothing for empty file', async () => {
        const report = buildSettlementBreakdownReport({ header: false })

        const metrics = createSettlementBreakdownRowsMetrics()
        const results: any[] = []
        for await (const row of generateSettlementBreakdownRows(report, metrics)) {
            results.push(row)
        }

        expect(results).toHaveLength(0)
        expect(metrics.rowsIn).toBe(0)
        expect(metrics.rowsOut).toBe(0)
    })

    it('should yield nothing for header-only file', async () => {
        const report = buildSettlementBreakdownReport({})

        const metrics = createSettlementBreakdownRowsMetrics()
        const results: any[] = []
        for await (const row of generateSettlementBreakdownRows(report, metrics)) {
            results.push(row)
        }

        expect(results).toHaveLength(0)
        expect(metrics.rowsIn).toBe(0)
        expect(metrics.rowsOut).toBe(0)
    })

    it('should yield a charge row', async () => {
        const report = buildSettlementBreakdownReport({
            rows: [{ type: CkoSettlementBreakdownColumnType.Charge, quantity: 1, isFinancial: true }],
        })

        const metrics = createSettlementBreakdownRowsMetrics()
        const results: any[] = []
        for await (const row of generateSettlementBreakdownRows(report, metrics)) {
            results.push(row)
        }

        expect(results).toHaveLength(2)
        expect(metrics.rowsIn).toBe(1)
        expect(metrics.rowsOut).toBe(2)
        expect(metrics.hasAdjustmentRow).toBe(false)
        expect(metrics.hasPayoutRow).toBe(true)
    })

    it('should yield a non-financial charge row', async () => {
        const report = buildSettlementBreakdownReport({
            rows: [{ type: CkoSettlementBreakdownColumnType.Charge, quantity: 1, isFinancial: false }],
        })

        const metrics = createSettlementBreakdownRowsMetrics()
        const results: any[] = []
        for await (const row of generateSettlementBreakdownRows(report, metrics)) {
            results.push(row)
        }

        expect(results).toHaveLength(2)
        expect(metrics.rowsIn).toBe(1)
        expect(metrics.rowsOut).toBe(2)
        expect(metrics.hasAdjustmentRow).toBe(true)
        expect(metrics.hasPayoutRow).toBe(true)
    })

    it('should yield 1 charge and 1 non-financial charge rows', async () => {
        const report = buildSettlementBreakdownReport({
            rows: [
                { type: CkoSettlementBreakdownColumnType.Charge, quantity: 1, isFinancial: false },
                { type: CkoSettlementBreakdownColumnType.Charge, quantity: 1, isFinancial: true },
            ],
        })

        const metrics = createSettlementBreakdownRowsMetrics()
        const results: any[] = []
        for await (const row of generateSettlementBreakdownRows(report, metrics)) {
            results.push(row)
        }

        expect(results).toHaveLength(3)
        expect(metrics.rowsIn).toBe(2)
        expect(metrics.rowsOut).toBe(3)
        expect(metrics.hasAdjustmentRow).toBe(true)
        expect(metrics.hasPayoutRow).toBe(true)
    })
})
