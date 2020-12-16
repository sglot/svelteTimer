import { LocalStorageRepositorySase } from "./LocalStorageRepositoryBase";

export class HistoryRepository extends LocalStorageRepositorySase {
    protected static STORAGE_KEY = "history";

    protected static REQUIRED: required_fields = [
        "id",
        "date",
        "work",
        "relax",
        "laps",
        "success",
    ];

    public static RULES: rules = {
        "required": HistoryRepository.REQUIRED,
    };

    load(modify: boolean = false) {
        let str = this.read();
        let loaded = this.validationDataIntegrity(str, HistoryRepository.RULES, modify);
        if (loaded) {
            // $advancedSettings = loaded;
            console.log(typeof (this) + " !history config was loaded!");
            return loaded;
        }
        console.log(loaded);
        return [];
    }

    validationDataIntegrity(data: string, rules: rules, modify: boolean = false): history | null {
        if (typeof data !== "string") {
            return null;
        }

        let verifiable: history;

        try {
            verifiable = JSON.parse(data);
            console.log("verifiable history = " + verifiable);

            for (let rowIndex in verifiable) {
                let row: historyRow = verifiable[rowIndex];
                console.log("verifiable history row = " + row);

                for (let key in rules.required) {
                    if (Object.keys(row).indexOf(rules.required[key]) == -1) {
                        throw new Error('has no required param ' + rules.required[key]);
                    }
                }
                console.log(row.date);

                if (row.date == undefined || typeof row.date !== "string") {
                    throw new Error('date is not string: = ' + typeof (row.date));
                }

                if (row.success == undefined || typeof row.success !== "boolean") {
                    throw new Error('type of success is not boolean');
                }

                if (row.id == undefined || !isFinite(row.id)) {
                    console.error(typeof (row.id));
                    throw new Error('type of id is not number');
                }

                if (row.work == undefined || !isFinite(row.work)) {
                    console.error(typeof (row.work));
                    throw new Error('type of work is not number');
                }

                if (row.relax == undefined || !isFinite(row.relax)) {
                    console.error(typeof (row.relax));
                    throw new Error('type of relax is not number');
                }

                if (row.laps == undefined || !isFinite(row.laps)) {
                    console.error(typeof (row.laps));
                    throw new Error('type of laps is not number');
                }

                if (modify) {
                    row = this.modify(row);
                }
                
            }
        } catch (e) {
            console.error('validation has error: ' + e.message);
            return null;
        }

        return verifiable;
    }

    modify(row: historyRow): historyRow {
        let split = row.date.split(', ');
        row.time = split[1];
        row.date = split[0];

        return row;
    }
}