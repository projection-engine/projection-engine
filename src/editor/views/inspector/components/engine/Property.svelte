<script>

    import Range from "../../../../../shared/components/range/Range.svelte";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";
    import Input from "../../../../../shared/components/input/Input.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import Component from "../../../../../../public/engine/production/components/Component";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import EngineStore from "../../../../stores/EngineStore";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import Localization from "../../../../../shared/libs/Localization";
    import loadMaterial from "../../utils/load-material";
    import GPU from "../../../../../../public/engine/production/GPU";
    import Loader from "../../../../libs/loader/Loader";

    export let component = undefined
    export let submit = undefined
    export let translate = undefined
    export let attribute = undefined

    $: label = translate(attribute.label) ? translate(attribute.label) : attribute.label
    $: value = component[attribute.key]
    $: isDisabled = typeof attribute.disabledIf === "function" ? attribute.disabledIf(component) : component[attribute.disabledIf]

    let firstSubmit = false
    const setImage = async ({registryID}) => {
        const res = await EngineStore.loadTextureFromImageID(registryID)
        if (res)
            submit(attribute.key, registryID, true)
    }
    let originalValue

    $: {
        if (attribute.type === Component.propTypes.ARRAY && value != null && !originalValue) {
            const temp = []
            for (let i = 0; i < value.length; i++) {
                temp[i] = value[i]
            }
            originalValue = temp
        }
    }
    const loadMesh = async (src) => {
        if (!GPU.meshes.get(src.registryID))
            await Loader.load(src.registryID, true)
        submit(attribute.key, src.registryID, true)
    }
</script>


{#if attribute.type === Component.propTypes.NUMBER}
    <Range
            handleChange={v => {
                if(!firstSubmit){
                    firstSubmit = true
                    submit(attribute.key, v)
                    return
                }
                submit(attribute.key, v)
            }}
            variant="embedded"
            onFinish={v => submit(attribute.key, v, true)}
            minValue={attribute.min}
            maxValue={attribute.max}
            integer={attribute.increment === 1}
            incrementPercentage={attribute.increment}
            label={label}
            value={value}
            isAngle={attribute.isAngle}
            disabled={isDisabled}
    />
{:else if attribute.type === Component.propTypes.ARRAY}

    <div class="inline-vector">
        {#each attribute.labels as partial, index}
            <Range
                    noOriginal={true}
                    disabled={isDisabled}
                    isAngle={attribute.isAngle}
                    handleChange={v => {
                        value[index] = v

                        if(!firstSubmit){
                            firstSubmit = true
                            submit(attribute.key, value)
                            return
                        }
                        submit(attribute.key, value)
                    }}
                    onFinish={v => {
                            value[index] = v
                            submit(attribute.key, value, true)
                    }}
                    minValue={attribute.min}
                    maxValue={attribute.max}

                    label={partial}
                    variant="embedded"
                    value={value[index]}
            />
        {/each}
        <button class="reset-button" on:click={() => {
                 for(let i =0; i < originalValue.length; i++){
                     value[i] = originalValue[i]
                 }

            submit(attribute.key, value, true)
        }}>
            <Icon styles="font-size: .9rem">undo</Icon>
            <ToolTip content={Localization.COMPONENTS.RANGE.UNDO}/>
        </button>
    </div>

{:else if attribute.type === Component.propTypes.BOOLEAN}
    <Checkbox
            handleCheck={() => submit(attribute.key, !value, true)}
            label={label}
            checked={value}
            disabled={isDisabled}
    />
{:else if attribute.type === Component.propTypes.OPTIONS}
    <Dropdown disabled={isDisabled} width="100%">
        <button slot="button" disabled={isDisabled} class="dropdown">
            {label}
        </button>
        {#each attribute.options as option}
            <button on:click={() =>  submit(attribute.key, option.value, true)}>
                {#if translate(option.label)}
                    {translate(option.label)}
                {:else}
                    {option.label}
                {/if}
            </button>
        {/each}
    </Dropdown>
{:else if attribute.type === Component.propTypes.STRING}
    <Input
            searchString={value}
            setSearchString={v => submit(attribute.key, v, true)}
            onEnter={v => submit(attribute.key, v, true)}
            onBlur={(_,v) => submit(attribute.key, v, true)}
            placeholder={label}
            disabled={isDisabled}
    />
{:else if attribute.type === Component.propTypes.COLOR}
    <ColorPicker
            disabled={isDisabled}
            submit={({r,g,b}) => submit(attribute.key, [r, g, b], true)}
            label={label}
            value={value}
            size={"small"}
    />
{:else if attribute.type === Component.propTypes.IMAGE}
    <Selector
            handleChange={setImage}
            type="image"
            selected={value}
    />
{:else if attribute.type === Component.propTypes.MATERIAL}
    <Selector
            selected={value}
            type="material"
            handleChange={async src => loadMaterial(src?.registryID, (key) => submit(attribute.key, key, true))}
    />
{:else if attribute.type === Component.propTypes.MESH}
    <Selector
            handleChange={loadMesh}
            type="mesh"
            selected={value}
    />
{/if}


<style>
    .inline-vector {
        display: flex;
        gap: 2px;
        width: 100%;
        align-items: center;
    }

    .dropdown {
        height: 25px;
        width: 100%;
        border: none;
    }

    .reset-button {
        border: none;
        min-width: 17px;
        min-height: 17px;
        max-width: 17px;
        max-height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;
    }
</style>