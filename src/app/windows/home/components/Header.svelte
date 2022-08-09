<script>

    import Input from "../../../components/input/Input.svelte";
    import Icon from "../../../components/Icon/Icon.svelte";
    import FileSystem from "../../../libs/FileSystem";
    import {onDestroy, onMount} from "svelte";
    import createPortal from "../../../components/create-portal";

    export let setProjectsToShow
export let projectsToShow
export let setSearchString
export let searchString
export let translate

let openInput = false
let modal
let input = ""
const create = async (name) => {
    const res = await FileSystem.createProject(!name ? translate("PROJECT_NAME") : name)
    setProjectsToShow([
        ...projectsToShow,
        {
            id: res,
            meta: {name: name, creationDate: (new Date()).toLocaleDateString()}
        }
    ])

    alert.pushAlert(translate("PROJECT_CREATED"), "success")
    openInput = false
    input = ""
}

function handler(event) {
    if (!modal.firstChild.contains(event.target))
        openInput = false

}

const portal = createPortal(999)
$: openInput ? portal.open() : portal.close()
onMount(() => {
    portal.create(modal)
    document.addEventListener("mousedown", handler)
})
onDestroy(() => {
    portal.destroy()
    document.removeEventListener("mousedown", handler)
})
</script>


<div class="title-wrapper">
    <div class="title">
        <h2>{translate("PROJECTS")}</h2>
        <Input placeholder={translate("SEARCH")} height={"25px"} setSearchString={v => searchString = v}
               searchString={searchString}>
            <Icon slot="icon" styles="font-size: 1rem">
                search
            </Icon>
        </Input>
    </div>

    <div class="input-creation">

        <button
                on:click={() => openInput = !openInput}
                class="button"
        >

            <Icon>add</Icon>
            {translate("CREATE")}
        </button>
    </div>
</div>
<div bind:this={modal} class="modal">
    <div class="container">
        <div style="padding: 16px 8px; ">
            <h4 style="margin-top: 0px">
                {translate("CREATE")}
            </h4>
            <Input
                    placeholder={translate("PROJECT_NAME")}
                    onEnter={create}
                    height={"25px"}
                    directChange={v => input = v}
            />
        </div>
        <div class="footer">
            <button
                    data-accentbutton="-"
                    on:click={() => create(input)}>
                <Icon>check</Icon>
                {translate("CREATE")}
            </button>
        </div>
    </div>
</div>

<style>
    .container{
        width: 50vw;
        height: fit-content;

        background-color: var(--pj-background-tertiary);
        border: var(--pj-border-primary) 1px solid;
        border-radius: 3px;
        box-shadow: var(--pj-boxshadow);
        color: var(--pj-color-secondary);
    }

    .footer {
        border-top: var(--pj-border-primary) 1px solid;
        height: 35px;
        width: 100%;
        background: var(--pj-background-secondary);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 4px;
    }
    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;

        position: fixed;
        z-index: 999;
    }


    .title-wrapper {
        color: var(--pj-color-secondary);
        border-bottom: var(--pj-border-primary) 2px solid;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 8px;

        overflow: hidden;
        max-width: 100%;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 16px;
        white-space: nowrap;
    }

    .title > h2 {
        margin: 0;
    }

    .input-creation{
        display: flex;
        align-items: center;
        gap: 4px;
    }

</style>