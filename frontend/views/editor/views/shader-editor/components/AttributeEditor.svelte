<script lang="ts">
    import Attribute from "./Attribute.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import ColorPicker from "../../../../../components/color-picker/ColorPicker.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import ShaderNode from "../templates/ShaderNode";
    import Comment from "../templates/Comment";
    import MutableObject from "../../../../../../engine-core/MutableObject";

    export let node: ShaderNode | Comment
    export let updateCanvas: Function


    function handleNodeChange(value: any, attr: MutableObject) {
        node[attr.key] = value
        const input = (node as ShaderNode).inputs.find(i => i.key === attr.key)
        input.onChange?.(value)
        updateCanvas()
    }
</script>


<div class="content-wrapper">
    <div class="wrapper">
        <fieldset>
            <legend>{LOCALIZATION_EN.NAME}</legend>
            <Input
                    inputValue={node.name}
                    width={"100%"}
                    height="30px"
                    onChange={ev => {
                        node.name = ev
                        updateCanvas()
                    }}
                    placeholder={LOCALIZATION_EN.NAME}
            />
        </fieldset>
        {#if node instanceof Comment}
            <fieldset>
                <legend>{LOCALIZATION_EN.COLOR}</legend>
                <ColorPicker
                        submit={(_, arr) => {
                            node.color = arr
                            updateCanvas()
                        }}
                        value={node.color}
                />
            </fieldset>
        {:else}
            {#each node.inputs as attr, i}

                {#if attr.type}
                        {#key attr.key}
                            <fieldset>
                                <legend>{attr.label}</legend>
                                <Attribute
                                        attribute={attr}
                                        node={node}
                                        onChange={handleNodeChange}
                                        returnDefault={false}
                                />
                            </fieldset>
                        {/key}
                {/if}

            {/each}
        {/if}

    </div>
</div>

<style>
    .content-wrapper {
        background: var(--pj-background-tertiary);
        overflow-y: auto;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        padding: 4px;
        max-height: 100%;
        overflow-x: hidden;
        width: 250px;
    }

    .wrapper {
        overflow-x: hidden;
        color: var(--pj-color-secondary);
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: .75rem;
    }

    .wrapper > * {
        border-radius: 3px;
        padding: 4px;
        width: 100%;
        background: var(--pj-background-primary);
    }

</style>