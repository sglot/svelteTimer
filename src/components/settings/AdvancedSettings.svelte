<script lang="ts">
    import {
        state,
        stateList,
        advancedSettings,
        progressBarList,
    } from "../../stores/stores";

    import Snackbar, { Actions, Label } from "@smui/snackbar";
    import Switch from "@smui/switch";
    import FormField from "@smui/form-field";
    import Radio from "@smui/radio";
    import Slider from '@smui/slider';

    import { onMount } from "svelte";
    import { slide, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let savedSettingsSnackbar;
    let showAdvancedSettings = false;
    let isLoaded = false;

    const STORAGE_KEY = "advancedSettings";
    const REQUIRED: required_fields = ["saveHistory", "autoloadSettingsConfig", "progressBar", "barWeight"];
    
    $: weight = () => {
        //  Сохранение не по клику на бегунок а при изменении значения
        //  При отпускании бегунка вне элемента, клик не происходит 
        if (isLoaded) {
            save();
        } 

        return $advancedSettings.barWeight.value;
    }

    onMount(() => {
        initSettings();
    });

    function initSettings(): void {
        load();
    }

    function save(): void {
        // сначала должен сработать bind:checked а после уже обновлять storage
        // иначе в $advancedSettings будет старое значение
        setTimeout(() => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify($advancedSettings)
            );
            console.log("(advanced) config was saved");
        }, 100);
    }

    function load(): void {
        let str = getSavedSettings();
        let loaded = validation(str);
        if (loaded) {
            $advancedSettings = loaded;
            console.log("(advanced) config was loaded");
        }
        isLoaded = true;
    }

    function getSavedSettings(): string {
        return localStorage.getItem(STORAGE_KEY);
    }

    function validation(
        settings: string,
        // required: [...string]
    ): Record<string, advancedSettings> | null {
        if (typeof settings !== "string") {
            return null;
        }

        let newSettings: Record<string, advancedSettings>;
        try {
            newSettings = JSON.parse(settings);
            let res = true;
            console.log(newSettings);

            for (let key in REQUIRED) {
                if (Object.keys(newSettings).indexOf(REQUIRED[key]) == -1) {
                    throw new Error('has no required param ' + REQUIRED[key]);
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

    function scrollTo(id: string) {
        setTimeout(() => {
            document.getElementById(id).scrollIntoView({ behavior: "smooth" });
        }, 300);
    }
</script>

<style>
    .advanced-settings__label {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        cursor: pointer;
        margin-top: 2em;
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
        min-height: 4em;
        line-height: 4em;
    }

    .pressed {
        display: inline-block;
        -webkit-transition: -webkit-transform 0.5s;
        transition: transform 0.1s;
    }

    .pressed:hover {
        color: darkcyan;
        /* transition: translate 0.2s cubic-bezier(0, 0, 1, 1); */
        -webkit-transform: -webkit-translate(0, 5px);
        transform: translate(0, 5px);
        transition: transform 0.1s;
    }
</style>

{#if $state === $stateList.settings || $state === $stateList.end}
    <div
        class="advanced-settings__label pressed"
        on:click={() => {
            showAdvancedSettings = !showAdvancedSettings;
            scrollTo('advanced-end');
        }}>
        {#if showAdvancedSettings}
            <span
                class="material-icons"
                transition:slide={{ delay: 0, duration: 500, easing: cubicOut }}>
                keyboard_arrow_up
            </span>
        {/if}

        <div class="settings">Расширенные настройки</div>

        {#if !showAdvancedSettings}
            <span
                class="material-icons"
                transition:slide={{ delay: 0, duration: 500, easing: cubicOut }}>
                keyboard_arrow_down
            </span>
        {/if}
    </div>
    <div id="advanced-end" />

    {#if showAdvancedSettings}
        <div
            class="advanced-settings__block"
            transition:slide={{ delay: 0, duration: 500, easing: cubicOut }}>
            <div
                class="settings__element"
                style="display: flex; justify-content: left;">
                <div>Индикатор прогресса:</div>
                <div>
                    {#each $progressBarList as option}
                        <FormField style="margin-right: 1em;">
                            <Radio
                                bind:group={$advancedSettings.progressBar.selected}
                                on:click={save}
                                value={option.name} />
                            <span slot="label">{option.label}</span>
                        </FormField>
                    {/each}
                </div>
            </div>

            <div class="settings__element">
                <FormField align="start">
                    <Switch
                        bind:checked={$advancedSettings.autoloadSettingsConfig.enabled}
                        on:click={save} />
                    <span slot="label">
                        {$advancedSettings.autoloadSettingsConfig.label}
                    </span>
                </FormField>
            </div>

            <div class="settings__element">
                <FormField align="start">
                    <Switch
                        bind:checked={$advancedSettings.saveHistory.enabled}
                        on:click={save} />
                    <span slot="label">
                        {$advancedSettings.saveHistory.label}
                    </span>
                </FormField>
            </div>

            <div class="settings__element">
                {$advancedSettings.barWeight.label}: <strong>{weight()}</strong>
                
                <Slider 
                bind:value={$advancedSettings.barWeight.value} 
                min={0} max={100} step={1} discrete displayMarkers />
            </div>
        </div>
    {/if}

    <Snackbar leading bind:this={savedSettingsSnackbar}>
        <Label>Настройки успешно сохранены</Label>
    </Snackbar>
{/if}
