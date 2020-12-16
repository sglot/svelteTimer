import type { PrimitiveRepositoryInterface } from "./PrimitiveRepositoryInterface";

export abstract class LocalStorageRepositorySase implements PrimitiveRepositoryInterface {
    protected STORAGE_KEY = "history";

    read(): string {
        return localStorage.getItem(this.STORAGE_KEY);
    }

    save(data) {
        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(data)
        );
    }

    abstract modify();

}