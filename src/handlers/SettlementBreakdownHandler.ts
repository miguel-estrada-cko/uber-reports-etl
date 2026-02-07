import { CkoSettlementBreakdownCsvMapper } from '../services/mappers'
import { SettlementBreakdownProcessor } from '../services/processors'
import { CkoSettlementBreakdownRecord, UberSettlementBreakdownColumns, UberSettlementBreakdownRecord } from '../types'
import { AbstractHandler } from './AbstractHandler'
import { HandlerException } from './HandlerException'
import { Handler } from './Handler'
import { HandlerProperties } from './HandlerProperties'

export interface SettlementBreakdownProperties extends HandlerProperties {
    readonly payoutId: string
    readonly payoutDate: Date
}

export class SettlementBreakdownHandler
    extends AbstractHandler<SettlementBreakdownProperties>
    implements Handler<SettlementBreakdownProperties>
{
    static pattern = new RegExp(/^settlement-breakdown_(ent_[^_]+)_(\d{8})_([^_]+)_(\d+)\.csv$/i)
    public name: string = 'SettlementBreakdown'
    public columns: object = UberSettlementBreakdownColumns

    constructor(properties: SettlementBreakdownProperties) {
        super(properties, CkoSettlementBreakdownCsvMapper, SettlementBreakdownProcessor)
    }

    static factory(fileName: string): SettlementBreakdownHandler {
        try {
            const [, entityId, rawPayoutDate, payoutId, reportPage] = fileName.match(this.pattern) || []
            const payoutDate = new Date(
                `${rawPayoutDate.slice(0, 4)}-${rawPayoutDate.slice(4, 6)}-${rawPayoutDate.slice(6, 8)}T00:00:00Z`
            )

            const properties: SettlementBreakdownProperties = {
                entityId: entityId.trim(),
                payoutId: payoutId.trim(),
                payoutDate: payoutDate,
                reportPage: Number(reportPage),
            }

            return new this(properties)
        } catch (error: unknown) {
            throw new HandlerException.InvalidMetadata(fileName)
        }
    }

    getOutputFileName(): string {
        return `Uber_Eats/settlement_report_${this.properties.payoutDate.toISOString().slice(0, 10).replace(/-/g, '')}_${String(this.properties.reportPage | 0)}.csv`
    }
}
