export interface WriterInterface {
    open(): Promise<boolean>

    write(line: string): Promise<boolean>

    close(): Promise<boolean>
}
