<script>
    import DATA_TYPES from "../../../../../../../public/engine/static/DATA_TYPES";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import Range from "../../../../../shared/components/range/Range.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";

    export let attribute
    export let node
    export let handleChange
    export let returnDefault
    const getNewVec = (value, v, index, type) => {
        switch (type) {
            case  DATA_TYPES.VEC2:
                return [index === 0 ? v : value[0], index === 1 ? v : value[1]]
            case  DATA_TYPES.VEC3:
                return [
                    index === 0 ? v : value[0],
                    index === 1 ? v : value[1],
                    index === 2 ? v : value[2]
                ]
            case  DATA_TYPES.VEC4:
                return [
                    index === 0 ? v : value[0],
                    index === 1 ? v : value[1],
                    index === 2 ? v : value[2],
                    index === 3 ? v : value[3]
                ]
            default:
                return value
        }
    }

    $: value = node[attribute.key]
    const label = attribute.label, type = attribute.type
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

    <div class="vecWrapper">
        <Range
                disabled={attribute.disabled}
                maxValue={attribute.max}
                minValue={attribute.min}
                value={value[0]}
                label={label}
                onFinish={v => handleChange(getNewVec(value, v, 0, type), attribute)}
        />
        <Range
                disabled={attribute.disabled}
                maxValue={attribute.max}
                minValue={attribute.min}
                value={value[1]}
                label={label}
                onFinish={v => handleChange(getNewVec(value, v, 1, type), attribute)}
        />
        {#if type === DATA_TYPES.VEC4 || type === DATA_TYPES.VEC3 }
            <Range
                    disabled={attribute.disabled}
                    maxValue={attribute.max}
                    minValue={attribute.min}
                    value={value[2]}
                    label={label}
                    onFinish={v => handleChange(getNewVec(value, v, 2, type), attribute)}
            />
        {/if}
        {#if type === DATA_TYPES.VEC4}
            <Range
                    disabled={attribute.disabled}
                    maxValue={attribute.max}
                    minValue={attribute.min}
                    onFinish={v => handleChange([value[0], value[1], value[2], v], attribute)}
                    value={value ? value[3] : undefined}
                    label={label}
            />
        {/if}
    </div>
    )
{:else if type === DATA_TYPES.COLOR}
    <ColorPicker
            disabled={attribute.disabled}
            label={label}
            submit={({r, g, b}) => handleChange([r/255,g/255,b/255], attribute)}
            value={Array.isArray(value) ? value.map(v => v * 255) : value}
            height="25px"
    />

{:else if type === DATA_TYPES.TEXTURE}

    <Selector
            disabled={attribute.disabled}
            type={"image"}
            size={"small"}
            handleChange={(src) => handleChange(src, attribute)}
            selected={value}
            autoClose={true}
    />

{:else if type === DATA_TYPES.OPTIONS && Array.isArray(attribute.options)}

    <Dropdown>
        <button slot="button" class="dropdown">
            {label}
        </button>
        {#each attribute.options as o, i}
            <button on:click={() => handleChange(o.data, attribute)}>
                {#if o.data === value}
                    <Icon>check</Icon>
                {/if}
                {o.label}
            </button>
        {/each}
    </Dropdown>
{:else if type === DATA_TYPES.CHECKBOX}
    <Checkbox
            checked={value}
            handleCheck={() => {
                    handleChange(!value, attribute)
                }}
            disabled={attribute.disabled}
            label={label}
    />
{:else}
    {#if returnDefault}
        {label}
    {/if}
{/if}

<style>
    .vecWrapper {
        display: flex;
        gap: 4px;
    }


    .dropdown {
        border: none;
        height: 30px;
        padding: 2px 8px !important;
        font-size: .7rem;

        white-space: nowrap;
    }
</style>