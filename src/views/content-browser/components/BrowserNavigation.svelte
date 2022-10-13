<script>
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import FilesStore from "../../../stores/FilesStore";
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy} from "svelte";

    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS"
    import Localization from "../../../libs/libs/Localization";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ITEM_TYPES from "../templates/ITEM_TYPES";

    export let bookmarks
    export let currentDirectory
    export let setCurrentDirectory
    export let fileType

    export let path
    export let navigationHistory
    export let viewType
    export let setViewType

    let loading = false
    $: starred = bookmarks.find(b => b.path === currentDirectory.id) !== undefined


    let engine = {}
    const unsubscribeEngine = EngineStore.getStore(v => engine = v)
    onDestroy(() => unsubscribeEngine())
    const translate = key => Localization.PROJECT.FILES[key]
</script>

<div class="wrapper">

    <button class="button" on:click={() => navigationHistory.undo()}>
        <Icon styles="font-size: .9rem">arrow_back</Icon>
        <ToolTip content={translate("BACK_DIR")}/>
    </button>
    <button
            class="button"
            on:click={() => navigationHistory.redo()}
    >
        <Icon styles="transform: rotate(180deg)">arrow_back</Icon>
        <ToolTip content={translate("FORWARD_DIR")}/>
    </button>
    <button
            class="button"

            on:click={() => {
                            if(currentDirectory.id === NodeFS.sep)
                                return
                            navigationHistory.goToParent(currentDirectory)
                        }}
    >
        <Icon styles="transform: rotate(180deg)">subdirectory_arrow_right</Icon>
        <ToolTip content={translate("PARENT_DIR")}/>
    </button>
    <div data-vertdivider="-"></div>
    <button
            disabled="{loading}"
            class="button"
            on:click={() => {
                    alert.pushAlert(translate("REFRESHING"), "info")
                    FilesStore.refreshFiles().then(() => loading = false).catch()
                }}
    >
        <Icon styles="font-size: .9rem">sync</Icon>
        <ToolTip content={translate("REFRESH")}/>
    </button>
    <button class="button" on:click={() => FilesStore.createFolder(currentDirectory).catch()}>
        <Icon styles="transform: rotate(180deg)">create_new_folder</Icon>
        <ToolTip content={translate("CREATE_FOLDER")}/>
    </button>
    <button
            class="button"
            data-highlight={starred ? "-" : undefined}
            on:click={() => {
                        if (starred)
                            FilesStore.removeBookmark(currentDirectory.id)
                        else
                            FilesStore.addBookmark(currentDirectory.id)
                    }}
    >
        <Icon styles="font-size: .9rem">star</Icon>
        <ToolTip content={translate("ADD_BOOKMARK")}/>
    </button>
    <div data-vertdivider="-"></div>
    <Input
            hasBorder={true}
            width={"250px"}
            height="22px"
            placeholder={translate("SEARCH")}
            searchString={currentDirectory.id}
            noAutoSubmit={true}
            setSearchString={async (path) => {
                if (await NodeFS.exists(NodeFS.ASSETS_PATH  + path))
                setCurrentDirectory({id: path })
            }}
    />
    <div class="views">
        <button
                data-highlight={viewType === ITEM_TYPES.ROW ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.ROW)}
                class="button"
        >
            <Icon styles="font-size: .9rem">view_stream</Icon>
            <ToolTip content={translate("ROW_VIEW")}/>
        </button>
        <button
                data-highlight={viewType === ITEM_TYPES.CARD ? "-" : ""}
                on:click={() => setViewType(ITEM_TYPES.CARD)}
                class="button"
        >
            <Icon styles="transform: rotate(180deg)">grid_view</Icon>
            <ToolTip content={translate("CARD_VIEW")}/>
        </button>
        <Dropdown buttonStyles={`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 22px;
            width: 22px;
            background: var(--pj-border-primary);
            border-radius: 3px;
        `}>
            <button data-highlight={viewType === ITEM_TYPES.CARD ? "-" : ""} on:click={() => setViewType(ITEM_TYPES.CARD)}>
                {translate("CARD_VIEW")}
            </button>
            <button data-highlight={viewType === ITEM_TYPES.ROW ? "-" : ""} on:click={() => setViewType(ITEM_TYPES.ROW)}>
                {translate("ROW_VIEW")}
            </button>
        </Dropdown>
    </div>
</div>


<style>
    .views {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 2px;
        padding-right: 2px;
    }

    .wrapper {
        padding-left: 3px;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 2px;

    }

    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 22px;
        width: 22px;
        background: var(--pj-border-primary);
    }
</style>