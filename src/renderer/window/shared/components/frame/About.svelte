<script>
    import Modal from "../modal/Modal.svelte"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"

    export let handleClose
</script>

<Modal handleClose={handleClose} styles="width: clamp(250px, 25vw, 1000px); height: clamp(350px, 25vh, 1000px);">
    <div class="logo">
        <img draggable="false" alt={"logo"} src={"./APP_LOGO.png"} class="image"/>
        {LocalizationEN.PROJECTION_ENGINE}
        <div class="info">
            {LocalizationEN.VERSION}
        </div>
    </div>

    <div>
        <div class="info">
            {LocalizationEN.FOOTER}
        </div>

        <div class="info">
            {LocalizationEN.LICENSE}
        </div>
        <br>
        <div class="info">
            {LocalizationEN.COPYRIGHT}
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


        font-size: 1.2rem;
    }


</style>