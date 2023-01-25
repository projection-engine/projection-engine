<script>
    import UndoRedoAPI from "../../../views/editor/lib/utils/UndoRedoAPI";
    import {onMount} from "svelte";
    import LOCALIZATION_EN from "../../../views/editor/static/LOCALIZATION_EN";
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

<button data-sveltebuttondefault="-"
        class="button frame" on:click={UndoRedoAPI.undo}
        disabled={engine.executingAnimation}
>
    <Icon styles="font-size: 1rem">undo</Icon>
    <ToolTip content={LOCALIZATION_EN.UNDO}/>
</button>
<button data-sveltebuttondefault="-"
        class="button frame"
        on:click={UndoRedoAPI.redo}
        disabled={engine.executingAnimation}
>
    <Icon styles="font-size: 1rem">redo</Icon>
    <ToolTip content={LOCALIZATION_EN.REDO}/>
</button>
<div data-sveltevertdivider="-" style="height: 15px; margin: 0"></div>
<Dropdown hideArrow={true} styles="width: 300px">
    <button data-sveltebuttondefault="-"  slot="button" class="button frame">
        <Icon styles="font-size: 1rem">history</Icon>
        <ToolTip content={LOCALIZATION_EN.ACTIVITY_HISTORY}/>
    </button>
    <div class="dropdown-container frame">
        <div class="dropdown-header frame">
            <strong>{LOCALIZATION_EN.ACTIVITY_HISTORY}</strong>
            <button data-sveltebuttondefault="-"
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
                <div data-svelteempty="-">
                    <Icon styles="font-size: 75px">history</Icon>
                    {LOCALIZATION_EN.EMPTY}
                </div>
            </div>
        {:else}
            <VirtualList items={history} let:item>
                <button data-sveltebuttondefault="-"
                        data-svelteinline="-"
                        data-sveltehighlight={currentIndex === item.index + 1? "-" : undefined}
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

