<script>

    import Range from "../../../../../components/range/Range.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import PostProcessing from "./PostProcessing.svelte";
    import ComponentAttribute from "./ComponentAttribute.svelte";
    import ColorPicker from "../../../../../components/color-picker/ColorPicker.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import DataStoreController from "../../../stores/DataStoreController";


    const toDeg = 180 / Math.PI, toRad = Math.PI / 180

    export let isNative
    export let selected
    export let submit
    export let translate
    export let attribute
    $: label = translate(label) ? translate(label) : attribute.label
    $: value = selected[attribute.key]
    $: isDisabled = selected[attribute.disabledIf]
</script>


{#if attribute.type === "number"}
    <Range
            handleChange={v => selected[attribute.key] = v}
            minValue={attribute.min}
            maxValue={attribute.max}
            label={label}
            value={value}
            isAngle={attribute.isAngle}
            disabled={isDisabled}
    />
{:else if attribute.type === "array"}
    {#each attribute.labels as partial, index}
        <Range
                disabled={isDisabled}
                isAngle={attribute.isAngle}
                handleChange={v => {
                    const newData = [...value]
                    newData[index] = v
                    selected[attribute.key] = newData
                }}
                minValue={attribute.min}
                maxValue={attribute.max}
                label={partial}
                variant="embedded"
                value={value[index]}
        />
    {/each}
{:else if attribute.type === "boolean"}
    <Checkbox
            handleCheck={() => selected[attribute.key] = !value}
            label={label}
            checked={value}
            disabled={isDisabled}
    />
{:else if attribute.type === "options"}
    <Dropdown disabled={isDisabled} width="100%">
        <button slot="button" class="dropdown">
            {label}
        </button>
        {#each attribute.options as option}
            <button on:click={() => selected[attribute.key] = option.value}>
                {#if translate(option.label)}
                    {translate(option.label)}
                {:else}
                    {option.label}
                {/if}
            </button>
        {/each}
    </Dropdown>
{:else if attribute.type === "string"}
    <Input
            searchString={value}
            setSearchString={v => selected[attribute.key] = v}
            placeholder={label}
            disabled={isDisabled}
    />
{:else if attribute.type === "color"}
    <ColorPicker
            disabled={isDisabled}
            submit={({r,g,b}) => selected[attribute.key] = [r, g, b]}
            placeholder={label}
            value={value}
            size={"small"}
    />
{/if}


<style>
    .dropdown {
        height: 25px;
        width: 100%;
        border: none;
    }
</style>