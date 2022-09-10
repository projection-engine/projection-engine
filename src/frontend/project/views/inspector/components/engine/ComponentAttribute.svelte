<script>

    import Range from "../../../../../components/range/Range.svelte";
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import ColorPicker from "../../../../../components/color-picker/ColorPicker.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Component from "../../../../../../../public/engine/production/components/Component";
    import Selector from "../../../../../components/selector/Selector.svelte";
    import EngineStore from "../../../../stores/EngineStore";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Localization from "../../../../../libs/Localization";

    export let component = undefined
    export let submit = undefined
    export let translate = undefined
    export let attribute = undefined

    const toDeg = 180 / Math.PI, toRad = Math.PI / 180


    $: label = translate(attribute.label) ? translate(attribute.label) : attribute.label
    $: value = component[attribute.key]
    $: isDisabled = component[attribute.disabledIf]

    let firstSubmit = false
    const setImage = async ({registryID}) => {
        const res = await EngineStore.loadTextureFromImageID(registryID)
        if (res)
            submit(attribute.key, registryID, true)
    }
    let originalValue

    $: {
        if (attribute.type === Component.propTypes.ARRAY && value != null && !originalValue)
            originalValue = [...value]
    }
    $: console.log(originalValue)
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
                        const newData = [...value]
                        newData[index] = v

                        if(!firstSubmit){
                            firstSubmit = true
                            submit(attribute.key, newData)
                            return
                        }
                        submit(attribute.key, newData)
                    }}
                    onFinish={v => {
                          const newData = [...value]
                            newData[index] = v
                            submit(attribute.key, newData, true)
                    }}
                    minValue={attribute.min}
                    maxValue={attribute.max}
                    label={partial}
                    variant="embedded"
                    value={value[index]}
            />
        {/each}
        <button class="reset-button" on:click={() => submit(attribute.key, originalValue, true)}>
            <Icon styles="font-size: .9rem">undo</Icon>
            <ToolTip content={Localization.COMPONENTS.RANGE.UNDO}/>
        </button>
    </div>

{:else if attribute.type === Component.propTypes.BOOLEAN}
    <Checkbox
            handleCheck={() => {
                if(!firstSubmit){
                    firstSubmit = true
                    submit(attribute.key, !value)
                    return
                }
                submit(attribute.key, !value, true)

            }}
            label={label}
            checked={value}
            disabled={isDisabled}
    />
{:else if attribute.type === Component.propTypes.OPTIONS}
    <Dropdown disabled={isDisabled} width="100%">
        <button slot="button" class="dropdown">
            {label}
        </button>
        {#each attribute.options as option}
            <button on:click={() =>  {
               if(!firstSubmit){
                    firstSubmit = true
                    submit(attribute.key, option.value)
                    return
                }
                submit(attribute.key, option.value, true)
            }}>
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
            setSearchString={v =>  {
                if(!firstSubmit){
                    firstSubmit = true
                    submit(attribute.key, v)
                    return
                }
                submit(attribute.key, v, true)
            }}
            placeholder={label}
            disabled={isDisabled}
    />
{:else if attribute.type === Component.propTypes.COLOR}
    <ColorPicker
            disabled={isDisabled}
            submit={({r,g,b}) =>  {
                if(!firstSubmit){
                    firstSubmit = true
                    submit(attribute.key, [r, g, b])
                    return
                }
                submit(attribute.key, [r, g, b], true)
            }}
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
    .reset-button{
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