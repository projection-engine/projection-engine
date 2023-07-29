<script lang="ts">
    import {getContext, onDestroy, onMount} from "svelte";
    import ViewStateStore from "../../../shared/stores/ViewStateStore";
    import ViewMetadataContext from "./static/ViewMetadataContext";

    export let state: MutableObject
    export let onStateInitialize: GenericVoidFunctionWithP<MutableObject> | undefined
    export let onBeforeDestroy: GenericNonVoidFunction<MutableObject> | undefined
    let isInitialized = false
    const context = getContext<string>(ViewMetadataContext)

    $: {
        if (isInitialized) {
            ViewStateStore.updateViewState(context, state)
        }
    }

    onMount(() => {
        ViewStateStore.onViewMount(context, onStateInitialize)
        isInitialized = true
    })
    onDestroy(() => {
        if(onBeforeDestroy) {
            ViewStateStore.onViewDestroy(context, onBeforeDestroy())
        }
    })
</script>
