<script lang="ts">

    import ProjectMetadata from "../static/ProjectMetadata";
    import FileSystemService from "../../shared/lib/FileSystemService";

    import Icon from "../../shared/components/icon/Icon.svelte";
    import Input from "../../shared/components/input/Input.svelte";
    import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem";
    import {STORAGE_KEYS} from "../../shared/static/STORAGE_KEYS";
    import LocalizationEN from "../../../shared/LocalizationEN";
    import FileTypes from "../../../shared/FileTypes";

    export let close: Function
    export let setProjectsToShow: Function
    export let projectsToShow: ProjectMetadata[]
    let input

    const create = async (name: string) => {
        const projectID = crypto.randomUUID()
        const projectPath = localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FileSystemService.getInstance().sep + projectID
        if (!FileSystemService.getInstance().exists(FileSystemService.getInstance().resolvePath(localStorage.getItem(STORAGE_KEYS.ROOT_PATH)))) {
            ToastNotificationSystem.getInstance().error("Directory not found, creating on root directory.")
            localStorage.setItem(STORAGE_KEYS.ROOT_PATH, FileSystemService.getInstance().rootDir)
        }

        const err = await FileSystemService.getInstance().mkdir(projectPath)
        const meta = {name: name, creationDate: (new Date()).toLocaleDateString()}
        if (!err)
            await FileSystemService.getInstance().write(FileSystemService.getInstance().resolvePath(projectPath + FileSystemService.getInstance().sep + FileTypes.PROJECT), JSON.stringify(meta))

        setProjectsToShow([
            ...projectsToShow,
            {
                id: projectID,
                meta,
                path: FileSystemService.getInstance().resolvePath(localStorage.getItem(STORAGE_KEYS.ROOT_PATH) + FileSystemService.getInstance().sep + projectID)
            }
        ])

        ToastNotificationSystem.getInstance().success(LocalizationEN.PROJECT_CREATED)
        close()
        input = ""
    }

</script>


<div style="padding: 8px; width: 100%">
    <div style="font-size: 1.1rem; font-weight:550; margin-bottom: 8px">
        {LocalizationEN.CREATE}
    </div>
    <Input
            hasBorder="true"
            placeholder={LocalizationEN.PROJECT_NAME}
            onEnter={create}
            inputValue={input}
            width="100%"
            height={"30px"}
            directChange={v => input = v}
    />
</div>
<div class="footer">
    <button data-sveltebuttondefault="-"

            data-sveltefocusbutton="-"
            on:click={() => create(input)}
    >
        <Icon>check</Icon>
        {LocalizationEN.DONE}
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