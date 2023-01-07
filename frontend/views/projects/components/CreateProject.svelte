<script lang="ts">

    import ProjectMetadata from "../static/ProjectMetadata";
    import FS from "../../../lib/FS/FS";
    import LOCALIZATION_EN from "../../editor/static/LOCALIZATION_EN";
    import PROJECT_STATIC_DATA from "../../../../static/objects/PROJECT_STATIC_DATA";
    import Icon from "../../../components/icon/Icon.svelte";
    import Input from "../../../components/input/Input.svelte";
    import AlertController from "../../../components/alert/AlertController";
    import {STORAGE_KEYS} from "../../../static/STORAGE_KEYS";

    export let close: Function
    export let setProjectsToShow: Function
    export let projectsToShow: ProjectMetadata[]
    let input

    const create = async (name: string) => {
        const projectID = crypto.randomUUID()
        const projectPath = localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FS.sep + projectID
        if (!FS.exists(FS.resolvePath(localStorage.getItem(STORAGE_KEYS.ROOT_PATH)))) {
            AlertController.error("Directory not found, creating on root directory.")
            localStorage.setItem(STORAGE_KEYS.ROOT_PATH, FS.rootDir)
        }

        const err = await FS.mkdir(projectPath)
        const meta = {name: name, creationDate: (new Date()).toLocaleDateString()}
        if (!err)
            await FS.write(FS.resolvePath(projectPath + FS.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION), JSON.stringify(meta))

        setProjectsToShow([
            ...projectsToShow,
            {
                id: projectID,
                meta,
                path: FS.resolvePath(localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FS.sep + projectID)
            }
        ])

        AlertController.success(LOCALIZATION_EN.PROJECT_CREATED)
        close()
        input = ""
    }

</script>


<div style="padding: 8px; width: 100%">
    <div style="font-size: 1.1rem; font-weight:550; margin-bottom: 8px">
        {LOCALIZATION_EN.CREATE}
    </div>
    <Input
            hasBorder="true"
            placeholder={LOCALIZATION_EN.PROJECT_NAME}
            onEnter={create}
            inputValue={input}
            width="100%"
            height={"30px"}
            directChange={v => input = v}
    />
</div>
<div class="footer">
    <button

            data-focusbutton="-"
            on:click={() => create(input)}
    >
        <Icon>check</Icon>
        {LOCALIZATION_EN.DONE}
    </button>
</div>

<style>

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

</style>