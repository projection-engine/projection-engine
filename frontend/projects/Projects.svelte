<script>
    import Projects from "./components/Projects.svelte";
</script>

<div class="wrapper">
    <div class="tab">
        <Projects/>
    </div>
</div>


<style>
    .tab {
        width: 100%;
        position: relative;
        overflow: hidden;
        height: 100%;
        padding: 16px 5% 4px;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 4px;
    }

    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        position: relative;
        background-color: var(--pj-background-tertiary);
    }


</style>