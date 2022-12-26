<script lang="ts">

    import {v4} from "uuid";
    import BASE_PATH from "../static/BASE_PATH";
    import ProjectMetadata from "../static/ProjectMetadata";
    import NodeFS from "../../lib/FS/NodeFS";
    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import PROJECT_STATIC_DATA from "../../../static/objects/PROJECT_STATIC_DATA";
    import Icon from "../../components/icon/Icon.svelte";
    import Input from "../../components/input/Input.svelte";
    import AlertController from "../../components/alert/AlertController";

    export let close: Function
    export let setProjectsToShow: Function
    export let projectsToShow: ProjectMetadata[]
    let input

    const create = async (name: string) => {
        const projectID = v4()
        const projectPath = localStorage.getItem(BASE_PATH) + NodeFS.sep + projectID
        if (!NodeFS.exists(NodeFS.resolvePath(localStorage.getItem(BASE_PATH)))) {
            AlertController.error("Directory not found, creating on root directory.")
            localStorage.setItem(BASE_PATH, NodeFS.rootDir)
        }

        const err = await NodeFS.mkdir(projectPath)
        const meta = {name: name, creationDate: (new Date()).toLocaleDateString()}
        if (!err)
            await NodeFS.write(NodeFS.resolvePath(projectPath + NodeFS.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION), JSON.stringify(meta))

        setProjectsToShow([
            ...projectsToShow,
            {
                id: projectID,
                meta,
                path: NodeFS.resolvePath(localStorage.getItem(BASE_PATH) + NodeFS.sep + projectID)
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