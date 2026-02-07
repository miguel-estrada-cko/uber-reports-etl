import { Mapper } from '../services/mappers'
import { Processor, ProcessorMetrics } from '../services/processors'
import { Handler } from './Handler'
import { HandlerProperties } from './HandlerProperties'

export abstract class AbstractHandler<T extends HandlerProperties> implements Handler<T> {
    static readonly pattern: RegExp
    abstract readonly name: string
    abstract readonly columns: object

    public readonly mapper: Mapper<any, any>
    public readonly processor: Processor<HandlerProperties, any, any, ProcessorMetrics>

    constructor(
        public properties: T,
        _mapper: any,
        _processor: any
    ) {
        this.mapper = new _mapper()
        this.processor = new _processor(properties)
    }

    map(inputRows: AsyncIterable<any>) {
        const mapper = this.mapper
        return (async function* () {
            for await (const row of inputRows) {
                yield mapper.map(row)
            }
        })()
    }

    getColumns(): { key: string; header: string }[] {
        return Object.entries(this.columns).map(([key, header]) => ({
            key,
            header,
        }))
    }

    abstract getOutputFileName(): string
}
