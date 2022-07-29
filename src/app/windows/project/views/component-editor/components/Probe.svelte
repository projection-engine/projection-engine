<script>
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Range from "../../../../../components/range/Range.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";

    export let selected
    export let submit

    let state
    $: {
        state = {
            resolution: selected.resolution,
            mipmaps: selected.mipmaps,
            radius: selected.radius,

            xR: selected.multiplier[0],
            yR: selected.multiplier[1],
            zR: selected.multiplier[2],
            specularProbe: selected.specularProbe
        }
    }
</script>
<Checkbox
        checked={state.specularProbe}
        label={"Specular probe"}
        handleCheck={() => {
            const v = !state.specularProbe
            state.specularProbe = v
            selected.specularProbe = v
        }}
/>
<Accordion title={"Resolution"}>
    <Dropdown class="dropdown" disabled={!state.specularProbe} styles={{background: "var(--pj-border-primary)"}}>
        {state.resolution}p
        <button
                on:click={() => {
                    state.resolution = 128
                    selected.resolution = 128
                }}
        >
            {#if state.resolution === 128}
                <Icon>check</Icon>
            {/if}
            128p
        </button>

        <button
                on:click={() => {
                    state.resolution = 512
                    selected.resolution = 512
                }}
        >
            {#if state.resolution === 512}
                <Icon>check</Icon>
            {/if}
            512p
        </button>
        <button
                on:click={() => {
                    state.resolution = 1024
                    selected.resolution = 1024
                }}
        >
            {#if state.resolution === 1024}
                <Icon>check</Icon>
            {/if}
            1024p
        </button>

        <button
                on:click={() => {
                    state.resolution = 2048
                    selected.resolution = 2048
                }}
        >
            {#if state.resolution === 2048}
                <Icon>check</Icon>
            {/if}
            2048p
        </button>

    </Dropdown>
</Accordion>

<Range
        label={"LOD"}
        integer={true}
        disabled={!state.specularProbe}
        incrementPercentage={1}
        minValue={1}
        maxValue={10}
        onFinish={(v) => {
        submit(v, "mipmaps")
        state.mipmaps = v
    }}
        value={state.mipmaps}
/>

<Accordion title={"Multiplier"}>
    <Range
            label={"R"}
            variant={"embedded"}
            minValue={0}
            onFinish={(v) => {
            selected.multiplier[0] = v
            state.xR = v
        }}
            handleChange={v => selected.multiplier[0] = v}
            value={state.xR}
    />
    <Range
            label={"G"}
            variant={"embedded"}
            minValue={0}
            onFinish={(v) => {
            selected.multiplier[1] = v
            state.yR = v
        }}
            handleChange={v => selected.multiplier[1] = v}
            value={state.yR}
    />
    <Range
            label={"B"}
            variant={"embedded"}
            minValue={0}
            onFinish={(v) => {
            selected.multiplier[2] = v
            state.zR = v
        }}
            handleChange={v => selected.multiplier[2] = v}
            value={state.zR}
    />
</Accordion>



