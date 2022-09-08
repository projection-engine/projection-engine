<script>
    import Range from "../../../../../../components/range/Range.svelte";
    import {onMount} from "svelte";
    import EditorRenderer from "../../../../libs/engine/editor/EditorRenderer";
    import TransformationAPI from "../../../../libs/engine/production/apis/TransformationAPI";

    let state = {}

    onMount(() => {
        const t = EditorRenderer.cursor.translation
        state = {
            x: t[0],
            y: t[1],
            z: t[2]
        }
    })
    const transform = (index, value) => {
        const c = EditorRenderer.cursor
        c.translation[index] = value
        c.transformationMatrix = TransformationAPI.transform(c.translation, [0,0,0,1], c.scaling)
    }
</script>


<div style="font-size: .7rem">3D cursor position</div>
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
        handleChange={e => transform(0, e)}
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
        handleChange={e => transform(1, e)}
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
        handleChange={e => transform(2, e)}
/>
