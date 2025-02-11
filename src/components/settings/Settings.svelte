<script lang="ts">
    import { state, stateList } from "../../stores/stores";
    import IconButton, { Icon } from "@smui/icon-button";
    import Snackbar, {Actions, Label} from '@smui/snackbar';
    import { onMount } from "svelte";
    import { settings, makeDefaultSettings, advancedSettings } from "../../stores/stores";
    
    let settingsIsSaved = false;
    let savedSettingsSnackbar;

    const STORAGE_KEY = "savedSettings";

    onMount(() => {
        // advanced settings должны загрузиться раньше, потому что есть зависимость
        setTimeout(() => {
            initSettings();
        }, 1);
        console.log($state);
    });

    function initSettings(): void {
        let settings = getSavedSettings();

        if (validation(settings)) {
            console.log("validation is successfuly");
            settingsIsSaved = true;
        }

        if ($advancedSettings.autoloadSettingsConfig.enabled === true) {
            loadSettingsConfig();       
        }
    }

    function getSavedSettings(): string {
        return localStorage.getItem(STORAGE_KEY);
    }

    function validation(settings: string): selectableParametersConfiguration | null {
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
            console.error(e.message);
            return null;
        }

        return newSettings;
    }

    function saveSettingsConfig(): void {
        let nativeObj = {
            workTime: $settings.workTime,
            relaxTime: $settings.relaxTime,
            laps: $settings.laps,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nativeObj));
        settingsIsSaved = true;
        savedSettingsSnackbar.open();
        console.log("config was saved");
    }

    function loadSettingsConfig(): void {
        let str = getSavedSettings();
        let loaded = validation(str);
        if (!loaded) {
            loaded = makeDefaultSettings();
            console.log("loading default settings");
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

{#if $state === $stateList.settings || $state === $stateList.end}
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
            refresh
        </IconButton>
    </div>

    
{/if}

<Snackbar leading  bind:this={savedSettingsSnackbar}>
    <Label>Настройки успешно сохранены</Label>
</Snackbar>