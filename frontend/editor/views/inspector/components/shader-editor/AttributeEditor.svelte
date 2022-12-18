<script>
    import Attribute from "../../../shader-editor/components/node/Attribute.svelte";
    import SEContextController from "../../../shader-editor/libs/SEContextController";
    import LOCALIZATION_EN from "../../../../templates/LOCALIZATION_EN";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";
    import Input from "../../../../../shared/components/input/Input.svelte";

    export let node
    export let internalID

</script>


<div class="content-wrapper">
    <div class="wrapper">
        <fieldset>
            <legend>{LOCALIZATION_EN.NAME}</legend>
            <Input
                    searchString={node.name}
                    width={"100%"}
                    height="30px"
                    setSearchString={ev => {
                        const ref = document.getElementById(node.id + "-inspector-label-" + internalID)
                        ref.textContent = ev
                        SEContextController.updateNode("name", ev, node)
                    }}
                    placeholder={LOCALIZATION_EN.NAME}
            />
        </fieldset>
        {#if node.isComment}
            <fieldset>
                <legend>{LOCALIZATION_EN.COLOR}</legend>
                <ColorPicker
                        submit={({r,g,b}) => SEContextController.updateNode("color", [r, g, b, .5], node)}
                        value={node.color}
                        size={"small"}
                />
            </fieldset>
        {/if}
        {#each node.inputs as attr, i}
            {#if !attr.accept}
                <fieldset>
                    <legend>{attr.label}</legend>
                    <Attribute
                            attribute={attr}
                            node={node}
                            handleChange={(value, attribute) => SEContextController.submitNodeVariable(value, attribute, node)}
                            returnDefault={false}
                    />
                </fieldset>
            {/if}
        {/each}

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