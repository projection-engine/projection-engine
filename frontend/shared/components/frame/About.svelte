<script>

    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import Modal from "../modal/Modal.svelte";

    export let handleClose
</script>

<Modal handleClose={handleClose} styles="width: clamp(250px, 25vw, 1000px); height: clamp(350px, 25vh, 1000px);">
    <div class="logo">
        <img draggable="false" alt={"logo"} src={"./APP_LOGO.png"} class="image"/>
        {LOCALIZATION_EN.PROJECTION_ENGINE}
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
</Modal>

<style>


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