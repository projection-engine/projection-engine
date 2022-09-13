<script>
    import Localization from "../../shared/libs/Localization";
    import logo from "../../static/logo.png"

    export let open =undefined
    export let projects =undefined
    function getRecent(projects){
        return projects.sort((a, b) => {
            if (a.meta?.lastModification < b.meta?.lastModification)
                return -1
            if (a.meta?.lastModification > b.meta?.lastModification)
                return 1
            return 0
        }).slice(0, 5)
    }
    $: toShow = Array.isArray(projects) ? getRecent( projects ) : []

    const translate = (key) => Localization.HOME.CARD[key]
</script>

{#if toShow && toShow.length > 0}
<div style="color: var(--pj-color-secondary)">
    <h4 style="margin-bottom: 4px; margin-top: 4px">{translate("RECENT")}</h4>
    <div class={"wrapper"}>
        {#each toShow as project}
            <div class={"card"} on:click={() => open(project)}>
                <div class={"preview"}>
                    <img
                        draggable="false"
                        src={project.meta.preview ? project.meta.preview : logo}
                        alt={translate("PROJECT")}
                    />
                </div>
                <div class={"content"}>
                    <strong>{project.meta.name}</strong>
                    <small>{project.meta.lastModification ? project.meta.lastModification : translate("NEVER")}</small>
                </div>
            </div>
        {/each}
    </div>
</div>
{/if}



<style>
    h4{
        font-size: .85rem;
        font-weight: 550;
    }
    strong{
        font-weight: 550;
    }
    .wrapper {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .card {
        color: var(--pj-color-secondary);

        border-radius: 5px;
        border: var(--pj-border-primary) 1px solid;
        background: var(--pj-background-tertiary);


        display: flex;
        gap: 4px;
        align-items: center;

        padding: 4px;
        height: 75px;
        width: 225px;

        font-size: .85rem;
        transition: 150ms linear;

        cursor: pointer;
    }
    .card:hover{
        background: var(--pj-background-primary);
    }
    .preview{
        width: 35%;
        max-height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .preview > img{
        height: 50px;
    }
    .content{
        display: grid;
        justify-content: flex-start;
    }
</style>