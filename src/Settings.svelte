<script lang="ts">
    import IconButton, { Icon } from "@smui/icon-button";
    import { onMount } from "svelte";
    import { savedSettings, settings, makeDefaultSettings} from "./stores/stores";

    let settingsIsSaved = false;
    let savedConf;
    
    const defaultSettings: selectableParametersConfiguration = {
    workTime:   30,
    relaxTime:  30,
    laps:       3
}
    const unsubscribeSavedSettings = savedSettings.subscribe((value) => {
        savedConf = value;
    });

    onMount(() => {
        initSettings();
    });

    function initSettings(): void {
        let settings = getSavedSettings();
        if (!validation(settings)) {
            setDefaultSettingsConfig();
            console.log("error validation");
            return;
        }

        console.log("validation is successfuly");
        settingsIsSaved = true;
    }

    function getSavedSettings(): string {
        return localStorage.getItem("savedSettings");
    }

    function validation(
        settings: string
    ): selectableParametersConfiguration | null {
        if (typeof settings !== "string") {
            return null;
        }

        let newSettings: selectableParametersConfiguration;
        try {
            let object = JSON.parse(settings);
            newSettings = {
                workTime: object.workTime,
                relaxTime: object.relaxTime,
                laps: object.laps,
            };
        } catch (e) {
            console.log(e.message);
            return null;
        }

        return newSettings;
    }

    function saveSettingsConfig(): void {
        let obj = {
            workTime: $settings.workTime,
            relaxTime: $settings.relaxTime,
            laps: $settings.laps,
        };

        localStorage.setItem("savedSettings", JSON.stringify(obj));
        settingsIsSaved = true;
        console.log("config was saved");
    }

    function loadSettingsConfig(): void {
        let str = getSavedSettings();
        let loaded = validation(str);
        if (!loaded) {
            loaded = defaultSettings;
        }

        $settings = loaded;
        console.log("config was loaded");
    }

    function setDefaultSettingsConfig(): void {
        $settings = makeDefaultSettings();
        console.log("default was setted");
    }

</script>

<style>
    .settings {
        font-size: 2em;
    }
</style>

<div class="settings">
    <IconButton
        class="material-icons"
        on:click={saveSettingsConfig}
        ripple={false}>
        save
    </IconButton>

    <IconButton
        class="material-icons"
        on:click={loadSettingsConfig}
        disabled={!settingsIsSaved}
        ripple={false}>
        unarchive
    </IconButton>

    <IconButton
        class="material-icons"
        on:click={setDefaultSettingsConfig}
        ripple={false}>
        autorenew
    </IconButton>
</div>
