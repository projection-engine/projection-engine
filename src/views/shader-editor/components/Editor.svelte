<script>
    import VerticalTabs from "../../../components/vertical-tab/VerticalTabs.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import Debug from "./Debug.svelte";
    import Board from "./Board.svelte";
    import Material from "../templates/nodes/Material";

    export let selected
    export let nodes
    export let setNodes
    export let links
    export let setLinks
    export let translate
    export let isOpen
export let openFile
    export let internalID

    $: fallbackSelected = nodes.find(n => n instanceof Material)

    const submitNodeVariable = (value, attr, node) => {

        node[attr.key] = value
        const input = node.inputs.find(i => i.key === attr.key)
        if (input.onChange)
            input.onChange(value)
        setNodes(nodes)
    }

    const updateNode = (key, value, node) => {
        node[key] = value
        setNodes(nodes)
    }
    $: tabs = [
        {
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
        {label: translate("STATUS"), component: Debug}
    ]
</script>


<Board
        isOpen={isOpen}
        links={links}
        openFile={openFile}
        setLinks={setLinks}
        nodes={nodes}
        setNodes={setNodes}
        selected={selected}
        internalID={internalID}
        submitNodeVariable={submitNodeVariable}
/>
{#if isOpen}
    <VerticalTabs
            tabs={tabs}
            absolute={false}
    />
{/if}
