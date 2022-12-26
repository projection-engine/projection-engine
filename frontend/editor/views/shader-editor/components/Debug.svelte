<script>


    export let status
    let open = 0
</script>
<div class="contentWrapper">
    <div class="wrapper">
<!--        <Tabs open={open} setOpen={setOpen} styles={{padding: "4px"}}>-->
<!--            <Tab label={LOCALIZATION_EN.INFORMATION} class="content">-->
<!--                {#if status.info && status.info.length > 0}-->
<!--                    {#each status.info as s, i}-->
<!--                        <Accordion title={s?.label}>-->
<!--                            {s.apis}-->
<!--                        </Accordion>-->
<!--                    {/each}-->
<!--                {:else}-->
<!--                    <div class="empty">-->
<!--                        <icon styles="font-size: 90px">code</icon>-->
<!--                        {LOCALIZATION_EN.NEEDS_COMPILATION}-->
<!--                    </div>-->
<!--                {/if}-->
<!--            </Tab>-->
<!--            <Tab label={LOCALIZATION_EN.ERRORS} class="content">-->
<!--                {#if status.messages && status.messages.length > 0 }-->
<!--                    {#each status.messages as s, i}-->
<!--                        <Accordion title={s?.label}>-->
<!--                            {#each s.lines as l, i}-->
<!--                                <div class="row" style={{whiteSpace: "nowrap", overflowX: "auto"}}>-->
<!--                                    {l}-->
<!--                                </div>-->
<!--                                <div class="row" style={{background: "unset"}}>-->
<!--                                    {s.error}-->
<!--                                </div>-->
<!--                            {/each}-->
<!--                        </Accordion>-->
<!--                    {/each}-->
<!--                {:else}-->
<!--                    <div class="empty">-->
<!--                        <icon styles="font-size: 90px">-->
<!--                            {#if status.messages}-->
<!--                                check-->
<!--                            {:else}-->
<!--                                code-->
<!--                            {/if}-->
<!--                        </icon>-->
<!--                        {#if !status.messages}-->
<!--                            {LOCALIZATION_EN.NEEDS_COMPILATION}-->
<!--                        {:else}-->
<!--                            {LOCALIZATION_EN.NO_ERRORS}-->
<!--                        {/if}-->
<!--                    </div>-->
<!--                {/if}-->
<!--            </Tab>-->
<!--        </Tabs>-->
    </div>
</div>
