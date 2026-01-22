import { ReaderInterface } from '../services/readers'
import { Float } from './Float'

/*
export type CkoSettlementBreakdownReport = {
    Date: Date
    InputReader: ReaderInterface
    OutputFileName: string
}
*/

export type CkoSettlementBreakdownRecord = {
    ClientEntityId: string
    ClientEntityName: string
    ProcessingChannelId: string
    ProcessingChannelName: string
    Type: CkoSettlementBreakdownColumnType
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

export enum CkoSettlementBreakdownColumnType {
    Charge = 'Charge',
    PartialCharge = 'Partial Charge',
    Refund = 'Refund',
    PartialRefund = 'Partial Refund',
    Void = 'Void',
}
