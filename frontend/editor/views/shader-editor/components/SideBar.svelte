<script lang="ts">

    import Nodes from "./Nodes.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import ResizableBar from "../../../../shared/components/resizable/ResizableBar.svelte";

    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import type Canvas from "../libs/Canvas";
    import type ShaderNode from "../templates/ShaderNode";
    import ShaderComment from "../templates/ShaderComment";
    import {onDestroy, onMount} from "svelte";
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN";

    export let canvasAPI: Canvas
    let tab = 0
    let mainNode: ShaderNode | ShaderComment | undefined

    onMount(() => {
        canvasAPI.lastSelectionListener = () => mainNode = canvasAPI.lastSelection
    })
    onDestroy(() => {
        canvasAPI.lastSelectionListener = undefined
    })
</script>

<div class="wrapper">
    <div style="max-width: 0"></div>
    <ResizableBar type="width"/>
    {#if tab === 0}
        <Nodes/>
    {:else if !!mainNode}
        <AttributeEditor node={mainNode} updateCanvas={() => canvasAPI.clear()}/>
    {/if}
    <div class="buttons">
        <button data-sveltebuttondefault="-" class="button" data-sveltehighlight={tab === 0 ? "-" : ""}
                on:click={() => tab = 0}>
            <label>
                {LocalizationEN.ADD}
            </label>
            <Icon style="font-size: .9rem">add</Icon>
        </button>
        <button data-sveltebuttondefault="-" disabled={!mainNode} class="button"
                data-sveltehighlight={tab === 1 ? "-" : ""} on:click={() => tab = 1}>
            <label>
                {LocalizationEN.EDIT_NODE}
            </label>
            <Icon style="font-size: .9rem">edit</Icon>
        </button>
    </div>
</div>

<style>
    label {
        writing-mode: vertical-lr;
        rotate: 180deg;
    }

    .wrapper {
        background: var(--pj-background-tertiary);
        border-left: var(--pj-border-primary) 1px solid;

        width: fit-content;
        position: absolute;
        right: 0;
        top: 28px;
        display: flex;
        height: calc(100% - 28px);
    }

    .buttons {
        display: flex;
        flex-direction: column;
        align-content: center;
        padding: 2px;
        gap: 4px;
        width: 25px;
        height: 100%;
    }

    .button {

        width: 20px;
        height: fit-content;
        font-size: .7rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 4px;

    }
</style>