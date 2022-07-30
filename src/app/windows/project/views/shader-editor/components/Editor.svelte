<script>
    import VerticalTabs from "../../../../../components/vertical-tab/VerticalTabs.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import Debug from "./Debug.svelte";
    import ShaderEditor from "../ShaderEditor.svelte";
    import {v4} from "uuid";
    import EnglishLocalization from "../../../../../static/EnglishLocalization";
    import cloneClass from "../../../libs/engine/utils/clone-class";

    const internalID = v4()
    $: fallbackSelected = hook.nodes.find(n => n instanceof ShaderEditor)

    const submitNodeVariable = (event, attr, node) => {
        hook.setNodes(prev => {
            const n = [...prev]
            const classLocation = n.findIndex(e => e.id === node.id)
            const clone = cloneClass(prev[classLocation])
            clone[attr.key] = event
            const input = clone.inputs.find(i => i.key === attr.key)

            if (input.onChange)
                input.onChange(event)

            n[classLocation] = clone
            return n
        })
        hook.setChanged(true)
        hook.setImpactingChange(true)
    }

    const updateNode = (key, value, node) => {
        hook.setNodes(prev => {
            const n = [...prev],
                classLocation = n.findIndex(e => e.id === node.id),
                clone = cloneClass(prev[classLocation])
            clone[key] = value
            n[classLocation] = clone
            return n
        })
    }

    const translate = key => EnglishLocalization.PROJECT.SHADER_EDITOR[key]


</script>

<div class="wrapper" id={internalID}>
    <Canvas
            selected={hook.selected}
            setSelected={hook.setSelected}
    />
    <VerticalTabs
            tabs={[{
                label: translate("NODE"),
                component: AttributeEditor,
                props: {translate}
            },
            {
                label:translate("STATUS"),
                component:Debug
            }
        ]}
    />
</div>
