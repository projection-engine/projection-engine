<script>
    import {onMount} from "svelte";
    import {KEYS} from "../../../public/engine/production";
    export let shortcut = []
    export let key

    let text = ""
    onMount(() => {
        if(!shortcut)
            return
        let str = ""
        for(let i =0; i < shortcut.length; i++){
            const current = shortcut[i]

            let c
            if(current === KEYS.ControlLeft || current === KEYS.ControlRight)
                c = "ctrl"
            else if(current === KEYS.ShiftLeft || current === KEYS.ShiftRight)
                c = "shift"

            else if(current === KEYS.AltLeft || current === KEYS.AltRight)
                c =  "alt"
            else
                c =  current.replace("Key", "")
            if(i > 0)
                str += (i === 1 ? " + " : "") + c + (i < shortcut.length -1 ? " + " : "")
            else
                str = c
        }

        text = str
    })
    $: label = key.replace("_", " ")
</script>

<div class="row">
    <b>{label}:</b>
    <small>{text}</small>
</div>


<style>
    .row{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2px;
    }
    b{
        font-size: .7rem;
        font-weight: 550;
        text-transform: capitalize;
    }
    small{
        font-size: .7rem;
    }
</style>