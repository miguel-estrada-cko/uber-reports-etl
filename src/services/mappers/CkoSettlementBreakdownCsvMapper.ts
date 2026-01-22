import { MapperInterface } from './MapperInterface'
import { CkoSettlementBreakdownColumnType, CkoSettlementBreakdownRecord } from '../../types'
import { stringToDate, stringToFloat } from '../../utils'

export class CkoSettlementBreakdownCsvMapper implements MapperInterface<
    Record<string, string>,
    CkoSettlementBreakdownRecord
> {
    map(row: Record<string, string>): CkoSettlementBreakdownRecord {
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
}
