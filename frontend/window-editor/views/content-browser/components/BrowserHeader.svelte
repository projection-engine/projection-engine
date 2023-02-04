<script>
    import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";

    export let sort

</script>

<div class="wrapper">
    <small class="section" style="border-right: var(--pj-border-primary) 1px solid">
        {LOCALIZATION_EN.NAME}
    </small>
    <small class="section" style="border-right: var(--pj-border-primary) 1px solid">
        {LOCALIZATION_EN.CREATION}

    </small>
    <small class="section">
        {LOCALIZATION_EN.SIZE}

    </small>
</div>

<style>
    small{
        font-size: .7rem;
    }
    .section {
        padding-left: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .section:hover{
        color: var(--pj-accent-color);
    }

    .wrapper {
        height: 23px;

        border-bottom: var(--pj-border-primary) 1px solid;
        display: grid;
        align-items: center;
        grid-auto-flow: column;
        grid-template-columns: 80% 10% 10%;

    }
</style>