<script lang="ts">
    import { state } from "../stores/stores";
    import { onMount } from "svelte";
    import { advancedSettings } from "../stores/stores";
    import { slide } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";


    let showIntro = false;
    const STORAGE_KEY = "advancedSettings";

    onMount(() => {
        // advanced settings должны загрузиться раньше, потому что есть зависимость
        setTimeout(() => {
            initSettings();
        }, 1);
        console.log($state);
    });

    function initSettings(): void {
        if ($advancedSettings.introduction.enabled) {
            showIntro = true;
        }
    }

    function toggleShow() {
        showIntro = !showIntro;
    }

    function save(): void {
        // сначала должен сработать bind:checked а после уже обновлять storage
        // иначе в $advancedSettings будет старое значение
        setTimeout(() => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify($advancedSettings)
            );
            console.log("(advanced) itro don't show more");
        }, 100);
    }
</script>

<style>
    .intro {
        position: fixed;
        top: 0;
        left: 0;
        /* width: 100%; */
        /* height: 50%; */
        background: rgb(255, 255, 255);
        overflow: visible;
        /* background-color: hsla(0, 0%, 100%, 0.8); */
        z-index: 10;
        box-shadow: 0px 3px 2px 0px #91949b;
        padding: 0 2rem;
    }

    .pressed {
        display: inline-block;
        -webkit-transition: -webkit-transform 0.5s;
        transition: transform 0.2s;
        cursor: pointer;
        padding-bottom: 2rem;
    }

    .pressed:hover {
        color: darkcyan;
    }
</style>

{#if showIntro}
    <div
        class="intro"
        transition:slide={{ delay: 100, duration: 500, easing: cubicOut }}>
        <div style="background-color: hsla(0, 0%, 100%, 0.8);">
            <h2>Приветствие</h2>
            <div class="history-buttons__row">
                <span class="material-icons"> chat_bubble_outline </span>

                <p>Прежде чем начать...</p>
                <p>Скорее всего стоит проверить настройки устройства.</p>
                <p>
                    Для комфортного использования таймера лучше установить
                    угасание экрана в "никогда".
                </p>
                
                <div class="settings__element">
                    <FormField align="end">
                        <span slot="label">
                            Показывать приветствие и дальше?
                        </span>
                        <Switch
                            bind:checked={$advancedSettings.introduction.enabled}
                            on:click={save} />
                    </FormField>
                </div>

                <p>Включить/отключить показ приветствия можно в расширенных настройках.</p>

                <span on:click={toggleShow} class="material-icons pressed">
                    close
                </span>
            </div>
        </div>
    </div>
{/if}
