<script>

    import Range from "../../../../../components/range/Range.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import PostProcessing from "./PostProcessing.svelte";
    import ComponentAttribute from "./ComponentAttribute.svelte";
    import ColorPicker from "../../../../../components/color-picker/ColorPicker.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";


    const toDeg = 180 / Math.PI, toRad = Math.PI / 180

    export let selected
    export let submit
    export let translate
    export let attribute
</script>


{#if attribute.type === "number"}
    <Range
            onFinish={() => null}
            minValue={attribute.min}
            maxValue={attribute.max}
            label={attribute.label}
            value={selected[attribute.key]}
    />
{:else if attribute.type === "boolean"}
    <Checkbox
            label={attribute.label}
            value={selected[attribute.key]}
    />
{:else if attribute.type === "options"}
    <Dropdown>
        <button slot="button">
            {attribute.label}
        </button>
        {#each attribute.options as option}
            <button on:click={() => null}>
                {translate(option.label)}
            </button>
        {/each}
    </Dropdown>
{:else if attribute.type === "string"}
    <Input searchString={selected[attribute.key]} setSearchString={() => null}
           placeholder={translate(attribute.label)}/>
{:else if attribute.type === "color"}
    <ColorPicker
            submit={({r,g,b}) => null}
            placeholder={translate(attribute.label)}
            value={selected[attribute.key]}
            size={"small"}
    />
{/if}