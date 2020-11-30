<script lang="ts">
    import { state, stateList } from "../../stores/stores";
    import { settings, makeDefaultSettings, advancedSettings, progressBarList } from "../../stores/stores";
    
    import Snackbar, { Actions, Label } from "@smui/snackbar";
    import Switch from "@smui/switch";
    import FormField from "@smui/form-field";
    import Radio from '@smui/radio';

    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let pgBarSelected = $progressBarList[0].name;

    let settingsIsSaved = false;
    let savedSettingsSnackbar;
    let showAdvancedSettings = false;

    onMount(() => {
        initSettings();
        console.log($state);
    });

    function initSettings(): void {
        let settings = getSavedSettings();
        if (validation(settings)) {
            console.log("validation is successfuly");
            settingsIsSaved = true;
        }
        loadSettingsConfig();
    }

    function getSavedSettings(): string {
        return localStorage.getItem("advancedSettings");
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
        let nativeObj = {
            workTime: $settings.workTime,
            relaxTime: $settings.relaxTime,
            laps: $settings.laps,
        };

        localStorage.setItem("advancedSettings", JSON.stringify(nativeObj));
        settingsIsSaved = true;
        savedSettingsSnackbar.open();
        console.log("config was saved");
    }

    function loadSettingsConfig(): void {
        let str = getSavedSettings();
        let loaded = validation(str);
        if (!loaded) {
            loaded = makeDefaultSettings();
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
        /* font-size: 1em;
        height: 1em; */
    }

    .advanced-settings__label {
        /* font-size: 0.5em; */
        /* line-height: 1em; */
        display: flex;
        justify-content: center;
        align-items: flex-start;
        cursor: pointer;
    }

    .advanced-settings__block {
        display: flex;
        flex-direction: column;
        justify-content: start;

        margin-top: 5em;
        text-align: left;
    }

    .settings__element {
        border-top: 1px solid cadetblue;
        height: 4em;
        line-height: 4em;
    }
</style>

{#if $state === $stateList.settings || $state === $stateList.end}
<div class="advanced-settings__label" on:click="{() => showAdvancedSettings = !showAdvancedSettings}">
        <div class="settings">Расширенные настройки</div>
        <span class="material-icons"> keyboard_arrow_down </span>
    </div>

    {#if showAdvancedSettings}
        <div 
            class="advanced-settings__block"
            transition:slide={{ delay: 250, duration: 1000, easing: cubicOut }}
        >
            <div class="settings__element" style="display: flex; justify-content: left;">
                <div>
                    {#each $progressBarList as option}
                    <FormField style="margin-right: 1em;">
                        <Radio bind:group={pgBarSelected} value={option.name} />
                        <span slot="label">{`${option.label}`}</span>
                    </FormField>
                    {/each}
                </div>
                <div>Индикатор прогресса</div>
            </div>

            <div class="settings__element">
                <FormField align="start">
                    <Switch bind:checked={$advancedSettings[1].enabled} />
                    <span slot="label">
                        {$advancedSettings[1].label}
                    </span>
                </FormField>
            </div>

            <div class="settings__element">
                <FormField align="start">
                    <Switch bind:checked={$advancedSettings[0].enabled} />
                    <span slot="label">
                        {$advancedSettings[0].label}
                    </span>
                </FormField>
            </div>
        </div>
    {/if}

    <Snackbar leading bind:this={savedSettingsSnackbar}>
        <Label>Настройки успешно сохранены</Label>
    </Snackbar>
{/if}
