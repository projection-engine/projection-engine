<script>
    import Input from "../../../../../shared/components/input/Input.svelte";
    import Localization from "../../../../../shared/libs/Localization";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import {BundlerAPI} from "../../../../../../public/engine/production";

    export let initial
    export let isInput
    export let component
    export let submit

    let key = initial ? initial[0] : ""
    let value = initial ? initial[1] : ""
    const translate = key => Localization.PROJECT.INSPECTOR[key]
    const s = () => {
        const copy  = {...component.wrapperStyles}
        if (initial)
            delete copy[initial[0]]
        copy[key] = value
        submit(copy)
        if (isInput) {
            value = ""
            key = ""
        }
    }

    const clear = () => {
        const copy  = {...component.wrapperStyles}
        delete copy[key]
        submit(copy)
    }
</script>

<div class="input">
    <Input
            height="20px"
            width="fit-content"
            searchString={key} placeholder={translate("KEY")}
            setSearchString={v => key = v}
    />
    :
    <Input
            height="20px"
            width="fit-content"
            onEnter={v => {
                value = v
                s()
            }}
            searchString={value}
            placeholder={translate("VALUE")}
            setSearchString={v => value = v}
    />


    <button on:click={s}>
        <Icon>check</Icon>
    </button>
    {#if !isInput}
        <button on:click={clear}>
            <Icon>close</Icon>
        </button>
    {/if}
</div>

<style>
    button {
        border: none;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .input {
        display: flex;
        align-items: center;
        gap: 4px;
    }
</style>