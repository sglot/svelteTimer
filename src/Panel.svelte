<script lang="ts">
    import Button from "@smui/button";
    import { onMount } from "svelte";
    import { defaultSettings, savedSettings, settings } from "./stores/stores";

    let settingsIsSaved = false;
    let savedConf;
    // let appConf;

    const unsubscribeSavedSettings = savedSettings.subscribe((value) => {
        savedConf = value;
    });

    // const unsubscribeCurrentSettings = settings.subscribe((value) => {
    //     appConf = value;
    // });

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

    function validation(settings: string): selectableParametersConfiguration | null {
        if (typeof settings !== "string") {
            return null;
        }

        let object = JSON.parse(settings);
        let newSettings: selectableParametersConfiguration;

        try {
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

    function saveSettingsConfig() {
        console.log("config was saved");
        let obj = { 
            workTime: $settings.workTime,
            relaxTime: $settings.relaxTime,
            laps: $settings.laps,
         };

        localStorage.setItem("savedSettings", JSON.stringify(obj));
        settingsIsSaved = true;
    }

    function loadSettingsConfig() {
        let str = getSavedSettings();
        let loaded = validation(str);
        if (!loaded) {
            loaded = defaultSettings;
        }

        $settings = loaded;
        console.log("config was loaded");
    }

    function setDefaultSettingsConfig() {
        $settings = defaultSettings;
        console.log("default was setted");
    }
</script>

<style>
    .settings {
        font-size: 0.8em;
    }
</style>

<div class="settings">
    <span>Текущие настройки: </span>
    <Button on:click={saveSettingsConfig} class="settings">Запомнить</Button>

    {#if settingsIsSaved}
        <Button on:click={loadSettingsConfig} class="settings">
            Загрузить сохранённые
        </Button>
    {/if}

    <Button on:click={setDefaultSettingsConfig}>Сбросить</Button>
</div>
