<script>
    import Tree from "./components/Tree.svelte"
    import EnglishLocalization from "../../../../static/EnglishLocalization";
    import Input from "../../../../components/input/Input.svelte";
    import Header from "../../../../components/view/components/Header.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import createFolder from "./utils/create-folder";

    export let hidden = false
    export let switchView
    export let orientation

    let searchedEntity = ""

    const translate = key => EnglishLocalization.PROJECT.HIERARCHY[key]

</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"account_tree"}
>
    <Input
            width={"100%"}
            placeholder={translate("SEARCH")}
            searchString={searchedEntity}
            setSearchString={v => searchedEntity = v}
    />
    <button class={"button"} on:click={createFolder}>
        <Icon>create_new_folder</Icon>
    </button>
</Header>
{#if !hidden}
    <Tree/>
{/if}