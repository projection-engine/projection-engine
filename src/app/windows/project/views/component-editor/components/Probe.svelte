<script>
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Range from "../../../../../components/range/Range.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";

    export let selected
    export let submit
    const getNewState = () => {
        return {
            resolution: selected.resolution,
            mipmaps: selected.mipmaps,
            radius: selected.radius,

            xR: selected.multiplier[0],
            yR: selected.multiplier[1],
            zR: selected.multiplier[2],
            specularProbe: selected.specularProbe
        }
    }
    const [state,,dispatchBlock] = useDirectState(getNewState())
    useEffect(() => {
        dispatchBlock(getNewState())
    }, [selected])
    const checkIcon = <Icon styles={{fontSize: "1.2rem"}}>check</Icon>
</script>
<Checkbox
    noMargin={true}
    checked={state.specularProbe}
    label={"Specular probe"}
    height={"35px"}
    width={"100%"}
    handleCheck={() => {
        const v = !state.specularProbe
        state.specularProbe = v
        selected.specularProbe = v
    }}/>
<Accordion title={"Resolution"}>
    <Dropdown class={dropdown} disabled={!state.specularProbe} styles={{background: "var(--pj-border-primary)"}}>
        {state.resolution}p
        <DropdownOptions>
            <DropdownOption option={{
                label: "128p",
                icon: state.resolution === 128 ?
                    checkIcon : undefined,
                onClick: () => {
                    state.resolution = 128
                    selected.resolution = 128
                }
            }}/>
            <DropdownOption option={{
                label: "512p",
                icon: state.resolution === 512 ?
                    checkIcon : undefined,
                onClick: () => {
                    state.resolution = 512
                    selected.resolution = 512
                }
            }}/>
            <DropdownOption option={{
                label: "1024p",
                icon: state.resolution === 1024 ?
                    checkIcon : undefined,
                onClick: () => {
                    state.resolution = 1024
                    selected.resolution = 1024
                }
            }}/>
            <DropdownOption option={{
                label: "2048p",
                icon: state.resolution === 2048 ?
                    checkIcon : undefined,
                onClick: () => {
                    state.resolution = 2048
                    selected.resolution = 2048
                }
            }}/>
        </DropdownOptions>
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



