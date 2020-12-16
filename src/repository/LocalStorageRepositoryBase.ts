import type { PrimitiveRepositoryInterface } from "./PrimitiveRepositoryInterface";

export abstract class LocalStorageRepositorySase implements PrimitiveRepositoryInterface {

    abstract getKey(): string;

    read(): string {
        return localStorage.getItem(this.getKey());
    }

    save(data) {
        localStorage.setItem(
            this.getKey(),
            JSON.stringify(data)
        );
    }

}