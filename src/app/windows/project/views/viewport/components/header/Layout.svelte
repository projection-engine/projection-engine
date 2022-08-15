<script>
    import VIEWS from "../../../../../../components/view/VIEWS";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../../components/Icon/Icon.svelte";
    import "../../css/Viewport.css"
    import {onDestroy} from "svelte";
    import RendererStoreController from "../../../../stores/RendererStoreController";
    import KEYS from "../../../../libs/engine/data/KEYS";

    export let translate

    let settings = {}
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings = v)
    onDestroy(() => unsubscribeSettings())

</script>

<Dropdown styles="width: clamp(250px, 15vw, 500px); font-size: .7rem; padding: 4px;">
    <button style="border: none" slot="button">
        {translate("LAYOUT")}
    </button>

    {#each settings.views as v, i}
        <div
                style="margin-top: 4px;"
                data-highlight={`${i === settings.currentView}`}
                class={"tab-wrapper viewport-tabs" }
        >
            <input
                    on:dblclick={(e) => {
                        e.currentTarget.type = "text"
                        RendererStoreController.updateSettings({...settings, currentView: i})
                    }}
                    on:input={e => {
                       v.name = e.target.value
                    }}
                    on:keydown={e => {
                        if(e.code=== KEYS.Enter){
                        v.name = e.target.value
                        e.currentTarget.type = "button"
                        }
                    }}
                    on:blur={e => e.currentTarget.type = "button"}
                    on:click={() => RendererStoreController.updateSettings({...settings, currentView: i})}
                    class={"tab viewport-tabs"}
                    data-view={i}
                    type="button"
                    value={v.name}
            >
            {#if settings.views.length > 1}
                <button
                        on:click={() => {
                                const obj = {...settings}
                                if (i === obj.currentView)
                                    obj.currentView = 0
                                obj.views = obj.views.filter((_, index) => i !== index)
                                RendererStoreController.updateSettings(obj)
                         }}
style="width: 25px; height: 25px; display: flex; align-items: center; justify-content: center"
                >
                    <Icon styles="font-size: .9rem">
                        delete_forever
                    </Icon>
                </button>
            {/if}
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
                    RendererStoreController.updateSettings({...settings, views})

                }}
                class={"tab viewport-tabs"}
                style="margin-top: 4px; background: var(--pj-border-primary)"
        >
            <Icon styles="font-size: .9rem">
                add
            </Icon>
            {translate("NEW_TAB")}
        </button>
    {/if}
</Dropdown>

