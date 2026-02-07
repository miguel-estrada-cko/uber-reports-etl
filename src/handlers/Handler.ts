import { Mapper } from '../services/mappers'
import { Processor, ProcessorMetrics } from '../services/processors'
import { HandlerProperties } from './HandlerProperties'

export interface Handler<T extends HandlerProperties = HandlerProperties> {
    //readonly pattern: RegExp
    readonly name: string
    readonly columns: object

    readonly mapper: Mapper<any, any>
    readonly processor: Processor<HandlerProperties, any, any, ProcessorMetrics>

    readonly properties: T

    map(inputRows: AsyncIterable<any>): any

    getColumns(): { key: string; header: string }[]

    getOutputFileName(): string
}
