<script>
    import UndoRedoAPI from "../../../editor/lib/utils/UndoRedoAPI";
    import {onMount} from "svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import Icon from "../../icon/Icon.svelte";
    import ToolTip from "../../tooltip/ToolTip.svelte";
    import Dropdown from "../../dropdown/Dropdown.svelte";

    export let engine
    let currentIndex
    let history = []
    onMount(() => {
        UndoRedoAPI.onChange = (v, i) => {
            history = v.filter(e => e != null)
            currentIndex = i
        }
    })


</script>

<button
        class="button frame" on:click={UndoRedoAPI.undo}
        disabled={engine.executingAnimation}
>
    <Icon styles="font-size: 1rem">undo</Icon>
    <ToolTip content={LOCALIZATION_EN.UNDO}/>
</button>
<button
        class="button frame"
        on:click={UndoRedoAPI.redo}
        disabled={engine.executingAnimation}
>
    <Icon styles="font-size: 1rem">redo</Icon>
    <ToolTip content={LOCALIZATION_EN.REDO}/>
</button>
<div data-vertdivider="-" style="height: 15px; margin: 0"></div>
<Dropdown hideArrow={true} styles="width: 300px">
    <button slot="button" class="button frame">
        <Icon styles="font-size: 1rem">history</Icon>
        <ToolTip content={LOCALIZATION_EN.ACTIVITY_HISTORY}/>
    </button>
    <div class="dropdown-container frame">
        <div class="dropdown-header frame">
            <strong>{LOCALIZATION_EN.ACTIVITY_HISTORY}</strong>
            <button
                    class="button frame button-small frame"
                    style="max-width: 22px;gap: 4px"
                    on:click={() => UndoRedoAPI.clear()}>
                <Icon>clear_all</Icon>
                {LOCALIZATION_EN.CLEAR}
                <ToolTip content={LOCALIZATION_EN.CLEAR}/>
            </button>
        </div>
        {#if history.length === 0}
            <div style="height: 100%; width: 100%; position: relative">
                <div data-empty="-">
                    <Icon styles="font-size: 75px">history</Icon>
                    {LOCALIZATION_EN.EMPTY}
                </div>
            </div>
        {:else}
            <VirtualList items={history} let:item>
                <button
                        data-inline="-"
                        data-highlight={currentIndex === item.index + 1? "-" : undefined}
                        class="button-list frame"
                        on:click={() => UndoRedoAPI.applyIndex(item.index + 1)}
                >
                    <div class="action-data frame">
                        <strong>{LOCALIZATION_EN[item.target]}</strong>
                        <small>{item.time}</small>
                    </div>
                    <small>{item.changed} {LOCALIZATION_EN.CHANGED}</small>
                </button>
            </VirtualList>
        {/if}

    </div>

</Dropdown>

