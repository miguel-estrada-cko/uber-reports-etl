import { CkoSettlementBreakdownColumnType, CkoSettlementBreakdownRecord } from '../types'
import { CkoSettlementBreakdownCsvMapper } from '../services/mappers'

const SettlementBreakdownHeader = [
    'Client Entity ID',
    'Client Entity Name',
    'Processing Channel ID',
    'Processing Channel Name',
    'Type',
    'Payment ID',
    'Reference',
    'Processed On',
    'Available On',
    'Holding Currency',
    'Payout ID',
    'Payout Date',
    'Gross In Holding Currency',
    'Deduction In Holding Currency',
    'Net In Holding Currency',
    'Processing Fee In Holding Currency',
    'Scheme Fee In Holding Currency',
    'Interchange In Holding Currency',
    'Tax In Holding Currency',
    'Reserve In Holding Currency',
    'Processing Currency',
    'Gross In Processing Currency',
    'FX Rate Applied',
    'Payment Method',
    'Card Type',
    'Card Category',
    'Acquirer Reference Number',
    'Payment Type',
    'Processed On UTC',
    'Available On UTC',
    'Action ID',
    'Timezone',
] as const

type SettlementBreakdownFileRowOptions = {
    type: CkoSettlementBreakdownColumnType
    quantity?: number
    amount?: number
    isFinancial?: boolean
    isNegative?: boolean
    addPayoutId?: boolean
}

export const buildSettlementBreakdownRecords = (
    payoutId: string,
    payoutDate: Date,
    rows: SettlementBreakdownFileRowOptions[]
): CkoSettlementBreakdownRecord[] => {
    let records: CkoSettlementBreakdownRecord[] = []

    for (const row of rows) {
        records.push(...buildSettlementBreakdownRecord(payoutId, payoutDate, row))
    }

    // Shuffle lines
    records.sort(() => Math.random() - 0.5)

    return records
}

export const buildSettlementBreakdownRecord = (
    payoutId: string,
    payoutDate: Date,
    {
        type = CkoSettlementBreakdownColumnType.Charge,
        quantity = 1,
        amount = 10,
        isFinancial = true,
        isNegative = false,
        addPayoutId = true,
    }: SettlementBreakdownFileRowOptions
): CkoSettlementBreakdownRecord[] => {
    const rows = buildSettlementBreakdownRows(payoutId, payoutDate, {
        type,
        quantity,
        amount,
        isFinancial,
        isNegative,
        addPayoutId,
    })

    return rows.map((row) => new CkoSettlementBreakdownCsvMapper().map(row))
}

export const buildSettlementBreakdownRows = (
    payoutId: string,
    payoutDate: Date,
    {
        type = CkoSettlementBreakdownColumnType.Charge,
        quantity = 1,
        amount = 10,
        isFinancial = true,
        isNegative = false,
        addPayoutId = true,
    }: SettlementBreakdownFileRowOptions
): Record<string, string>[] => {
    const rows: Record<string, string>[] = []

    payoutDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < quantity; i++) {
        const rowId = Math.random().toString(36).substring(2, 8)

        const rowAmount: number = isFinancial ? (isNegative ? -amount : amount) : 0.0

        const row: Record<string, string> = {
            'Client Entity ID': 'ent_123',
            'Client Entity Name': 'Entity 123 Ltd',
            'Processing Channel ID': 'pc_123',
            'Processing Channel Name': 'Channel 123',
            Type: type,
            'Payment ID': `pay_${rowId}`,
            Reference: `ref_${rowId}`,
            'Processed On': '2026-01-01T00:00:00',
            'Available On': '2026-01-01T00:00:00',
            'Holding Currency': 'USD',
            'Payout ID': addPayoutId ? `${payoutId}` : '',
            'Payout Date': payoutDate.toISOString(),
            'Gross In Holding Currency': rowAmount.toFixed(2),
            'Deduction In Holding Currency': '0.00',
            'Net In Holding Currency': '0.00',
            'Processing Fee In Holding Currency': '0.00',
            'Scheme Fee In Holding Currency': '0.00',
            'Interchange In Holding Currency': '0.00',
            'Tax In Holding Currency': '0.00',
            'Reserve In Holding Currency': '0.00',
            'Processing Currency': 'USD',
            'Gross In Processing Currency': rowAmount.toFixed(2),
            'FX Rate Applied': '1.00',
            'Payment Method': 'VISA',
            'Card Type': 'Credit',
            'Card Category': 'Consumer',
            'Acquirer Reference Number': `arn_${rowId}`,
            'Payment Type': 'Regular',
            'Processed On UTC': '2026-01-01T00:00:00',
            'Available On UTC': '2026-01-01T00:00:00',
            'Action ID': `act_${rowId}`,
            Timezone: 'UTC',
        }

        rows.push(row)
    }

    return rows
}
