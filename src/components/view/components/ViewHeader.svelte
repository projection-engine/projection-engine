
<div class="header">
    <slot/>
</div>

<style>
    small {
        font-size: .7rem;
    }
    .header {
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
        align-content: center;
        width: 100%;
        min-height: 28px;
        max-height: 28px;
        background: var(--pj-background-quaternary);
        padding: 0 2px;
        gap: 2px;

        overflow-y: hidden;
        overflow-x: auto;
        max-width: 100%;
        border-bottom: var(--pj-border-primary) 1px solid;
    }

    fieldset {
        padding: 0;
        width: 100%;
    }
</style>