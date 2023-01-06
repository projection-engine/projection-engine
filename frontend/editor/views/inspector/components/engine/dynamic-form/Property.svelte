<script>
    import Checkbox from "../../../../../../components/checkbox/Checkbox.svelte";
    import Component from "../../../../../../../engine-core/templates/components/Component";
    import Selector from "../../../../../../components/selector/Selector.svelte";
    import EngineStore from "../../../../../stores/EngineStore";
    import LOCALIZATION_EN from "../../../../../static/LOCALIZATION_EN";
    import ColorPicker from "../../../../../../components/color-picker/ColorPicker.svelte";
    import Input from "../../../../../../components/input/Input.svelte";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import Range from "../../../../../../components/range/Range.svelte";

    export let component = undefined
    export let submit = undefined
    export let attribute = undefined

    $: label = LOCALIZATION_EN[attribute.label] ? LOCALIZATION_EN[attribute.label] : attribute.label
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
    $: dropdownLabel  = attribute.type === Component.propTypes.OPTIONS ? attribute.options.find(o => o.value === value) : undefined

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

                    label={LOCALIZATION_EN[partial] || partial}
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
                {LOCALIZATION_EN.UNDO}
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
                {LOCALIZATION_EN[dropdownLabel?.label] || dropdownLabel?.label}
            </button>
            {#each attribute.options as option}
                <button on:click={() =>  submit(attribute.key, option.value, true)}>
                    {LOCALIZATION_EN[option.label] || option.label}
                </button>
            {/each}
        </Dropdown>
    {:else if attribute.type === Component.propTypes.STRING}
        <Input
                inputValue={value}
                onChange={v => submit(attribute.key, v, true)}
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