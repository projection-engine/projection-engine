<script>
    import EnglishLocalization from "../../../../../static/EnglishLocalization";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";

    export let translate
    export let status
    let open = 0
</script>
<div class="contentWrapper">
    <div class="wrapper">
<!--        <Tabs open={open} setOpen={setOpen} styles={{padding: "4px"}}>-->
<!--            <Tab label={translate("INFORMATION")} class="content">-->
<!--                {#if status.info && status.info.length > 0}-->
<!--                    {#each status.info as s, i}-->
<!--                        <Accordion title={s?.label}>-->
<!--                            {s.data}-->
<!--                        </Accordion>-->
<!--                    {/each}-->
<!--                {:else}-->
<!--                    <div class="empty">-->
<!--                        <Icon styles="font-size: 90px">code</Icon>-->
<!--                        {translate("NEEDS_COMPILATION")}-->
<!--                    </div>-->
<!--                {/if}-->
<!--            </Tab>-->
<!--            <Tab label={translate("ERRORS")} class="content">-->
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
<!--                        <Icon styles="font-size: 90px">-->
<!--                            {#if status.messages}-->
<!--                                check-->
<!--                            {:else}-->
<!--                                code-->
<!--                            {/if}-->
<!--                        </Icon>-->
<!--                        {#if !status.messages}-->
<!--                            {translate("NEEDS_COMPILATION")}-->
<!--                        {:else}-->
<!--                            {translate("NO_ERRORS")}-->
<!--                        {/if}-->
<!--                    </div>-->
<!--                {/if}-->
<!--            </Tab>-->
<!--        </Tabs>-->
    </div>
</div>
