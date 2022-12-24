<script lang="ts">
    import KEYS from "../../static/KEYS.ts";
    import {onDestroy, onMount} from "svelte";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";
    import {Sortable} from "sortablejs";
    import TabData from "./TabData";
    import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
    import ColorPicker from "../../../shared/components/color-picker/ColorPicker.svelte";
    import Tab from "./Tab.svelte";


    export let addNewTab: Function
    export let removeTab: Function
    export let tabs: TabData[]

    export let currentTab: number
    export let setCurrentView: Function
    export let allowDeletion: boolean
    export let allowRenaming: boolean
    export let templates: { id: string, name: string }[]
    export let updateView: Function
    export let disabled: boolean
    export let focused: boolean

    $: sortedTabs = tabs.map((v, i) => {
        v.originalIndex = i
        return v
    }).sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))

    let sortable: Sortable
    let ref: HTMLElement

    const handler = (e: KeyboardEvent | MouseEvent | WheelEvent, v?: TabData, i?: number) => {
        const T = <HTMLInputElement>e.currentTarget
        switch (e.type) {
            case "keydown": {
                const event = <KeyboardEvent>e
                if (event.code !== KEYS.Enter)
                    break
                const target = <HTMLInputElement>e.target
                v.name = target.value
                T.type = "button"
                break
            }
            case "dblclick": {
                if (allowRenaming)
                    T.type = "text"
                break
            }
            case "input":
                const target = <HTMLInputElement>e.target
                v.name = target.value
                break
            case "blur":
                T.type = "button"
                break
            case "click":
                setCurrentView(i)
                break
            case "wheel":
                e.preventDefault();
                if (ref.scrollWidth > ref.offsetWidth && "deltaY" in e) {
                    const value = e.deltaY
                    ref.scrollLeft += value;
                }
                break
        }
    }
    onMount(() => {
        ref.addEventListener("wheel", handler);
        sortable = new Sortable(ref, {
            swapThreshold: 1,
            animation: 0,
            onEnd: () => {
                const elements = ref.children
                const ids:{[key:string]: number} = {}
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i]
                    ids[element.getAttribute("data-type")] = i
                }
                for(let i =0; i < tabs.length; i++) {
                    const item = tabs[i]
                    item.index = ids[item.type]
                }
                console.trace(tabs)
            },
            direction: "horizontal"
        });

    })
    onDestroy(() => {
        sortable.destroy()
        ref.removeEventListener("wheel", handler);
    })

</script>

<div class="container" bind:this={ref}>
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
               disabled={disabled}
               focused={focused}
               value={v}
       />
    {/each}

    {#if allowRenaming}
        <button on:click={addNewTab} class="add-button">
            <Icon styles="font-size: .9rem">add</Icon>
        </button>
    {:else}
        <Dropdown hideArrow="true" buttonStyles="margin-left: auto">
            <button class="add-button" slot="button">
                <Icon styles="font-size: .9rem">add</Icon>
            </button>
            {#each templates as item}
                <button
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

