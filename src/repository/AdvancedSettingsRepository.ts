import { LocalStorageRepositorySase } from "./LocalStorageRepositoryBase";
import { advSettings } from "../stores/stores";

export class AdvancedSettingsRepository extends LocalStorageRepositorySase {
    
    protected static STORAGE_KEY = "advancedSettings";
    protected static REQUIRED: required_fields = [
        "saveHistory", 
        "autoloadSettingsConfig", 
        "progressBar", 
        "barWeight",
        "introduction"
    ];

    public static RULES: rules = {
        "required": AdvancedSettingsRepository.REQUIRED,
    };

    getKey(): string {
        return AdvancedSettingsRepository.STORAGE_KEY;
    }

    load(modify: boolean = false) {
        let str = this.read();
        let loaded = this.validationDataIntegrity(str, AdvancedSettingsRepository.RULES, modify);
        if (loaded) {
            // $advancedSettings = loaded;
            console.log(typeof (this) + " !history config was loaded!");
            return loaded;
        }
        console.log(loaded);
        return advSettings;
    }

    validationDataIntegrity(
        settings: string,
        rules: rules,
        modify: boolean = false
    ): Record<string, advancedSettings> | null {
        if (typeof settings !== "string") {
            return null;
        }

        let newSettings: Record<string, advancedSettings>;
        try {
            newSettings = JSON.parse(settings);
            let res = true;
            console.log('new settings=', newSettings);

            for (let key in rules.required) {
                if (Object.keys(newSettings).indexOf(rules.required[key]) == -1) {
                    throw new Error('has no required param ' + rules.required[key]);
                }
            }

            for (let key in newSettings) {

                let element = newSettings[key];

                // required too
                if (element.label == undefined || typeof element.label !== "string" ) {
                    throw new Error('label is not string: object = ' + key);
                }

                if (element.enabled == undefined && element.selected == undefined && element.value == undefined) {
                    throw new Error('enabled and selected and value is undefuned all ');
                }

                if (element.enabled != undefined && typeof element.enabled !== "boolean") {
                    throw new Error('type of enabled is not boolean');
                }

                if (element.selected != undefined && typeof element.selected !== "string") {
                    throw new Error('type of selected is not string');
                }

                if (element.value != undefined && !isFinite(element.value)) {
                    console.error(typeof(element.value));
                    throw new Error('type of value is not number');
                }
            }

            console.log("valid = =", res);
        } catch (e) {
            console.error('validation has error: ' + e.message);
            return null;
        }

        return newSettings;
    }

}