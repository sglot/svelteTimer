export interface PrimitiveRepositoryInterface {
    read(): string;
    save(data: any): void;
}