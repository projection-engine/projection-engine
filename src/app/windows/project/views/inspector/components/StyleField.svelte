<script>
    import Input from "../../../../../components/input/Input.svelte";
    import Localization from "../../../../../libs/Localization";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import UIStoreController from "../../../stores/UIStoreController";

    export let initial
    export let selected

    let key = initial ? initial[0] : ""
    let value = initial ? initial[1] : ""
    const translate = key => Localization.PROJECT.UI[key]
    const submit = () => {
        selected.styles[key] = value
        UIStoreController.updateStore()
        if (!initial) {
            value = ""
            key = ""
        }
    }
</script>

<div class="input">
    <Input height="20px" width="fit-content" searchString={key} placeholder={translate("KEY")}
           setSearchString={v => key = v}/>
    :
    <Input
            height="20px"
            width="fit-content"
            onEnter={v => {
                value = v
                submit()
            }}
            searchString={value}
            placeholder={translate("VALUE")}
            setSearchString={v => value = v}
    />

    <button on:click={() => {
            delete selected.styles[key]
            UIStoreController.updateStore()
        }}>
        <Icon>close</Icon>
    </button>
    <button on:click={submit}>
        <Icon>check</Icon>
    </button>
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