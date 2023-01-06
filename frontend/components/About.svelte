<script>
    import {onDestroy, onMount} from "svelte";

    import Portal from "../lib/Portal";
    import LOCALIZATION_EN from "../views/editor/static/LOCALIZATION_EN";

    export let handleClose
    let content

    function handler(event) {
        if (!content.contains(event.target)) {
            handleClose()
            content.style.display = "none"
            content.style.zIndex = "-1"
        }
    }

    const portal = new Portal(999)
    onMount(() => {
        portal.create(content, {backdropFilter: "blur(2px)", brightness: "98%"})
        portal.open()
        document.addEventListener("mousedown", handler)
    })
    onDestroy(() => {
        portal.close()
        document.removeEventListener("mousedown", handler)
    })
</script>

<div class="content" bind:this={content}>
    <div class="logo">
        <img draggable="false" alt={"logo"} src={"./APP_LOGO.png"} class="image"/>
        {LOCALIZATION_EN.ABOUT}
        <div class="info">
            {LOCALIZATION_EN.VERSION}
        </div>
    </div>

    <div>
        <div class="info">
            {LOCALIZATION_EN.FOOTER}
        </div>

        <div class="info">
            {LOCALIZATION_EN.LICENSE}
        </div>
        <br>
        <div class="info">
            {LOCALIZATION_EN.COPYRIGHT}
        </div>
    </div>
</div>

<style>
    .content {
        padding: 4px 8px;
        position: fixed;
        z-index: 999;
        width: clamp(250px, 25vw, 1000px);
        height: clamp(350px, 25vh, 1000px);
        background: var(--pj-background-secondary);
        border: var(--pj-border-primary) 1px solid;
        border-radius: 5px;

        box-shadow: var(--pj-boxshadow);

        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);

        display: grid;
        justify-content: center;
        justify-items: center;
        align-items: center;
    }

    .info {
        font-weight: normal;
        text-align: center;
        font-size: .75rem;
    }

    .image {
        width: clamp(75px, 10vw, 350px);
        border-radius: 5px;
    }

    .logo {
        display: grid;
        align-items: flex-start;
        justify-items: center;
        text-align: center;

        gap: 4px;
        width: fit-content;
        font-weight: 550;

        font-size: 1.2rem;
    }


</style>