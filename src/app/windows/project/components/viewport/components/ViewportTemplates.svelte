<script>
    import Input from "../../../../../components/input/Input.svelte";
    import VIEWS from "../../../../../components/view/VIEWS";
    import {settingsStore} from "../../../stores/settings-store";
    import {get} from "svelte/store";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";

    const settings = get(settingsStore)
    export let translate

</script>

<div class={"wrapper"}>
    {#each settings.views as v, i}
        <div
            data-highlight={`${i === settings.currentView}`}
            class={"tab-wrapper"}
        >
            <button
                onClick={() => settings.currentView = i}
                class={"tab"}
                data-view={i}
            >
                {v.name}
            </button>
            <Dropdown hideArrow={true}>
                <button slot="button" class={"tab"}>
                    <Icon styles="font-size: .9rem">more_vert</Icon>
                </button>
                <div style="padding: 4px">
                    <div class={"view-name"}>
                        <label>View name</label>
                        <Input
                            noPlaceHolder={true}
                            searchString={v.name}
                            setSearchString={v => {
                                settings.views = settings.views.map((view, index) => {
                                    if (index === i)
                                        view.name = v
                                    return view
                                })
                            }}
                            noPadding={true}
                        />
                    </div>
                    <button
                        on:click={() => {
                            if (i === settings.currentView)
                                settings.currentView = 0
                            settings.views = settings.views.filter((_, index) => i !== index)
                        }}
                    >
                        {translate("DELETE_VIEW")}
                    </button>
                </div>
            </Dropdown>
        </div>
    {/each}
    {#if settings.views.length < 10}
        <button
                onClick={() => settings.views = [...settings.views, {
                name: translate("NEW_TAB") + settings.views.length,
                bottom: [VIEWS.CONSOLE],
                right: [VIEWS.HIERARCHY],
                left: []
            }]}
                class={"tab"}
                style="padding: 0; width: 17px"
                data-highlight={"false"}
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

    .tab {
        outline: none;
        height: 17px;
        font-size: 0.7rem;
        border: none;
        color: var(--pj-color-secondary);
        padding: 0 8px;
        cursor: pointer;
        background: none;

        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }


    .tab-wrapper {
        display: flex;
        align-items: center;
    }


    .tab-wrapper[data-highlight="true"] {
        background: var(--pj-border-primary);
        font-weight: 550;

        border-radius: 3px;
    }

    .tab-wrapper[data-highlight="true"] > .tab {
        cursor: default;
        font-weight: 550;
    }


    .tab-wrapper[data-highlight="false"]:active > .tab {
        color: var(--pj-accent-color);
        background: var(--pj-background-tertiary);

    }

    .tab-wrapper[data-highlight="false"]:hover > .tab {
        color: var(--pj-accent-color);
    }

    .view-name {
        font-size: .7rem;
        font-weight: 550;
        color: var(--pj-color-secondary);
        margin-bottom: 4px;
    }
</style>