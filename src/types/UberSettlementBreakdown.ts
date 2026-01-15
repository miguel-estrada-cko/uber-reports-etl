import { Float } from './Float'
import { ReadStream } from 'fs'

export type UberSettlementBreakdownRecord = {
    ClientEntityId: string
    ClientEntityName: string
    ProcessingChannelId: string
    ProcessingChannelName: string
    Type: UberSettlementBreakdownColumnType
    PaymentId: string
    Reference: string
    ProcessedOn: Date | null
    AvailableOn: Date | null
    HoldingCurrency: string
    PayoutId: string
    GrossInHoldingCurrency: Float | null
    DeductionInHoldingCurrency: Float | null
    NetInHoldingCurrency: Float | null
    ProcessingFeeInHoldingCurrency: Float | null
    SchemeFeeInHoldingCurrency: Float | null
    InterchangeInHoldingCurrency: Float | null
    TaxInHoldingCurrency: Float | null
    ReserveInHoldingCurrency: Float | null
    ProcessingCurrency: string
    GrossInProcessingCurrency: Float | null
    NetInProcessingCurrency: Float | null
    FxRateApplied: Float | null
    PaymentMethod: string
    CardType: string
    CardCategory: string
    IssuerCountry: string
    EntityCountry: string
    Region: string
    Mid: string
    MerchantCategoryCode: string
    AcquirerReferenceNumber: string
    AccountFundingTransaction: string
    EntitySegment: string
    IssuingBank: string
    Bin: string
    PaymentType: string
    ProcessedOnUTC: Date | null
    AvailableOnUTC: Date | null
    Udf1: string
    Udf2: string
    Udf3: string
    Udf4: string
    Udf5: string
    ActionId: string
    Timezone: string
    CardProductType: string
}

export const UberSettlementBreakdownColumns: Record<string, string> = {
    ClientEntityId: 'Client Entity ID',
    ClientEntityName: 'Client Entity Name',
    ProcessingChannelId: 'Processing Channel ID',
    ProcessingChannelName: 'Processing Channel Name',
    Type: 'Type',
    PaymentId: 'Payment ID',
    Reference: 'Reference',
    ProcessedOn: 'Processed On',
    AvailableOn: 'Available On',
    HoldingCurrency: 'Holding Currency',
    PayoutId: 'Payout ID',
    GrossInHoldingCurrency: 'Gross In Holding Currency',
    DeductionInHoldingCurrency: 'Deduction In Holding Currency',
    NetInHoldingCurrency: 'Net In Holding Currency',
    ProcessingFeeInHoldingCurrency: 'Processing Fee In Holding Currency',
    SchemeFeeInHoldingCurrency: 'Scheme Fee In Holding Currency',
    InterchangeInHoldingCurrency: 'Interchange In Holding Currency',
    TaxInHoldingCurrency: 'Tax In Holding Currency',
    ReserveInHoldingCurrency: 'Reserve In Holding Currency',
    ProcessingCurrency: 'Processing Currency',
    GrossInProcessingCurrency: 'Gross In Processing Currency',
    NetInProcessingCurrency: 'Net In Processing Currency',
    FxRateApplied: 'FX Rate Applied',
    PaymentMethod: 'Payment Method',
    CardType: 'Card Type',
    CardCategory: 'Card Category',
    IssuerCountry: 'Issuer Country',
    EntityCountry: 'Entity Country',
    Region: 'Region',
    Mid: 'MID',
    MerchantCategoryCode: 'Merchant Category Code',
    AcquirerReferenceNumber: 'Acquirer Reference Number',
    AccountFundingTransaction: 'Account Funding Transaction',
    EntitySegment: 'Entity Segment',
    IssuingBank: 'Issuing Bank',
    Bin: 'BIN',
    PaymentType: 'Payment Type',
    ProcessedOnUTC: 'Processed On UTC',
    AvailableOnUTC: 'Available On UTC',
    Udf1: 'UDF 1',
    Udf2: 'UDF 2',
    Udf3: 'UDF 3',
    Udf4: 'UDF 4',
    Udf5: 'UDF 5',
    ActionId: 'Action ID',
    Timezone: 'Timezone',
    CardProductType: 'Card Product Type',
}

export enum UberSettlementBreakdownColumnType {
    Charge = 'Charge',
    PartialCharge = 'Partial Charge',
    Refund = 'Refund',
    Adjustment = 'Adjustment',
    Payout = 'Payout',
}
