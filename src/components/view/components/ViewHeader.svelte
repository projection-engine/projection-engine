
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
        background-color: var(--pj-background-secondary);
        padding: 0 2px;
        gap: 2px;

        overflow-y: hidden;
        overflow-x: auto;
        max-width: 100%;
    }

    fieldset {
        padding: 0;
        width: 100%;
    }
</style>