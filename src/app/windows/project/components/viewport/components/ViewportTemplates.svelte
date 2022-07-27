<script>
    import Input from "../../../../../components/input/Input.svelte";
    import VIEWS from "../../../../../components/view/VIEWS";
    import {settingsStore} from "../../../stores/settings-store";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import "../css/Viewport.css"
    import {onDestroy} from "svelte";
    import StoreController from "../../../stores/StoreController";

    export let translate

    let settings = {}
    const unsubscribeSettings = StoreController.getSettings(v => settings = v)
    onDestroy(() => unsubscribeSettings())

</script>

<div class={"wrapper"}>
    {#each settings.views as v, i}
        <div
                data-highlight={`${i === settings.currentView}`}
                class={"tab-wrapper viewport-tabs" }
        >
            <button
                    on:click={() => StoreController.updateSettings({...settings, currentView: i})}
                    class={"tab viewport-tabs"}
                    data-view={i}
            >
                {v.name}
            </button>
            <Dropdown hideArrow={true}>
                <button class={"tab viewport-tabs"} slot="button" style="width: 17px">
                    <Icon styles="font-size: .9rem">more_vert</Icon>
                </button>
                <div style="padding: 4px">
                    <div class={"view-name"}>
                        <div>View name</div>
                        <Input
                                width="100%"
                                searchString={v.name}
                                setSearchString={v => {
                                StoreController.updateSettings({...settings, views:   settings.views.map((view, index) => {
                                        if (index === i)
                                            view.name = v
                                        return view
                                    })})
                            }}
                                noPadding={true}
                        />
                    </div>
                    {#if settings.views.length > 1}
                        <button
                                on:click={() => {
                                const obj = {...settings}
                                if (i === obj.currentView)
                                    obj.currentView = 0
                                obj.views = obj.views.filter((_, index) => i !== index)
                                StoreController.updateSettings(obj)
                         }}
                        >
                            {translate("DELETE_VIEW")}
                        </button>
                    {/if}
                </div>
            </Dropdown>
        </div>
    {/each}
    {#if settings.views.length < 10}
        <button
                on:click={() => {
                    const views =   [...settings.views, {
                        name: translate("NEW_TAB") + settings.views.length,
                        bottom: [VIEWS.CONSOLE],
                        right: [VIEWS.HIERARCHY],
                        left: []
                    }]
                    StoreController.updateSettings({...settings, views})

                }}
                class={"tab viewport-tabs"}
                style="padding: 0; width: 17px"
        >
            <Icon styles="font-size: .9rem">
                add
            </Icon>
        </button>
    {/if}
</div>

<style>
    .wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2px;
        padding: 2px;
        margin: 0 16px;
        overflow-x: auto;

        overflow-y: hidden;
    }


    .view-name {
        font-size: .7rem;
        font-weight: 550;
        color: var(--pj-color-secondary);
        margin-bottom: 4px;
        width: 100%;
        border-bottom: var(--pj-border-primary) 1px solid;
    }
</style>