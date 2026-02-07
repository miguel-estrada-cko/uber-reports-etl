export interface Processor<HandlerProperties, Input, Output, Metrics> {
    metrics(): Metrics

    process(records: AsyncIterable<Input> | Iterable<Input>): AsyncGenerator<Output>
}
