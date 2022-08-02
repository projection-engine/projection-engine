<script>
    import VerticalTabs from "../../../../../components/vertical-tab/VerticalTabs.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import Debug from "./Debug.svelte";
    import {v4} from "uuid";
    import EnglishLocalization from "../../../../../libs/EnglishLocalization";
    import cloneClass from "../../../libs/engine/utils/clone-class";
    import Board from "./Board.svelte";
    import Material from "../templates/nodes/Material";

    export let selected
    export let setSelected
    export let nodes
    export let setNodes
    export let links
    export let setLinks
    export let translate
    export let isOpen

    const internalID = v4()
    $: fallbackSelected = nodes.find(n => n instanceof Material)

    const submitNodeVariable = (value, attr, node) => {

        const n = [...nodes]
        const classLocation = n.findIndex(e => e.id === node.id)
        const clone = cloneClass(nodes[classLocation])
        clone[attr.key] = value
        const input = clone.inputs.find(i => i.key === attr.key)

        if (input.onChange)
            input.onChange(value)

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
            isOpen={isOpen}
            links={links}
            setLinks={setLinks}
            nodes={nodes}
            setNodes={setNodes}
            selected={selected}
            setSelected={setSelected}
            submitNodeVariable={submitNodeVariable}
    />
    {#if isOpen}
        <VerticalTabs
                tabs={[{
                label: translate("NODE"),
                component: AttributeEditor,
                props: {
                     selected: selected.length === 0 && fallbackSelected ? fallbackSelected.id : selected[0],
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
                absolute={false}
        />
    {/if}
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