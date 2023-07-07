<script lang="ts">

    import ProjectMetadata from "../static/ProjectMetadata";
    import Icon from "../../shared/components/icon/Icon.svelte";
    import Input from "../../shared/components/input/Input.svelte";
    import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem";
    import LocalizationEN from "../../../shared/enums/LocalizationEN";
    import FileTypes from "../../../shared/enums/FileTypes";
    import FileSystemUtil from "../../shared/FileSystemUtil";
    import StorageKeys from "../../../shared/enums/StorageKeys";

    export let close: Function
    export let setProjectsToShow: Function
    export let projectsToShow: ProjectMetadata[]
    let input

    const create = async (name: string) => {
        const projectID = crypto.randomUUID()
        const projectPath = localStorage.getItem(StorageKeys.ROOT_PATH) + FileSystemUtil.sep + projectID
        if (!FileSystemUtil.exists(FileSystemUtil.resolvePath(localStorage.getItem(StorageKeys.ROOT_PATH)))) {
            ToastNotificationSystem.getInstance().error("Directory not found, creating on root directory.")
            localStorage.setItem(StorageKeys.ROOT_PATH, FileSystemUtil.rootDir)
        }

        const err = await FileSystemUtil.mkdir(projectPath)
        const meta = {name: name, creationDate: (new Date()).toLocaleDateString()}
        if (!err)
            await FileSystemUtil.write(FileSystemUtil.resolvePath(projectPath + FileSystemUtil.sep + FileTypes.PROJECT), JSON.stringify(meta))

        setProjectsToShow([
            ...projectsToShow,
            {
                id: projectID,
                meta,
                path: FileSystemUtil.resolvePath(localStorage.getItem(StorageKeys.ROOT_PATH) + FileSystemUtil.sep + projectID)
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