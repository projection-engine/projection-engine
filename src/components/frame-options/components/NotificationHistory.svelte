<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import VIEWS from "../../view/static/VIEWS";
    import {onDestroy, onMount} from "svelte";
    import {v4} from "uuid";
    import VirtualList from "@sveltejs/svelte-virtual-list"
    import Notification from "./NotificationItem.svelte";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import openBottomView from "../../../utils/open-bottom-view";

    export let engine

    let notifications = []
    let hasMessage = false
    let activeNotifications = true
    const ID = v4()
    onMount(() => {
        alert.bindListener(ID, () => {
            notifications = alert.cache
            hasMessage = notifications.length > 0
        })
    })
    onDestroy(() => alert.removeListener(ID))
</script>

<Dropdown hideArrow={true} styles="width: 300px" onOpen={_ => hasMessage = false}>
    <button slot="button" class="button frame">
        {#if hasMessage}
            <small class="dot"></small>
        {/if}
        <Icon styles="font-size: 1rem">notifications</Icon>
        <ToolTip content={Localization.NOTIFICATIONS}/>
    </button>
    <div class="dropdown-container frame">
        <div class="dropdown-header frame">
            <div data-inline="-">
                <button class="button frame button-small frame" style="gap: 4px" on:click={() => alert.clearCache()}>
                    <Icon>clear_all</Icon>
                    {Localization.CLEAR}
                    <ToolTip content={Localization.CLEAR}/>
                </button>
                <div data-vertdivider="-" style="margin: 0"></div>
                <button class="button frame button-small frame" on:click={_ => openBottomView(VIEWS.CONSOLE)}>
                    <Icon styles="font-size: 1rem;">terminal</Icon>
                    {Localization.OPEN_CONSOLE}
                    <ToolTip content={Localization.OPEN_CONSOLE}/>
                </button>
            </div>
            <button
                    class="button frame button-small frame"
                    on:click={() => {
                        alert.toggleAlerts()
                        activeNotifications = !activeNotifications
                    }}
            >
                {#if activeNotifications}
                    <Icon>notifications</Icon>
                {:else}
                    <Icon>notifications_off</Icon>
                {/if}
                <ToolTip content={Localization.TOGGLE_NOTIFICATIONS}/>
            </button>
        </div>
        {#if notifications.length === 0}
            <div style="height: 100%; width: 100%; position: relative">
                <div data-empty="-">
                    <Icon styles="font-size: 75px">notifications</Icon>
                    {Localization.EMPTY}
                </div>
            </div>
        {:else}
            <VirtualList items={notifications} let:item>
                <Notification item={item}/>
            </VirtualList>
        {/if}
    </div>
</Dropdown>
<style>
    .dot {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: red;
        top: 4px;
        right: 4px;
        z-index: 100;
    }
</style>