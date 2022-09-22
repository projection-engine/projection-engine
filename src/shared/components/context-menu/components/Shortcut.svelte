<script>
    import {onMount} from "svelte";
    import {KEYS} from "../../../../../public/engine/production";

    export let shortcut = []
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
</script>

{#if shortcut}
    <div class="shortcut">
        {text}
    </div>
{/if}
<style>

    .shortcut {
        text-transform: capitalize;
        text-align: right;
        width: 100%;
        color: #999;
        font-weight: 550;
        font-size: 0.65rem;
    }

</style>