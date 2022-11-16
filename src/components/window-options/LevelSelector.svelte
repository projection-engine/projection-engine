<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import LevelController from "../../lib/utils/LevelController";
    import VIEWS from "../view/static/VIEWS";
    import TabsStore from "../../stores/TabsStore";
    import {onDestroy, onMount} from "svelte";
    import {v4} from "uuid";
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import Notification from "./NotificationItem.svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import openBottomView from "../../utils/open-bottom-view";
    import DiffuseProbePass from "../../../public/engine/runtime/rendering/DiffuseProbePass";
    import SpecularProbePass from "../../../public/engine/runtime/rendering/SpecularProbePass";
    import ScriptsAPI from "../../../public/engine/lib/rendering/ScriptsAPI";
    import UIAPI from "../../../public/engine/lib/rendering/UIAPI";
    import UndoRedoAPI from "../../lib/utils/UndoRedoAPI";
    import AlertHistory from "./NotificationHistory.svelte";

    export let store
    export let engine

</script>
<Dropdown>
    <button slot="button" class="button frame" style="max-width: unset; background: transparent"
            disabled={engine.executingAnimation}>
        <Icon>forest</Icon>
        <div data-overflow="-">
            {#if engine.currentLevel}
                {engine.currentLevel.name}
            {:else}
                {Localization.DEFAULT_LEVEL}
            {/if}
        </div>
        <ToolTip content={Localization.LEVEL}/>
    </button>
    <button on:click={() => LevelController.loadLevel()} style="max-width: unset; min-height: unset">
        {#if !engine.currentLevel}
            <Icon styles="font-size: .9rem">check</Icon>
        {:else}
            <div style="width: .9rem"></div>
        {/if}
        {Localization.DEFAULT_LEVEL}
    </button>
    <div data-divider="-"></div>
    {#each store.levels as level}
        <button on:click={() => LevelController.loadLevel(level)} style="max-width: unset; min-height: unset">
            {#if engine.currentLevel?.registryID === level.registryID}
                <Icon styles="font-size: .9rem">check</Icon>
            {:else}
                <div style="width: .9rem"></div>
            {/if}
            {level.name}
        </button>
    {/each}
</Dropdown>

