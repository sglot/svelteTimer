<script lang="ts">
    import {
        state,
        stateList,
        advancedSettings,
        progressBarList,
        themeList
    } from "../../stores/stores";

    import { AdvancedSettingsRepository } from "../../repository/AdvancedSettingsRepository";

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
    let repository: AdvancedSettingsRepository = new AdvancedSettingsRepository();

    const STORAGE_KEY = "advancedSettings";
    const REQUIRED: required_fields = [
        "saveHistory", 
        "autoloadSettingsConfig", 
        "progressBar", 
        "barWeight",
        "introduction",
        "theme"
    ];
    
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
            repository.save($advancedSettings);
            console.log("(advanced) config was saved");
        }, 100);
    }

    function load() {
        let loaded = repository.load(false);
        if (loaded) {
            $advancedSettings = loaded;
            console.log("(advanced) config was loaded");
        }
        isLoaded = true;

        setTheme();
    }  

    function setTheme() {
        setTimeout(() => {
            let body = document.querySelector('body');
            console.log(body.classList[0]);
            console.log($advancedSettings.theme.selected);
            if (body.classList[0] !== $advancedSettings.theme.selected) {
                body.classList.remove(body.classList[0]);
                body.classList.add($advancedSettings.theme.selected);
            }
        }, 105);
        
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

    .progress__block {
        display: flex; 
        justify-content: left;

    }

    @media (max-width: 640px) {
    
        .progress__block {
            flex-flow: column;
        }
    }

    @media (max-width: 450px) {
    
    .progress__items {
        display: grid;
    }
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
                class="settings__element progress__block">
                <div>Индикатор прогресса:</div>
                <div class="progress__items">
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
                        bind:checked={$advancedSettings.introduction.enabled}
                        on:click={save} />
                    <span slot="label">
                        {$advancedSettings.introduction.label}
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

            <div
                class="settings__element progress__block">
                <div>Тема:</div>
                <div class="progress__items">
                    {#each $themeList as option}
                        <FormField style="margin-right: 1em;">
                            <Radio
                                bind:group={$advancedSettings.theme.selected}
                                on:click={() => {save(); setTheme();}}
                                value={option.name} />
                            <span slot="label">{option.label}</span>
                        </FormField>
                    {/each}
                </div>
            </div>
        </div>
    {/if}

    <Snackbar leading bind:this={savedSettingsSnackbar}>
        <Label>Настройки успешно сохранены</Label>
    </Snackbar>
{/if}
