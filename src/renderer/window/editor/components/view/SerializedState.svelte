<script lang="ts">
    import {getContext, onDestroy, onMount} from "svelte";
    import ViewStateStore from "../../../shared/stores/ViewStateStore";
    import ViewMetadataContext from "./static/ViewMetadataContext";

    export let state: MutableObject
    export let onStateInitialize: GenericVoidFunctionWithP<MutableObject> | undefined
    export let onBeforeDestroy: GenericNonVoidFunction<MutableObject> | undefined
    let isInitialized = false

    $: {
        if (isInitialized)
            ViewStateStore.updateViewState(getContext<string>(ViewMetadataContext), state)
    }

    onMount(() => {
        ViewStateStore.onViewMount(getContext<string>(ViewMetadataContext), (state) => {
            isInitialized = true
            onStateInitialize?.(state)
        })
    })
    onDestroy(() => {
        if(onBeforeDestroy)
        ViewStateStore.onViewDestroy(getContext<string>(ViewMetadataContext), onBeforeDestroy())
    })
</script>
