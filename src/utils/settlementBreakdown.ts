import { Readable } from 'stream'
import {
    CkoSettlementBreakdownColumnType,
    CkoSettlementBreakdownRecord,
    CkoSettlementBreakdownReport,
    Float,
    UberSettlementBreakdownColumnType,
    UberSettlementBreakdownRecord,
} from '../types'
import { stringToDate } from './stringToDate'
import { stringToFloat } from './stringToFloat'
import { parse } from 'csv-parse'
import { createFloat } from './createFloat'

export const normalizeSettlementBreakdownRow = (row: Record<string, string>): CkoSettlementBreakdownRecord => {
    return {
        ClientEntityId: row['Client Entity ID'],
        ClientEntityName: row['Client Entity Name'],
        ProcessingChannelId: row['Processing Channel ID'],
        ProcessingChannelName: row['Processing Channel Name'],
        Type: row['Type'] as unknown as CkoSettlementBreakdownColumnType,
        PaymentId: row['Payment ID'],
        Reference: row['Reference'],
        ProcessedOn: stringToDate(row['Processed On']),
        AvailableOn: stringToDate(row['Available On']),
        HoldingCurrency: row['Holding Currency'],
        PayoutId: row['Payout ID'],
        GrossInHoldingCurrency: stringToFloat(row['Gross In Holding Currency']),
        DeductionInHoldingCurrency: stringToFloat(row['Deduction In Holding Currency']),
        NetInHoldingCurrency: stringToFloat(row['Net In Holding Currency']),
        ProcessingFeeInHoldingCurrency: stringToFloat(row['Processing Fee In Holding Currency']),
        SchemeFeeInHoldingCurrency: stringToFloat(row['Scheme Fee In Holding Currency']),
        InterchangeInHoldingCurrency: stringToFloat(row['Interchange In Holding Currency']),
        TaxInHoldingCurrency: stringToFloat(row['Tax In Holding Currency']),
        ReserveInHoldingCurrency: stringToFloat(row['Reserve In Holding Currency']),
        ProcessingCurrency: row['Processing Currency'],
        GrossInProcessingCurrency: stringToFloat(row['Gross In Processing Currency']),
        FxRateApplied: stringToFloat(row['FX Rate Applied']),
        PaymentMethod: row['Payment Method'],
        CardType: row['Card Type'],
        CardCategory: row['Card Category'],
        IssuerCountry: row['Issuer Country'],
        EntityCountry: row['Entity Country'],
        Region: row['Region'],
        Mid: row['MID'],
        MerchantCategoryCode: row['Merchant Category Code'],
        AcquirerReferenceNumber: row['Acquirer Reference Number'],
        AccountFundingTransaction: row['Account Funding Transaction'],
        EntitySegment: row['Entity Segment'],
        IssuingBank: row['Issuing Bank'],
        Bin: row['BIN'],
        PaymentType: row['Payment Type'],
        ProcessedOnUTC: stringToDate(row['Processed On UTC']),
        AvailableOnUTC: stringToDate(row['Available On UTC']),
        Udf1: row['UDF 1'] ?? undefined,
        Udf2: row['UDF 2'] ?? undefined,
        Udf3: row['UDF 3'] ?? undefined,
        Udf4: row['UDF 4'] ?? undefined,
        Udf5: row['UDF 5'] ?? undefined,
        ActionId: row['Action ID'],
        Timezone: row['Timezone'],
        CardProductType: row['Card Product Type'],
    }
}

const CkoSettlementBreakdownAggregationColumns = [
    'GrossInHoldingCurrency',
    'DeductionInHoldingCurrency',
    'NetInHoldingCurrency',
    'ProcessingFeeInHoldingCurrency',
    'SchemeFeeInHoldingCurrency',
    'InterchangeInHoldingCurrency',
    'TaxInHoldingCurrency',
    'ReserveInHoldingCurrency',
] as const satisfies readonly (keyof UberSettlementBreakdownRecord)[]

export interface GenerateSettlementBreakdownRowsMetrics {
    rowsIn: number
    rowsOut: number
    hasAdjustmentRow: boolean
    hasPayoutRow: boolean
}

export const createSettlementBreakdownRowsMetrics = (): GenerateSettlementBreakdownRowsMetrics => ({
    rowsIn: 0,
    rowsOut: 0,
    hasAdjustmentRow: false,
    hasPayoutRow: false,
})

export async function* generateSettlementBreakdownRows(
    settlementBreakdownReport: CkoSettlementBreakdownReport,
    generatorMetrics: GenerateSettlementBreakdownRowsMetrics
): AsyncGenerator<UberSettlementBreakdownRecord> {
    const fileStream = Readable.from(settlementBreakdownReport.FileStream).pipe(
        parse({ columns: true, trim: true, delimiter: ',' })
    )

    // Common rows
    let firstRow: Partial<UberSettlementBreakdownRecord> | null = null

    // Adjustment aggregation
    let adjustmentRow: Partial<UberSettlementBreakdownRecord> = {
        PayoutId: '',
        HoldingCurrency: '',
        GrossInHoldingCurrency: createFloat(0),
        DeductionInHoldingCurrency: createFloat(0),
        NetInHoldingCurrency: createFloat(0),
        ProcessingFeeInHoldingCurrency: createFloat(0),
        SchemeFeeInHoldingCurrency: createFloat(0),
        InterchangeInHoldingCurrency: createFloat(0),
        TaxInHoldingCurrency: createFloat(0),
        ReserveInHoldingCurrency: createFloat(0),
    }

    // Payout row aggregation
    let payoutRow: Partial<UberSettlementBreakdownRecord> = {
        PayoutId: '',
        HoldingCurrency: '',
        GrossInHoldingCurrency: createFloat(0),
        DeductionInHoldingCurrency: createFloat(0),
        NetInHoldingCurrency: createFloat(0),
        ProcessingFeeInHoldingCurrency: createFloat(0),
        SchemeFeeInHoldingCurrency: createFloat(0),
        InterchangeInHoldingCurrency: createFloat(0),
        TaxInHoldingCurrency: createFloat(0),
        ReserveInHoldingCurrency: createFloat(0),
    }

    // Read the file line by line
    for await (const row of fileStream) {
        generatorMetrics.rowsIn++

        const record = normalizeSettlementBreakdownRow(row)

        if (!firstRow) {
            firstRow = {
                ClientEntityId: record.ClientEntityId,
                ClientEntityName: record.ClientEntityName,
                ProcessingChannelId: record.ProcessingChannelId,
                ProcessingChannelName: record.ProcessingChannelName,
                PayoutId: record.PayoutId,
            }
        }

        if (
            [
                CkoSettlementBreakdownColumnType.Charge,
                CkoSettlementBreakdownColumnType.PartialCharge,
                CkoSettlementBreakdownColumnType.Refund,
                CkoSettlementBreakdownColumnType.PartialRefund,
            ].includes(record.Type) &&
            record.GrossInHoldingCurrency &&
            !record.GrossInHoldingCurrency.isZero()
        ) {
            const uberRecord: UberSettlementBreakdownRecord = {
                ...record, // copia todos los campos
                Type: record.Type as unknown as UberSettlementBreakdownColumnType,
                NetInProcessingCurrency: record.NetInHoldingCurrency?.div(record.FxRateApplied ?? 1) as Float,
            }

            generatorMetrics.rowsOut++
            yield uberRecord
        } else {
            if (!adjustmentRow.PayoutId) {
                adjustmentRow.PayoutId = record.PayoutId
                adjustmentRow.HoldingCurrency = record.HoldingCurrency
            }

            for (const field of CkoSettlementBreakdownAggregationColumns) {
                adjustmentRow[field] = adjustmentRow[field]?.plus(record[field] ?? 0) as Float
            }
        }

        if (!payoutRow.PayoutId) {
            payoutRow.PayoutId = record.PayoutId
            payoutRow.HoldingCurrency = record.HoldingCurrency
        }

        for (const field of CkoSettlementBreakdownAggregationColumns) {
            payoutRow[field] = payoutRow[field]?.plus(record[field] ?? 0) as Float
        }
    }

    if (!firstRow) {
        return
    }

    // Adjustment row
    if (adjustmentRow.PayoutId) {
        generatorMetrics.rowsOut++
        generatorMetrics.hasAdjustmentRow = true

        yield {
            ClientEntityId: firstRow.ClientEntityId || '',
            ClientEntityName: firstRow.ClientEntityName || '',
            ProcessingChannelId: '',
            ProcessingChannelName: '',
            Type: UberSettlementBreakdownColumnType.Adjustment,
            PaymentId: '',
            Reference: '',
            ProcessedOn: null,
            AvailableOn: null,
            HoldingCurrency: adjustmentRow.HoldingCurrency || '',
            PayoutId: adjustmentRow.PayoutId || '',
            GrossInHoldingCurrency: adjustmentRow.GrossInHoldingCurrency || null,
            DeductionInHoldingCurrency: adjustmentRow.DeductionInHoldingCurrency || null,
            NetInHoldingCurrency: adjustmentRow.NetInHoldingCurrency || null,
            ProcessingFeeInHoldingCurrency: adjustmentRow.ProcessingFeeInHoldingCurrency || null,
            SchemeFeeInHoldingCurrency: adjustmentRow.SchemeFeeInHoldingCurrency || null,
            InterchangeInHoldingCurrency: adjustmentRow.InterchangeInHoldingCurrency || null,
            TaxInHoldingCurrency: adjustmentRow.TaxInHoldingCurrency || null,
            ReserveInHoldingCurrency: adjustmentRow.ReserveInHoldingCurrency || null,
            ProcessingCurrency: '',
            GrossInProcessingCurrency: null,
            NetInProcessingCurrency: null,
            FxRateApplied: null,
            PaymentMethod: '',
            CardType: '',
            CardCategory: '',
            IssuerCountry: '',
            EntityCountry: '',
            Region: '',
            Mid: '',
            MerchantCategoryCode: '',
            AcquirerReferenceNumber: '',
            AccountFundingTransaction: '',
            EntitySegment: '',
            IssuingBank: '',
            Bin: '',
            PaymentType: '',
            ProcessedOnUTC: null,
            AvailableOnUTC: null,
            Udf1: '',
            Udf2: '',
            Udf3: '',
            Udf4: '',
            Udf5: '',
            ActionId: '',
            Timezone: '',
            CardProductType: '',
        } as UberSettlementBreakdownRecord
    }

    // Payout row
    if (payoutRow.PayoutId) {
        generatorMetrics.rowsOut++
        generatorMetrics.hasPayoutRow = true

        yield {
            ClientEntityId: firstRow.ClientEntityId || '',
            ClientEntityName: firstRow.ClientEntityName || '',
            ProcessingChannelId: '',
            ProcessingChannelName: '',
            Type: UberSettlementBreakdownColumnType.Payout,
            PaymentId: '',
            Reference: '',
            ProcessedOn: null,
            AvailableOn: null,
            HoldingCurrency: payoutRow.HoldingCurrency || '',
            PayoutId: payoutRow.PayoutId || '',
            GrossInHoldingCurrency: payoutRow.GrossInHoldingCurrency || null,
            DeductionInHoldingCurrency: payoutRow.DeductionInHoldingCurrency || null,
            NetInHoldingCurrency: payoutRow.NetInHoldingCurrency || null,
            ProcessingFeeInHoldingCurrency: payoutRow.ProcessingFeeInHoldingCurrency || null,
            SchemeFeeInHoldingCurrency: payoutRow.SchemeFeeInHoldingCurrency || null,
            InterchangeInHoldingCurrency: payoutRow.InterchangeInHoldingCurrency || null,
            TaxInHoldingCurrency: payoutRow.TaxInHoldingCurrency || null,
            ReserveInHoldingCurrency: payoutRow.ReserveInHoldingCurrency || null,
            ProcessingCurrency: '',
            GrossInProcessingCurrency: null,
            NetInProcessingCurrency: null,
            FxRateApplied: null,
            PaymentMethod: '',
            CardType: '',
            CardCategory: '',
            IssuerCountry: '',
            EntityCountry: '',
            Region: '',
            Mid: '',
            MerchantCategoryCode: '',
            AcquirerReferenceNumber: '',
            AccountFundingTransaction: '',
            EntitySegment: '',
            IssuingBank: '',
            Bin: '',
            PaymentType: '',
            ProcessedOnUTC: null,
            AvailableOnUTC: null,
            Udf1: '',
            Udf2: '',
            Udf3: '',
            Udf4: '',
            Udf5: '',
            ActionId: '',
            Timezone: '',
            CardProductType: '',
        } as UberSettlementBreakdownRecord
    }
}
