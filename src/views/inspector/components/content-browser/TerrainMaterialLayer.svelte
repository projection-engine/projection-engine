<script>
    import Selector from "../../../../components/selector/Selector.svelte";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Localization from "../../../../libs/libs/Localization";
    import Accordion from "../../../../components/accordion/Accordion.svelte";
    import TERRAIN_MATERIAL_UNIFORMS from "../../../../../public/engine/static/templates/TERRAIN_MATERIAL_UNIFORMS";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";

    export let layer
    export let update
    export let removeLayer
    export let uniforms

    $: {
        const size = layer * 3 + TERRAIN_MATERIAL_UNIFORMS.length
        data = uniforms.slice(size, size + 3)
    }
    $: scales = uniforms[0].data

    const translate = key => Localization.PROJECT.INSPECTOR[key]
</script>

<Accordion>
    <svelte:fragment slot="header">
        <div class="title">
            <div>{translate("LAYER") + " " + layer}</div>
            <button on:click={removeLayer}>
                <Icon styles="font-size: .9rem">delete_forever</Icon>
                <ToolTip content={translate("REMOVE_LAYER")}/>
            </button>
        </div>
    </svelte:fragment>

    <fieldset>
        <legend>{translate("ALBEDO")}</legend>
        <Selector
                selected={data[0].data}
                type="image"
                handleChange={v => update("albedo"+layer, v.registryID)}
        />
        <Range
                value={scales[layer]}
                label={translate("SCALE")}
                minValue={0}
                onFinish={v => update("multipliers", v, layer)}
        />
    </fieldset>

    <fieldset>
        <legend>{translate("NORMAL")}</legend>
        <Selector
                selected={data[1].data}
                type="image"
                handleChange={v => update("normal"+layer, v.registryID)}
        />
        <Range
                value={scales[layer+ 1]}
                label={translate("SCALE")}
                minValue={0}
                onFinish={v => update("multipliers", v, layer+1)}
        />
    </fieldset>

    <fieldset>
        <legend>{translate("ROUGHNESS")}</legend>
        <Selector
                selected={data[2].data}
                type="image"
                handleChange={v => update("roughness"+layer, v.registryID)}
        />
        <Range
                value={scales[layer+ 2] }
                label={translate("SCALE")}
                minValue={0}
                onFinish={v => update("multipliers", v, layer+2)}
        />
    </fieldset>
</Accordion>

<style>
    button{
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
</style>