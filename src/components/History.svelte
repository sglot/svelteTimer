<script lang="ts">
    import { runAttempts } from "../stores/stores";

    import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";

    import { onMount } from "svelte";
    import { slide, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { HistoryRepository } from "../repository/HistoryRepository";

    let showHistory = false;
    let history = [];
    let repository: HistoryRepository = new HistoryRepository();

    onMount(() => {
        // инициализация количества попыток запуска на текущем устройстве
        runAttempts.set(parseInt(localStorage.getItem("runAttempts")));
        if (!isFinite($runAttempts) || $runAttempts === null) {
            runAttempts.set(0);
            localStorage.setItem("runAttempts", "0");
        }

        initHistory();
    });

    function initHistory(): void {
        load();
    }

    function load(modify: boolean = true) {
        let loaded;
        if ((loaded = repository.load(modify))) {
            history = loaded;

            console.log("history ==== ", history);
        }
    }

    function toggleShow() {
        showHistory = !showHistory; 
        let body = document.querySelector('body') as HTMLElement;
        console.log(body);
        
        // setTimeout(() => {
        //     body.style.overflow = showHistory ? 'none' : 'auto';
        //     console.log("timeout");
        // }, 100);
    }

    function changeComment(id: string) {
        load(false);
        let index = history.findIndex((row) => row.id == id);
        history[index].comment = prompt("Комментарий", history[index].comment);
        repository.save(history);
        load();
    }


    
    let width;
    
    $: mobile = width < 640 ? true : false;
    $: showHistory && load();

    // function scrollTo(id: string) {
    //     setTimeout(() => {
    //         document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    //     }, 300);
    // }
</script>

<style>
    .pressed {
        display: inline-block;
        -webkit-transition: -webkit-transform 0.5s;
        transition: transform 0.2s;
        cursor: pointer;
    }

    .pressed:hover {
        color: darkcyan;
    }

    #history {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-second);
        color: var(--color-second);
        overflow-y: scroll;
        /* transition: overflow 0.5s cubic-bezier(0, 0, 1, 1); */
        /* opacity: 0.9;
        filter: alpha(opacity=90);  */
        /* background-color: hsla(0, 0%, 100%, 0.8); */
        z-index: 10;
        box-shadow: 0px 3px 2px 0px #91949b;
    }

    .work {
        color: rgba(255, 124, 32, 1);
    }

    .relax {
        color: rgba(59, 153, 255, 1);
    }

    .completed {
        color: rgba(0, 182, 10, 1);
    }

    .uncompleted {
        color: rgba(0, 0, 0, 1);
    }

    .date--mobile {
        text-align: left;
        height: 50%;
    }
    
    .time--mobile {
        height: 50%;
        text-align: left;
        font-style: italic;
    }

    .history-buttons__row {
        height: 2.5em;
    }

    .table-cell__combo {
        font-size: 1.25em;
    }

    .history-icons_mobile {
        line-height: 2em;
    }

    @media (max-width: 750px) {
        :global().mdc-data-table__cell, :global().mdc-data-table__header-cell {
            padding-right: 12px!important;
            padding-left: 12px!important;
        }
    }

    @media (max-width: 640px) {
        :global().mdc-data-table__cell, :global().mdc-data-table__header-cell {
            padding-right: 6px!important;
            padding-left: 6px!important;
        }

        .table-cell__combo {
            font-size: 1em;
        }
    }
</style>

<span
    style="text-decoration:underline steelblue; cursor: pointer;"
    class="pressed"
    on:click={toggleShow}>
    {$runAttempts}
</span>

{#if showHistory}
    <div
        bind:offsetWidth={width}
        id="history"
        transition:slide={{ delay: 100, duration: 500, easing: cubicOut }}>

        <div>
            <h2>История</h2>
            <div class="history-buttons__row">
                <!-- <span class="material-icons"> history </span> -->
                <span
                    on:click={toggleShow}
                    class="material-icons pressed">
                    close
                </span>
            </div>
        </div>

        {#if mobile}
            <div>
                <DataTable table$aria-label="History">
                    <Head>
                        <Row>
                            <Cell>
                                <span class="material-icons history-icons_mobile">
                                    format_list_numbered_rtl
                                </span>
                            </Cell>
                            <Cell>
                                <span class="material-icons history-icons_mobile">
                                    calendar_today
                                </span>
                            </Cell>
                            <Cell>
                                <span class="material-icons work history-icons_mobile">
                                    timelapse
                                </span>
                            </Cell>
                            <Cell>
                                <span class="material-icons relax history-icons_mobile">
                                    timelapse
                                </span>
                            </Cell>
                            <Cell>
                                <span class="material-icons history-icons_mobile">
                                    trip_origin
                                </span>
                            </Cell>
                            <Cell>
                                <span class="material-icons history-icons_mobile">
                                    exposure_plus_1
                                </span>
                            </Cell>
                            <Cell>
                                <span class="material-icons history-icons_mobile">
                                    comment
                                </span>
                            </Cell>
                        </Row>
                    </Head>
                    <Body>
                        {#each history as row}
                            <Row>
                                <Cell>
                                    <p class="table-cell__combo">{row.id}</p>
                                    <p class="table-cell__combo">
                                        {#if row.success === true}
                                            <span
                                                class="material-icons completed">
                                                done
                                            </span>
                                        {:else}
                                            <span
                                                class="material-icons uncompleted">
                                                horizontal_rule
                                            </span>
                                        {/if}
                                    </p>
                                </Cell>
                                <Cell>
                                    <p class="date--mobile table-cell__combo">{row.date}</p>
                                    <p class="time--mobile table-cell__combo">{row.time}</p>
                                </Cell>
                                <Cell>
                                    <span class="work"> {row.work} </span>
                                </Cell>
                                <Cell>
                                    <span class="relax"> {row.relax} </span>
                                </Cell>
                                <Cell>{row.laps}</Cell>
                            
                                <Cell>
                                    {#if row.weight}
                                            {row.weight}
                                    {:else}
                                        <span
                                            class="material-icons uncompleted">
                                            horizontal_rule
                                        </span>
                                    {/if}
                                </Cell>
                                <Cell>
                                    {#if row.comment && row.comment != ""}
                                        <span class="pressed" on:click={() => changeComment(row.id)}>{row.comment}</span>
                                    {:else}
                                        <span class="pressed" on:click={() => changeComment(row.id)}>добавить</span>
                                    {/if}
                                </Cell>
                            </Row>
                        {/each}
                    </Body>
                </DataTable>
            </div>

        {:else}

            <div>
                <DataTable table$aria-label="History">
                    <Head>
                        <Row>
                            <Cell>#</Cell>
                            <Cell>Дата</Cell>
                            <Cell>Работа</Cell>
                            <Cell>Отдых</Cell>
                            <Cell>Круги</Cell>
                            <Cell>Завершено</Cell>
                            <Cell>Вес</Cell>
                            <Cell>Комментарий</Cell>
                        </Row>
                    </Head>
                    <Body>
                        {#each history as row}
                            <Row>
                                <Cell>{row.id}</Cell>
                                <Cell>{row.date} {row.time}</Cell>
                                <Cell>
                                    <span class="work"> {row.work} </span>
                                </Cell>
                                <Cell>
                                    <span class="relax"> {row.relax} </span>
                                </Cell>
                                <Cell>{row.laps}</Cell>
                                <Cell>
                                    <div style="text-aligin=center">
                                        {#if row.success === true}
                                            <span
                                                class="material-icons completed">
                                                done
                                            </span>
                                        {:else}
                                            <span
                                                class="material-icons uncompleted">
                                                horizontal_rule
                                            </span>
                                        {/if}
                                    </div>
                                </Cell>
                                <Cell>
                                    {#if row.weight}
                                            {row.weight}
                                    {:else}
                                        <span
                                            class="material-icons uncompleted">
                                            horizontal_rule
                                        </span>
                                    {/if}
                                </Cell>
                                <Cell>
                                    {#if row.comment && row.comment != ""}
                                        <span class="pressed" on:click={() => changeComment(row.id)}>{row.comment}</span>
                                    {:else}
                                        <span class="pressed" on:click={() => changeComment(row.id)}>добавить</span>
                                    {/if}
                                </Cell>
                            </Row>
                        {/each}
                    </Body>
                </DataTable>
            </div>
        {/if}
    </div>
{/if}
