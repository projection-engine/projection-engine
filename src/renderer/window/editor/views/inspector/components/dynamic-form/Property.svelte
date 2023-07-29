<script>
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte"
    import Component from "../../../../../../engine/core/instances/components/Component"
    import Selector from "../../../../components/selector/Selector.svelte"

    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte"
    import Input from "../../../../../shared/components/input/Input.svelte"
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte"
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import Range from "../../../../../shared/components/range/Range.svelte"
    import FileSystemAPI from "../../../../../../engine/core/lib/utils/FileSystemAPI"
    import LocalizationEN from "../../../../../../../shared/enums/LocalizationEN"
    import EmptyIcon from "../../../../../shared/components/icon/EmptyIcon.svelte";

    export let component = undefined
    export let submit = undefined
    export let attribute = undefined

    $: label = LocalizationEN[attribute.label] ? LocalizationEN[attribute.label] : attribute.label
    $: value = component[attribute.key]
    $: isDisabled = typeof attribute.disabledIf === "function" ? attribute.disabledIf(component) : component[attribute.disabledIf]

    let firstSubmit = false
    const setImage = async (data) => {
    	if (data) {
    		const res = await FileSystemAPI.loadTexture(data.registryID)
    		if (res)
    			submit(attribute.key, data.registryID, true)
    	} else
    		submit(attribute.key, undefined, true)
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
    $: dropdownLabel = attribute.type === Component.propTypes.OPTIONS ? attribute.options.find(o => o.value === value) : undefined

</script>


<div data-svelteform="-">
    {#if attribute.type === Component.propTypes.NUMBER}
        <Range
                handleChange={v => {
                    if(!firstSubmit){
                        firstSubmit = true
                        submit(attribute.key, v)
                    }
                    component[attribute.key] = v
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

                    label={LocalizationEN[partial] || partial}
                    value={value[index]}
            />
        {/each}
        {#if attribute.defaultValue}
            <button data-sveltebuttondefault="-"
                    class="reset-button"
                    on:click={() => {
                         for(let i =0; i < attribute.defaultValue.length; i++)
                             value[i] = attribute.defaultValue[i]
                         submit(attribute.key, value, true)
                    }}>
                <Icon styles="font-size: .9rem">undo</Icon>
                {LocalizationEN.UNDO}
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
        <Dropdown disabled={isDisabled} width="100%"
                  buttonStyles="border-radius: 3px; border: var(--pj-border-primary) 1px solid">
            <button data-sveltebuttondefault="-" slot="button" disabled={isDisabled} class="dropdown">
                {LocalizationEN[dropdownLabel?.label] || dropdownLabel?.label}
            </button>
            {#each attribute.options as option}
                <button data-sveltebuttondefault="-" on:click={() =>  submit(attribute.key, option.value, true)}>
                    {#if dropdownLabel?.value === option.value}
                        <Icon>check</Icon>
                    {:else}
                        <EmptyIcon/>
                    {/if}
                    {LocalizationEN[option.label] || option.label}
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
        text-align: left;
        height: 22px;
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
