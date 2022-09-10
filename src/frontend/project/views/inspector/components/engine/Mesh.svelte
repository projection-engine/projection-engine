<script>
    import Loader from "../../../../libs/loader/Loader"
    import Selector from "../../../../../components/selector/Selector.svelte";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";

    import getComponentIcon from "../../../../utils/get-component-icon";
    import COMPONENTS from "../../../../../../../public/engine/production/data/COMPONENTS";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import loadMaterial from "../../utils/load-material";
    import GPU from "../../../../../../../public/engine/production/GPU";


    export let component
    export let submit
    export let translate

    const loadMesh = async (src) => {
        if (!GPU.meshes.get(src.registryID))
            await Loader.load(src.registryID, true)
        submit(src.registryID, "meshID")
    }
</script>
<Accordion>
    <svelte:fragment slot="header">
        <div class="icon">
            <Icon styles="font-size: .9rem">
                {getComponentIcon(COMPONENTS.MESH, component)}
            </Icon>
        </div>
        {translate("MESH")}
    </svelte:fragment>
    <Selector
            selected={component.meshID}
            type={"mesh"}
            handleChange={loadMesh}
    />
    <Selector
            selected={component.materialID}
            type={"material"}
            handleChange={async src => loadMaterial(src?.registryID, submit)}
    />

</Accordion>

<style>
    .icon {
        width: 17px;
        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>