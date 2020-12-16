export interface PrimitiveRepositoryInterface {
    read(key: string): string;
    save(key: string, data: any): void;
}