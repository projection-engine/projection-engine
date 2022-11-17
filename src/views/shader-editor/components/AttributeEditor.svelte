<script>
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
    import Attribute from "./node/Attribute.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import SEContextController from "../SEContextController";

    export let node

</script>

{#if node}
    <div class="content-wrapper">
        <div class="wrapper">
            <Input
                    searchString={node.name}
                    width={"100%"}
                    height="30px"
                    setSearchString={ev => SEContextController.updateNode("name", ev, node)}
                    placeholder={Localization.NAME}
            />
            {#each node.inputs as attr, i}
                {#if !attr.accept}
                    <Attribute
                            attribute={attr}
                            node={node}
                            handleChange={(value, attribute) => SEContextController.submitNodeVariable(value, attribute, node)}
                            returnDefault={false}
                    />
                {/if}
            {/each}
            {#if node.isComment}
                <div>{Localization.COLOR}</div>
                <ColorPicker
                        submit={({r,g,b}) => SEContextController.updateNode("color", [r, g, b, .5], node)}
                        value={node.color}
                        size={"small"}
                />
            {/if}
        </div>
    </div>
{/if}

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