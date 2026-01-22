import { ProcessorInterface } from './ProcessorInterface'
import {
    CkoSettlementBreakdownColumnType,
    CkoSettlementBreakdownRecord,
    Float,
    UberSettlementBreakdownColumnType,
    UberSettlementBreakdownRecord,
} from '../../types'
import { createFloat, withDefault } from '../../utils'

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

export interface SettlementBreakdownProcessorMetrics {
    rowsIn: number
    rowsOut: number
    hasAdjustmentRow: boolean
    hasPayoutRow: boolean
}

export const createSettlementBreakdownRowsMetrics = (): SettlementBreakdownProcessorMetrics => ({
    rowsIn: 0,
    rowsOut: 0,
    hasAdjustmentRow: false,
    hasPayoutRow: false,
})

export class SettlementBreakdownProcessor implements ProcessorInterface<
    CkoSettlementBreakdownRecord,
    UberSettlementBreakdownRecord,
    SettlementBreakdownProcessorMetrics
> {
    private processorMetrics: SettlementBreakdownProcessorMetrics = createSettlementBreakdownRowsMetrics()
    private payoutId: Date
    private outputFileName: string

    constructor(payoutId: Date, outputFileName: string) {
        this.payoutId = payoutId
        this.outputFileName = outputFileName
    }

    metrics(): SettlementBreakdownProcessorMetrics {
        return this.processorMetrics
    }

    async *process(
        records: AsyncIterable<CkoSettlementBreakdownRecord>
    ): AsyncGenerator<UberSettlementBreakdownRecord> {
        // Common rows
        let firstRow: Partial<UberSettlementBreakdownRecord> | null = null

        // Adjustment aggregation
        let adjustmentRow: Partial<UberSettlementBreakdownRecord> = {
            PayoutId: '',
            PayoutDate: null,
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
            PayoutDate: null,
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
        for await (const record of records) {
            this.processorMetrics.rowsIn++

            //const record = normalizeSettlementBreakdownRow(row)

            if (!firstRow) {
                firstRow = {
                    ClientEntityId: record.ClientEntityId,
                    ClientEntityName: record.ClientEntityName,
                    ProcessingChannelId: record.ProcessingChannelId,
                    ProcessingChannelName: record.ProcessingChannelName,
                    PayoutId: record.PayoutId,
                    PayoutDate: this.payoutId,
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
                    PayoutDate: withDefault(firstRow.PayoutDate, null),
                    NetInProcessingCurrency: record.NetInHoldingCurrency?.div(record.FxRateApplied ?? 1) as Float,
                }

                this.processorMetrics.rowsOut++
                yield uberRecord
            } else {
                if (!adjustmentRow.PayoutId) {
                    adjustmentRow.PayoutId = record.PayoutId
                    adjustmentRow.PayoutDate = firstRow.PayoutDate
                    adjustmentRow.HoldingCurrency = record.HoldingCurrency
                }

                for (const field of CkoSettlementBreakdownAggregationColumns) {
                    adjustmentRow[field] = adjustmentRow[field]?.plus(record[field] ?? 0) as Float
                }
            }

            if (!payoutRow.PayoutId) {
                payoutRow.PayoutId = record.PayoutId
                payoutRow.PayoutDate = firstRow.PayoutDate
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
            this.processorMetrics.rowsOut++
            this.processorMetrics.hasAdjustmentRow = true

            yield {
                ClientEntityId: withDefault(firstRow.ClientEntityId, ''),
                ClientEntityName: withDefault(firstRow.ClientEntityName, ''),
                ProcessingChannelId: '',
                ProcessingChannelName: '',
                Type: UberSettlementBreakdownColumnType.FeeAdjustment,
                PaymentId: '',
                Reference: '',
                ProcessedOn: null,
                AvailableOn: null,
                HoldingCurrency: withDefault(adjustmentRow.HoldingCurrency, ''),
                PayoutId: withDefault(adjustmentRow.PayoutId, ''),
                PayoutDate: withDefault(adjustmentRow.PayoutDate, null),
                GrossInHoldingCurrency: withDefault(adjustmentRow.GrossInHoldingCurrency, null),
                DeductionInHoldingCurrency: withDefault(adjustmentRow.DeductionInHoldingCurrency, null),
                NetInHoldingCurrency: withDefault(adjustmentRow.NetInHoldingCurrency, null),
                ProcessingFeeInHoldingCurrency: withDefault(adjustmentRow.ProcessingFeeInHoldingCurrency, null),
                SchemeFeeInHoldingCurrency: withDefault(adjustmentRow.SchemeFeeInHoldingCurrency, null),
                InterchangeInHoldingCurrency: withDefault(adjustmentRow.InterchangeInHoldingCurrency, null),
                TaxInHoldingCurrency: withDefault(adjustmentRow.TaxInHoldingCurrency, null),
                ReserveInHoldingCurrency: withDefault(adjustmentRow.ReserveInHoldingCurrency, null),
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
            this.processorMetrics.rowsOut++
            this.processorMetrics.hasPayoutRow = true

            yield {
                ClientEntityId: withDefault(firstRow.ClientEntityId, ''),
                ClientEntityName: withDefault(firstRow.ClientEntityName, ''),
                ProcessingChannelId: '',
                ProcessingChannelName: '',
                Type: UberSettlementBreakdownColumnType.Payout,
                PaymentId: '',
                Reference: '',
                ProcessedOn: null,
                AvailableOn: null,
                HoldingCurrency: withDefault(payoutRow.HoldingCurrency, ''),
                PayoutId: withDefault(payoutRow.PayoutId, ''),
                PayoutDate: withDefault(payoutRow.PayoutDate, null),
                GrossInHoldingCurrency: withDefault(payoutRow.GrossInHoldingCurrency, null),
                DeductionInHoldingCurrency: withDefault(payoutRow.DeductionInHoldingCurrency, null),
                NetInHoldingCurrency: withDefault(payoutRow.NetInHoldingCurrency, null),
                ProcessingFeeInHoldingCurrency: withDefault(payoutRow.ProcessingFeeInHoldingCurrency, null),
                SchemeFeeInHoldingCurrency: withDefault(payoutRow.SchemeFeeInHoldingCurrency, null),
                InterchangeInHoldingCurrency: withDefault(payoutRow.InterchangeInHoldingCurrency, null),
                TaxInHoldingCurrency: withDefault(payoutRow.TaxInHoldingCurrency, null),
                ReserveInHoldingCurrency: withDefault(payoutRow.ReserveInHoldingCurrency, null),
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
}
