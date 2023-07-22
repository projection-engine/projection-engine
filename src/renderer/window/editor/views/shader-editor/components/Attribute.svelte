<script>
    import DATA_TYPES from "../../../../../engine/core/static/DATA_TYPES"
    import Checkbox from "../../../../shared/components/checkbox/Checkbox.svelte"
    import Selector from "../../../components/selector/Selector.svelte"
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles"
    import Range from "../../../../shared/components/range/Range.svelte"
    import ColorPicker from "../../../../shared/components/color-picker/ColorPicker.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ShaderEditorUtil from "../../../util/ShaderEditorUtil"

    export let attribute
    export let node
    export let onChange
    export let returnDefault

    let value = node[attribute.key]
    function handleChange(newValue){
    	value = newValue
    	onChange(newValue, attribute)
    }


    const label = attribute.label, type = attribute.type
    $: possibleSelection= attribute.options ? attribute.options.find(v => v.data === value) : undefined

</script>

{#if type === DATA_TYPES.INT || type === DATA_TYPES.FLOAT}
    <Range
            precision={3}
            variant={"embedded"} minLabelWidth={"50%"}
            integer={type === DATA_TYPES.INT}
            maxValue={attribute.max}
            incrementPercentage={.001}
            minValue={attribute.min}
            value={value}
            onFinish={v => handleChange(type === DATA_TYPES.FLOAT ? v : parseInt(v), attribute)}
            label={label}
            disabled={attribute.disabled}
    />
{:else if type === DATA_TYPES.VEC4 || type === DATA_TYPES.VEC3 || type === DATA_TYPES.VEC2}
    <div data-svelteinline="-">
        <Range
                disabled={attribute.disabled}
                maxValue={attribute.max}
                minValue={attribute.min}
                value={value[0]}
                label={label}
                onFinish={v => handleChange(ShaderEditorUtil.getNewVector(value, v, 0, type))}
        />
        <Range
                disabled={attribute.disabled}
                maxValue={attribute.max}
                minValue={attribute.min}
                value={value[1]}
                label={label}
                onFinish={v => handleChange(ShaderEditorUtil.getNewVector(value, v, 1, type))}
        />
        {#if type === DATA_TYPES.VEC4 || type === DATA_TYPES.VEC3 }
            <Range
                    disabled={attribute.disabled}
                    maxValue={attribute.max}
                    minValue={attribute.min}
                    value={value[2]}
                    label={label}
                    onFinish={v => handleChange(ShaderEditorUtil.getNewVector(value, v, 2, type))}
            />
        {/if}
        {#if type === DATA_TYPES.VEC4}
            <Range
                    disabled={attribute.disabled}
                    maxValue={attribute.max}
                    minValue={attribute.min}
                    onFinish={v => handleChange([value[0], value[1], value[2], v])}
                    value={value ? value[3] : undefined}
                    label={label}
            />
        {/if}
    </div>
{:else if type === DATA_TYPES.COLOR}
    <ColorPicker
            disabled={attribute.disabled}
            label={label}
            submit={({r, g, b}) => handleChange([r/255,g/255,b/255])}
            value={Array.isArray(value) ? value.map(v => v * 255) : value}
            height="25px"
    />

{:else if type === DATA_TYPES.TEXTURE}

    <Selector
            disabled={attribute.disabled}
            type={"image"}
            handleChange={handleChange}
            selected={value}
    />

{:else if type === DATA_TYPES.OPTIONS && Array.isArray(attribute.options)}

    <Dropdown buttonStyles={getDropdownHeaderStyles() + "width: 100%;"}>
        <button data-sveltebuttondefault="-"  slot="button" data-svelteview-header-dropdown="-">
            {possibleSelection ? possibleSelection.label : label}
        </button>
        {#each attribute.options as o, i}
            <button data-sveltebuttondefault="-"  on:click={() => handleChange(o.data)} data-svelteinline="-">
                {#if o.data === value}
                    <Icon>check</Icon>
                    {:else}
                    <div style="width: 1.2rem"></div>
                {/if}
                {o.label}
            </button>
        {/each}
    </Dropdown>
{:else if type === DATA_TYPES.CHECKBOX}
    <Checkbox
            checked={value}
            handleCheck={() => handleChange(!value)}
            disabled={attribute.disabled}
            label={label}
    />
{:else}
    {#if returnDefault}
        {label}
    {/if}
{/if}

