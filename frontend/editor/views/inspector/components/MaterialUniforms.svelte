<script>
    import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES";
    import Selector from "../../../components/selector/Selector.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";

    export let uniforms
    export let update
</script>

{#each uniforms as uniform, i}
    <fieldset>
        <legend>{uniform.label}</legend>
        {#if uniform.type === DATA_TYPES.TEXTURE}
            <Selector
                    type="image"
                    selected={uniform.data}
                    handleChange={v => update(i, v.registryID)}
            />
        {/if}
        {#if uniform.type === DATA_TYPES.FLOAT}

            <Range
                    value={uniform.data}
                    onFinish={v => update(i, v)}
            />
        {/if}
        {#if uniform.type === DATA_TYPES.VEC3 && uniform.isColor }
            <ColorPicker
                    value={uniform.data.map(e => e * 255)}
                    label={uniform.label}
                    submit={({r,g,b}) => update(i, [r/255,g/255,b/255], 750)}
            />
        {/if}
    </fieldset>
{/each}