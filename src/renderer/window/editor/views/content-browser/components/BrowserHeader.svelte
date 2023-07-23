<script>


    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
</script>

<div class="wrapper">
    <small class="section" style="border-right: var(--pj-border-primary) 1px solid">
        {LocalizationEN.NAME}
    </small>
    <small class="section" style="border-right: var(--pj-border-primary) 1px solid">
        {LocalizationEN.CREATION}

    </small>
    <small class="section">
        {LocalizationEN.SIZE}

    </small>
</div>

<style>
    small {
        font-size: .7rem;
    }

    .section {
        padding-left: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section:hover {
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
