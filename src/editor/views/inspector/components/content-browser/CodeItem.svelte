<script>
    import Localization from "../../../../../shared/libs/Localization";

    export let data
</script>

<fieldset>
    <legend>{Localization.PROJECT.INSPECTOR.CODE_PREVIEW}</legend>
    <pre>{data}</pre>
</fieldset>
<style>
    pre {
        vertical-align: top;
        padding: 4px;
        margin: 0;
        font-size: .7rem;
        overflow: auto;
        max-width: 100%;
        color: var(--pj-color-tertiary);
        border-radius: 3px;
        border: var(--pj-border-primary) 1px solid;
        background: var(--pj-background-secondary)
    }

</style>
