<script>
    import Localization from "../../../../libs/libs/Localization";

    export let data
</script>

<fieldset>
    <legend>{Localization.PROJECT.INSPECTOR.CODE_PREVIEW}</legend>
    <pre data-pre="-">{data}</pre>
</fieldset>
<style>
    pre {
        border-radius: 3px;
        border: var(--pj-border-primary) 1px solid;
        background: var(--pj-background-secondary);
    }

</style>
