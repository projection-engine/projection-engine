<script>
    import Loader from "../../../libs/loader/Loader"
    import Selector from "../../../../../components/selector/Selector.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";

    import getComponentIcon from "../../../utils/get-component-icon";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import loadMaterial from "../utils/load-material";
    import RendererController from "../../../libs/engine/RendererController";


    export let selected
    export let submit
    export let translate

    const loadMesh = async (src) => {

        if (!RendererController.meshes.get(src.registryID))
            await Loader.load(src.registryID, true)
        submit(src.registryID, "meshID")
    }
</script>
<Accordion>
    <svelte:fragment slot="header">
        <div class="icon">
            <Icon styles="font-size: .9rem">
                {getComponentIcon(COMPONENTS.MESH, selected)}
            </Icon>
        </div>
        {translate("MESH")}
    </svelte:fragment>
    <Selector
            selected={selected.meshID}
            type={"mesh"}
            handleChange={loadMesh}
    />
    <Selector
            selected={selected.materialID}
            type={"material"}
            handleChange={async src => loadMaterial(src?.registryID, submit)}
    />

</Accordion>

<style>
    .icon {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>