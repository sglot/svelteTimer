<script lang="ts">
    import { state, stateList } from "../stores/stores";
    import Button from '@smui/button';
    import Snackbar, {Actions, Label} from '@smui/snackbar';
    import { onMount } from "svelte";
    import { advancedSettings } from "../stores/stores";
    
    let showIntroOne;
    let showIntroTwo;
    let showIntroThree;
    let showIntroFour;


    onMount(() => {
        // advanced settings должны загрузиться раньше, потому что есть зависимость
        setTimeout(() => {
            initSettings();
        }, 1);
        console.log($state);
    });

    function initSettings(): void {
        if ($advancedSettings.introduction.enabled) {
            showIntroOne.open();
            setTimeout(() => {
                showIntroTwo.open();
            }, 1000);
            setTimeout(() => {
                showIntroThree.open();
            }, 2000);
            setTimeout(() => {
                showIntroFour.open();
            }, 3000);
        }
    }
    
</script>

<style>

</style>



<Snackbar leading bind:this={showIntroOne} >
    <Label>
        Прежде чем начать...
    </Label>
    <Actions>
      <Button>Понятно</Button>
    </Actions>
</Snackbar>
<Snackbar leading bind:this={showIntroTwo} >
    <Label>
        Скорее всего стоит проверить настройки устройства.
    </Label>
    <Actions>
      <Button>Понятно</Button>
    </Actions>
</Snackbar>
<Snackbar leading bind:this={showIntroThree} >
    <Label>
        Для комфортного использования таймера лучше установить угасание экрана в "никогда".
    </Label>
    <Actions>
      <Button>Понятно</Button>
    </Actions>
</Snackbar>
<Snackbar leading bind:this={showIntroFour} >
    <Label>
        Отключить отображение подсказок при загрузке приложения можно в расширенных настройках
    </Label>
    <Actions>
      <Button>Понятно</Button>
    </Actions>
</Snackbar>