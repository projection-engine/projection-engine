<script>
    import "../css/ProjectRow.css"
    import Localization from "../../shared/libs/Localization";
    import Icon from "../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../shared/components/tooltip/ToolTip.svelte";

    export let release
    export let openRelease

    const translate = (key) => Localization.HOME.HOME[key]
</script>

<div class={"wrapper card-home"}>
    <div class={"info card-home"}>
        <strong>{release.tag_name}</strong>
        <small>{(new Date(release.published_at)).toDateString()}</small>
    </div>
    <button on:click={() => openRelease()}  class="button card-home" >
        <Icon styles="font-size: .9rem">description</Icon>
        <ToolTip content={translate("RELEASE_NOTES")}/>
    </button>
    <button data-focusbutton="-" disabled="true">
        {translate("INSTALL")}
    </button>
</div>

<style>
    strong {
        font-weight: 550;
    }
</style>
