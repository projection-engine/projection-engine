<script>
    import KEYS from "../../static/KEYS.ts"
    import {onDestroy, onMount} from "svelte"
    import Icon from "../../../shared/components/icon/Icon.svelte"
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte"
    import {Sortable} from "sortablejs"
    import Tab from "./components/Tab.svelte"
    import TabContextController from "./TabContextController"

    /** @type {function} */
    export let addNewTab
    /** @type {function} */
    export let removeTab
    /** @type {function} */
    export let removeMultipleTabs
    /** @type {{icon: string, id: string, name:string, index: number, originalIndex: number}[]} */
    export let tabs
    /** @type {number} */
    export let currentTab
    /** @type {function} */
    export let setCurrentView
    /** @type {boolean} */
    export let allowDeletion
    /** @type {boolean} */
    export let allowRenaming
    /** @type {{ id: string, name: string }[]} */
    export let templates
    /** @type {function} */
    export let updateView
    /** @type {boolean} */
    export let focused
    /** @type {string} */
    export let styles

    const COMPONENT_ID = crypto.randomUUID()


    let sortedTabs = []
    let sortable
    let ref
    let contextID

    $: {
    	if(tabs != null) {
    		for (let i = 0; i < tabs.length; i++)
    			tabs[i].originalIndex = i
    		sortedTabs = tabs.sort((a, b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))
    	}
    }

    /**
     *
     * @param event
     * @param tabData
     * @param index
     */
    const handler = (event, tabData, index) => {
    	const T = event.currentTarget
    	switch (event.type) {
    	case "keydown": {
    		if (event.code !== KEYS.Enter)
    			break
    		const target = e.target
    		tabData.name = target.value
    		T.type = "button"
    		break
    	}
    	case "dblclick": {
    		if (allowRenaming)
    			T.type = "text"
    		break
    	}
    	case "input":
    		const target = e.target
    		tabData.name = target.value
    		break
    	case "blur":
    		T.type = "button"
    		break
    	case "click":
    		setCurrentView(index)
    		break
    	case "wheel":
    		e.preventDefault()
    		if (ref.scrollWidth > ref.offsetWidth && "deltaY" in e) {
    			const value = e.deltaY
    			ref.scrollLeft += value
    		}
    		break
    	}
    }
    onMount(() => {
    	ref.addEventListener(
    		"wheel",
    		ev => {
    			ev.preventDefault()
    			if (ev.wheelDelta > 0)
    				ref.scrollLeft += ref.scrollWidth * .1
    			else
    				ref.scrollLeft -= ref.scrollWidth * .1
    		},
    		{passive: false}
    	)
    	contextID = TabContextController.getInstance().contextID
    	ref.addEventListener("wheel", handler)
    	sortable = new Sortable(ref, {
    		swapThreshold: 1,
    		animation: 0,
    		onEnd: () => {
    			const elements = ref.children
    			const ids = {}
    			for (let i = 0; i < elements.length; i++) {
    				const element = elements[i]
    				ids[element.getAttribute("data-sveltetype")] = i
    			}
    			for (let i = 0; i < tabs.length; i++) {
    				const item = tabs[i]
    				item.index = ids[item.type]
    			}
    		},
    		direction: "horizontal"
    	})
    	TabContextController.getInstance().registerContext(COMPONENT_ID, id => id === "CREATE" ? addNewTab() : removeMultipleTabs())
    })

    onDestroy(() => {
    	sortable.destroy()
    	TabContextController.getInstance().removeContext(COMPONENT_ID)
    	ref.removeEventListener("wheel", handler)
    })

</script>

<div
        class="container" bind:this={ref}
        id={COMPONENT_ID}
        data-sveltecontextid={contextID}
        style={styles}
>
    {#each sortedTabs as v, i}
        <Tab
                handler={handler}
                removeTab={removeTab}
                tabs={tabs}
                currentTab={currentTab}
                allowDeletion={allowDeletion}
                allowRenaming={allowRenaming}
                templates={templates}
                updateView={updateView}
                focused={focused}
                value={v}
        />
    {/each}

    {#if allowRenaming}
        <button data-sveltebuttondefault="-" on:click={addNewTab} class="add-button">
            <Icon styles="font-size: .9rem">add</Icon>
        </button>
    {:else}
        <Dropdown hideArrow="true" buttonStyles="margin-left: auto">
            <button data-sveltebuttondefault="-" class="add-button" slot="button">
                <Icon styles="font-size: .9rem">add</Icon>
            </button>
            {#each templates as item}
                <button data-sveltebuttondefault="-"
                        style="padding-left: 2rem"
                        on:click={e => {
                            if(e.target.closeDropdown)
                                e.target.closeDropdown()
                            addNewTab(item)
                        }}
                >
                    {item.name}
                </button>
            {/each}
        </Dropdown>
    {/if}

</div>

<style>


    .add-button {
        background: var(--pj-background-quaternary);
        border: none;
        width: 20px;
        height: 20px;
        border-radius: 3px;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin-left: auto;
    }

    .container {
        padding-right: 4px;
        width: 100%;

        max-height: 30px;
        min-height: 30px;
        display: flex;
        align-items: center;
        overflow: hidden;
        gap: 2px;
    }
</style>

