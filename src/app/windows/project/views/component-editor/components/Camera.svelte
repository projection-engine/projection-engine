<script>
    import PostProcessing from "./PostProcessing"
    import EnglishLocalization from "../../../../../static/EnglishLocalization";
    import Range from "../../../../../components/range/Range.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";

    const toDeg = 180 / Math.PI, toRad = Math.PI / 180
    export let selected
    export let submit
    let state = {}

    const translate = key => EnglishLocalization.PROJECT.COMPONENT_EDITOR[key]
    $: {
        if (state.id !== selected.id)
            state = {}
        const newState = {...selected}
        newState.fov = Math.round(selected.fov * toDeg)
        state = newState
    }


</script>
<Range
        label={translate("FOV")}
        disabled={state.ortho}
        value={state.fov} minValue={35}
        maxValue={175}
        precision={1}
        incrementPercentage={.1}
        onFinish={(v) => {
        submit("fov", v * toRad)
        state.fov = v
    }}
/>
<Accordion title={translate("ORTHO_PROJECTION")}>
    <Checkbox
            noMargin={true}
            checked={state.ortho}
            handleCheck={() => {
            submit("ortho", !state.ortho)
            state.ortho = !state.ortho
        }}
            label={translate("ENABLED")}
            height={"25px"}
            width={"100%"}/>
    <Range
            label={translate("PROJECTION_SIZE")}
            disabled={!state.ortho}
            onFinish={v => {
            submit("size", v)
            state.size = v
        }}
            incrementPercentage={.01}
            precision={3}
            value={state.size}
            minValue={0}
    />
</Accordion>
<Accordion title={translate("VIEW_PLANES")} type={"flex"}>
    <Range
            value={state.zFar}
            label={translate("FAR")}
            precision={1}
            incrementPercentage={.1}
            onFinish={(v) => {
            submit("zFar", v)
            state.zFar = v
        }}
    />
    <Range
            value={state.zNear}
            label={translate("NEAR")}
            precision={1}
            incrementPercentage={.1}
            onFinish={(v) => {
            submit("zNear", v)
            state.zNear = v
        }}
    />
</Accordion>
<PostProcessing selected={state}/>



