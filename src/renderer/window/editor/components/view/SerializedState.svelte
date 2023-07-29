<script lang="ts">
    import {getContext, onDestroy, onMount} from "svelte";
    import ViewStateStore from "../../../shared/stores/ViewStateStore";

    export let state: MutableObject
    export let onStateInitialize: GenericVoidFunctionWithP<MutableObject> | undefined
    export let onBeforeDestroy: GenericNonVoidFunction<MutableObject> | undefined
    let isInitialized = false
    const context = getContext<string>("viewMetadata")

    $: {
        if (isInitialized)
            ViewStateStore.updateViewState(context, state)
    }

    onMount(() => {
        ViewStateStore.onViewMount(context, (state) => {
            isInitialized = true
            onStateInitialize?.(state)
        })
    })
    onDestroy(() => {
        if(onBeforeDestroy) {
            ViewStateStore.onViewDestroy(context, onBeforeDestroy())
        }
    })
</script>

<slot/>
