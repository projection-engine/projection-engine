<script>
    import DATA_TYPES from "../../../engine/core/static/DATA_TYPES"
    import Selector from "./selector/Selector.svelte"
    import ColorPicker from "../../shared/components/color-picker/ColorPicker.svelte"
    import Range from "../../shared/components/range/Range.svelte"
    import ShaderEditorUtil from "../util/ShaderEditorUtil"

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
                    handleChange={v => update(i, v?.registryID)}
            />
        {/if}
        {#if uniform.type === DATA_TYPES.FLOAT}
            <Range
                    value={uniform.data}
                    onFinish={v => update(i, v)}
                    handleChange={v => update(i, v)}
            />
        {/if}
        {#if uniform.type === DATA_TYPES.VEC3 && uniform.isColor }
            <ColorPicker
                    value={uniform.data.map(e => e * 255)}
                    label={uniform.label}
                    submit={({r,g,b}) => update(i, [r/255,g/255,b/255] )}
            />
        {/if}
        {#if uniform.type === DATA_TYPES.VEC4 || uniform.type === DATA_TYPES.VEC3 || uniform.type === DATA_TYPES.VEC2}
            <div data-svelteinline="-">
                <Range
                        value={uniform.data[0]}
                        label={"X"}
                        onFinish={v => update(i, ShaderEditorUtil.getNewVector(uniform.data, v, 0, uniform.type))}
                        handleChange={v => update(i, ShaderEditorUtil.getNewVector(uniform.data, v, 0, uniform.type))}
                />
                <Range

                        value={uniform.data[1]}
                        label={"Y"}
                        onFinish={v => update(i, ShaderEditorUtil.getNewVector(uniform.data, v, 1, uniform.type))}
                        handleChange={v => update(i, ShaderEditorUtil.getNewVector(uniform.data, v, 1, uniform.type))}
                />
                {#if uniform.type === DATA_TYPES.VEC4 || uniform.type === DATA_TYPES.VEC3 }
                    <Range

                            value={uniform.data[2]}
                            label={"Z"}
                            handleChange= {v => update(i, ShaderEditorUtil.getNewVector(uniform.data, v, 2, uniform.type))}
                            onFinish={v => update(i, ShaderEditorUtil.getNewVector(uniform.data, v, 2, uniform.type))}
                    />
                {/if}
                {#if uniform.type === DATA_TYPES.VEC4}
                    <Range

                            onFinish={v => update(i, ShaderEditorUtil.getNewVector(uniform.data, v, 3, uniform.type))}
                            handleChange={v => update(i, ShaderEditorUtil.getNewVector(uniform.data, v, 3, uniform.type))}
                            value={uniform.data[3]}
                            label={"W"}
                    />
                {/if}
            </div>
        {/if}
    </fieldset>
{/each}
