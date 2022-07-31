<script>
    import VerticalTabs from "../../../../../components/vertical-tab/VerticalTabs.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import Debug from "./Debug.svelte";
    import ShaderEditor from "../ShaderEditor.svelte";
    import {v4} from "uuid";
    import EnglishLocalization from "../../../../../static/EnglishLocalization";
    import cloneClass from "../../../libs/engine/utils/clone-class";
    import Board from "./Board.svelte";

    export let selected
    export let setSelected
    export let nodes
    export let setNodes
    export let links
    export let setLinks
    export let translate
    const internalID = v4()
    $: fallbackSelected = nodes.find(n => n instanceof ShaderEditor)

    const submitNodeVariable = (event, attr, node) => {

        const n = [...nodes]
        const classLocation = n.findIndex(e => e.id === node.id)
        const clone = cloneClass(nodes[classLocation])
        clone[attr.key] = event
        const input = clone.inputs.find(i => i.key === attr.key)

        if (input.onChange)
            input.onChange(event)

        n[classLocation] = clone
        setNodes(n)
    }

    const updateNode = (key, value, node) => {
        const n = [...nodes],
            classLocation = n.findIndex(e => e.id === node.id),
            clone = cloneClass(nodes[classLocation])
        clone[key] = value
        n[classLocation] = clone
        setNodes(n)
    }
</script>

<div class="wrapper" id={internalID}>
    <Board

            links={links}
            setLinks={setLinks}
            nodes={nodes}
            setNodes={setNodes}
            selected={selected}
            setSelected={setSelected}
            submitNodeVariable={submitNodeVariable}
    />
    <VerticalTabs
            tabs={[{
                label: translate("NODE"),
                component: AttributeEditor,
                props: {
                     selected,
                    nodes,
                    updateNode,
                    submitNodeVariable,
                    translate
                }
            },
            {
                label:translate("STATUS"),
                component:Debug
            }
        ]}
    />
</div>

<style>
    .wrapper {
        display: flex;
        height: 100%;
        width: 100%;
        overflow: hidden;
        padding: 4px;
    }

</style>