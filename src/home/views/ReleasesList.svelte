<script>
    import {onMount} from "svelte";
    import Icon from "../../shared/components/icon/Icon.svelte";
    import Localization from "../../shared/libs/Localization";
    import Input from "../../shared/components/input/Input.svelte";
    import ReleaseRow from "../components/ReleaseRow.svelte";
    import ReleaseInfo from "../components/ReleaseInfo.svelte";

    let searchString = ""
    let releases = []
    let all = []
    onMount(() => {
        fetch("https://api.github.com/repos/projection-engine/editor/releases", {method: "get"})
            .then(async res => {
                all = await res.json()
            })
            .catch(err => {
                console.error(err)
                alert.pushAlert("Some error occurred")
            })
    })
    $: {
        if (searchString)
            releases = all.filter(r => r.tag_name.toLowerCase().includes(searchString.toLowerCase()))
        else
            releases = [...all]
    }
    const translate = (key) => Localization.HOME.HOME[key]
    let openRelease
</script>

<div class="header-wrapper" style={openRelease != null ? "gap: 8px; justify-content: flex-start" : undefined}>
    {#if openRelease != null}
        <button on:click={() => openRelease = undefined} class="button">
            <Icon>arrow_back</Icon>
        </button>
    {/if}
    <div class="header">{translate("RELEASES")}</div>
    {#if !openRelease}
        <Input
                hasBorder="true"
                placeholder={translate("SEARCH")}
                height={"25px"}
                width="20vw"
                setSearchString={v => searchString = v}
                searchString={searchString}>
            <Icon slot="icon" styles="font-size: 1rem">
                search
            </Icon>
        </Input>
    {/if}
</div>
{#if !openRelease}
    <div class="content">
        {#if releases.length > 0}
            {#each releases as release}
                <ReleaseRow release={release} openRelease={() => openRelease = release}/>
            {/each}
        {:else}
            <div data-empty="-">
                <Icon styles="font-size: 65px">folder</Icon>
                {translate("NO_RELEASES")}
            </div>
        {/if}
    </div>
{:else}
    <ReleaseInfo release={openRelease} close={() => openRelease = undefined}/>
{/if}

<style>
    .button {

        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }

    .content {
        display: grid;
        gap: 2px;
        height: fit-content;
        align-items: flex-start;
        overflow: auto;
    }

    .header {
        font-weight: 550;
        font-size: 1.5rem;
        white-space: nowrap;
    }

    .header-wrapper {
        min-height: clamp(50px, 7vh, 100px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        max-width: 100%;
    }
</style>