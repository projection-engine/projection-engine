<script>
    import Range from "../../../../../../components/range/Range.svelte";
    import {onMount} from "svelte";
    import COMPONENTS from "../../../../libs/engine/data/COMPONENTS";

    let state = {}

    onMount(() => {
        const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
        state = {
            x: t[0],
            y: t[1],
            z: t[2]
        }
    })

</script>


<div>3D cursor position</div>
<Range
        metric={"m"}
        accentColor={"red"}
        variant={"embedded"}
        label={"X"}
        value={state.x}
        precision={3}
        onFinish={e => {
            state = {
                ...state,
                x: e
            }
        }}
        incrementPercentage={.01}
        handleChange={e => {
        const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM]
        t.translation = [e, t.translation[1], t.translation[2]]
    }}
/>
<Range
        metric={"m"}
        accentColor={"#00ff00"}
        label={"Y"}
        variant={"embedded"}
        precision={3}
        incrementPercentage={.01}
        value={state.y}
        onFinish={e => {
            state = {
                ...state,
                y: e
            }
        }}
        handleChange={e => {
        const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM]
        t.translation = [t.translation[0], e, t.translation[2]]
    }}
/>
<Range
        metric={"m"}
        accentColor={"blue"}
        label={"Z"}
        variant={"embedded"}
        precision={3}
        incrementPercentage={.01}
        value={state.z}
        onFinish={e => {
            state = {
                ...state,
                z: e
            }
        }}
        handleChange={e => {
        const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM]
        t.translation = [ t.translation[0], t.translation[1], e]
    }}
/>
