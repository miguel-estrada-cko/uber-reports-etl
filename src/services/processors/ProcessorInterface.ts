export interface ProcessorInterface<Input, Output, Metrics> {
    metrics(): Metrics

    process(records: AsyncIterable<Input> | Iterable<Input>): AsyncGenerator<Output>
}
