import { assertImplementsInterface } from '../../../assertImplementsInterface'
import { CkoSettlementBreakdownCsvMapper, MapperInterface } from '../../../../services/mappers'
import { CkoSettlementBreakdownColumnType, CkoSettlementBreakdownRecord } from '../../../../types'
import { buildSettlementBreakdownRows } from '../../../buildSettlementBreakdownReport'

describe('CkoSettlementBreakdownCsvMapper Service', () => {
    let mapper: MapperInterface<Record<string, string>, CkoSettlementBreakdownRecord>
    const payoutId = 'test_abc'
    const payoutDate = new Date()

    beforeEach(() => {
        mapper = new CkoSettlementBreakdownCsvMapper()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should implement the interface', () => {
        expect(
            assertImplementsInterface<MapperInterface<Record<string, string>, CkoSettlementBreakdownRecord>>(mapper)
        ).toBeTruthy()
    })

    it('should map a row', () => {
        const [row] = buildSettlementBreakdownRows(payoutId, payoutDate, {
            type: CkoSettlementBreakdownColumnType.Charge,
            quantity: 1,
            amount: 20,
        })

        const result = mapper.map(row)

        expect(result.PayoutId).toBe(payoutId)
        expect(result.Type).toBe(CkoSettlementBreakdownColumnType.Charge)
        expect(result.GrossInHoldingCurrency?.toNumber()).toBe(20)
    })
})
