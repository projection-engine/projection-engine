<script lang="ts">

    import Nodes from "./Nodes.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import ResizableBar from "../../../../../components/resizable/ResizableBar.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import type Canvas from "../libs/Canvas";
    import ShaderNode from "../templates/ShaderNode";
    import Comment from "../templates/Comment";
    import {onDestroy, onMount} from "svelte";
    import Material from "../templates/nodes/Material";

    export let canvasAPI: Canvas
    let tab = 0
    let mainNode: ShaderNode | Comment | undefined = undefined

    $: {
        if (!mainNode)
            mainNode = canvasAPI.nodes.find(n => n instanceof Material)
    }
    onMount(() => {
        mainNode = canvasAPI.nodes.find(n => n instanceof Material)
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
    {:else}
        <AttributeEditor node={mainNode} updateCanvas={() => canvasAPI.clear()}/>
    {/if}
    <div class="buttons">
        <button class="button" data-highlight={tab === 0 ? "-" : ""} on:click={() => tab = 0}>
            <label>
                {LOCALIZATION_EN.ADD}
            </label>
            <Icon style="font-size: .9rem">add</Icon>
        </button>
        <button disabled={!mainNode} class="button" data-highlight={tab === 1 ? "-" : ""} on:click={() => tab = 1}>
            <label>
            {LOCALIZATION_EN.EDIT_NODE}
            </label>
            <Icon style="font-size: .9rem">edit</Icon>
        </button>
    </div>
</div>

<style>
    label{
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