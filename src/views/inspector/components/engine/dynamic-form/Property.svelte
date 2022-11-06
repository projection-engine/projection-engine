<script>
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import Component from "../../../../../../public/engine/templates/components/Component";
    import Selector from "../../../../../components/selector/Selector.svelte";
    import EngineStore from "../../../../../stores/EngineStore";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Localization from "../../../../../templates/LOCALIZATION_EN";

    export let component = undefined
    export let submit = undefined
    export let attribute = undefined

    $: label = Localization[attribute.label] ? Localization[attribute.label] : attribute.label
    $: value = component[attribute.key]
    $: isDisabled = typeof attribute.disabledIf === "function" ? attribute.disabledIf(component) : component[attribute.disabledIf]

    let firstSubmit = false
    const setImage = async ({registryID}) => {
        const res = await EngineStore.loadTextureFromImageID(registryID)
        if (res)
            submit(attribute.key, registryID, true)
    }
    let originalValue

    $: {
        if (attribute.type === Component.propTypes.ARRAY && value != null && !originalValue) {
            const temp = []
            for (let i = 0; i < value.length; i++) {
                temp[i] = value[i]
            }
            originalValue = temp
        }
    }


</script>


<div data-form="-">
    {#if attribute.type === Component.propTypes.NUMBER}
        <Range
                handleChange={v => {
                    if(!firstSubmit){
                        firstSubmit = true
                        submit(attribute.key, v)
                    }
                }}
                variant="embedded"
                onFinish={v => submit(attribute.key, v, true)}
                minValue={attribute.min}
                maxValue={attribute.max}
                integer={attribute.increment === 1}
                incrementPercentage={attribute.increment}
                label={label}
                value={value}
                isAngle={attribute.isAngle}
                disabled={isDisabled}
                precision={attribute.precision}
        />
    {:else if attribute.type === Component.propTypes.ARRAY}

        {#each attribute.labels as partial, index}
            <Range
                    noOriginal={true}
                    disabled={isDisabled}
                    isAngle={attribute.isAngle}
                    handleChange={v => {
                        value[index] = v

                        if(!firstSubmit){
                            firstSubmit = true
                            submit(attribute.key, value)
                            return
                        }
                        submit(attribute.key, value)
                    }}
                    onFinish={v => {
                        value[index] = v
                        submit(attribute.key, value, true)
                    }}
                    precision={attribute.precision}
                    minValue={attribute.min}
                    maxValue={attribute.max}

                    label={partial}
                    variant="embedded"
                    value={value[index]}
            />
        {/each}
        {#if attribute.defaultValue}
            <button
                    class="reset-button"
                    on:click={() => {
                         for(let i =0; i < attribute.defaultValue.length; i++)
                             value[i] = attribute.defaultValue[i]
                         submit(attribute.key, value, true)
                    }}>
                <Icon styles="font-size: .9rem">undo</Icon>
                {Localization.UNDO}
            </button>
        {/if}
    {:else if attribute.type === Component.propTypes.BOOLEAN}
        <Checkbox
                handleCheck={() => submit(attribute.key, !value, true)}
                label={label}
                checked={value}
                disabled={isDisabled}
        />
    {:else if attribute.type === Component.propTypes.OPTIONS}
        <Dropdown disabled={isDisabled} width="100%">
            <button slot="button" disabled={isDisabled} class="dropdown">
                {label}
            </button>
            {#each attribute.options as option}
                <button on:click={() =>  submit(attribute.key, option.value, true)}>
                    {Localization[option.label] || option.label}
                </button>
            {/each}
        </Dropdown>
    {:else if attribute.type === Component.propTypes.STRING}
        <Input
                searchString={value}
                setSearchString={v => submit(attribute.key, v, true)}
                onEnter={v => submit(attribute.key, v, true)}
                onBlur={(_,v) => submit(attribute.key, v, true)}
                placeholder={label}
                disabled={isDisabled}
        />
    {:else if attribute.type === Component.propTypes.COLOR}
        <ColorPicker
                disabled={isDisabled}
                submit={({r,g,b}) => submit(attribute.key, [r, g, b], true)}
                label={label}
                value={value}
                size={"small"}
        />
    {:else if attribute.type === Component.propTypes.IMAGE}
        <Selector
                handleChange={setImage}
                type="image"

                selected={value}
        />
    {:else if attribute.type === Component.propTypes.MATERIAL}
        <Selector
                selected={value}
                type="material"
                terrainMaterials={attribute.terrainMaterials}
                handleChange={src => {
                    console.trace(src)
                    submit(attribute.key, src?.registryID, true)
                }}

        />
    {:else if attribute.type === Component.propTypes.TERRAIN}
        <Selector
                selected={value}
                type="terrain"
                handleChange={(src) => submit(attribute.key, src?.registryID, true)}
        />
    {:else if attribute.type === Component.propTypes.MESH}
        <Selector
                handleChange={src => submit(attribute.key, src?.registryID, true)}
                type="mesh"
                selected={value}
        />
    {/if}
</div>

<style>

    .dropdown {
        height: 25px;
        width: 100%;
        border: none;
    }

    .reset-button {
        border: none;

        min-height: 17px;

        max-height: 17px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;

        overflow: hidden;
    }


</style>