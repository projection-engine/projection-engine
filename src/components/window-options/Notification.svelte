<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";

    export let item
</script>

<div class="wrapper">
    <div class="icon">
        <Icon styles={`color: ${item.variant?.color}`}>
            {item.variant?.icon}
        </Icon>
    </div>
    <small data-overflow="-">
        {item.message}
    </small>
</div>

<style>
    .wrapper{
        display: flex;
        align-items: center;
        height: 20px;
        border-bottom: var(--pj-border-primary) 1px solid;
    }
    .icon{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
    }
</style>