<script>
    import TrafficLights from "./TrafficLights.svelte"
    import Logo from "./Logo.svelte"

    export let noChangeTracking
</script>

<div class="container">
    <Logo/>
    <slot/>
    <div class="draggable"></div>
    <TrafficLights noChangeTracking={noChangeTracking}/>
</div>

<style>
    .draggable{
        width: 100%;
        height: 30px;
        -webkit-app-region: drag;
    }
    .container {
        border-bottom: var(--pj-border-primary) 1px solid;
        min-height: 30px;
        max-height: 30px;
        width: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 0 2px;
    }
</style>