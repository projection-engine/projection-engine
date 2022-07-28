<script>
    import FileSystem from "../../../libs/FileSystem"
    import handleDrop from "../../../libs/importer/import"
    import {DATA_TYPES} from "../../../libs/engine/data/DATA_TYPES";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Range from "../../../../../components/range/Range.svelte";
    import TextureInstance from "../../../libs/engine/instances/TextureInstance";

    export let engine
    export let entityID
    export let selected
    export let submit

    let state = {}
    let lastID
    const quickAccess = useContext(QuickAccessProvider)

    $: {
        const newState = {}
        if (!lastID || lastID !== entityID) {
            newState.currentMesh = quickAccess.meshes.find(mesh => mesh.registryID === selected.meshID)
            lastID = entityID
            const matSelected = engine.materials.find(m => m.id === selected.materialID)

            newState.overrideMaterial = selected.overrideMaterial

            newState.uniforms = matSelected && matSelected.uniforms ? matSelected.uniforms.map(u => {
                return {...u, value: selected.uniformValues[u.key]}
            }) : []
            newState.currentMaterial = quickAccess.materials.find(i => i.registryID === selected.materialID)
            state = newState
        }
    }

    const loadFile = async (src, type = "json") => {
        const rs = await window.fileSystem.readRegistryFile(src.registryID)
        if (rs) {
            const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + rs.path, type)
            if (file)
                return file
            else {
                alert.pushAlert("error",
                    "Error loading file."
                )
                return null
            }
        }
    }
    const updateUniforms = (key, value, obj, submit, submitUniformList) => {
        const index = state.uniforms.findIndex(u => u.key === key)
        if (index > -1) {
            const copy = [...state.uniforms]
            copy[index] = {...obj, value}

            state.uniforms = copy
            if (submit) {
                const values = {}
                copy.forEach(c => {
                    if (c.type !== DATA_TYPES.TEXTURE)
                        values[c.key] = c.value
                })

                submit(values, "uniformValues")
            }

            if (submitUniformList)
                submit(copy, "uniforms")
        }
    }
</script>

<Selector
        selected={state.currentMesh}
        type={"mesh"}
        handleChange={(src) => {
            let data = window.renderer.meshes.get(src.registryID)
            if (!data)
                handleDrop(src.registryID,   engine,  true)
                    .then(() => {
                        submit(src.registryID, "meshID")
                    })
            else {
                submit(src.registryID, "meshID")
            }
        }}
/>
<Selector
        selected={state.currentMaterial}
        type={"material"}
        handleChange={async (src, clear, close) => {
            if (src) {
                const file = await loadFile(src)
                if (file && file.response) {
                    submit({
                        blob: file.response,
                        id: src.registryID,
                        name: src.name
                    })
                    alert.pushAlert("Mesh loaded", "success")
                    state.uniforms = file.response.uniforms
                    state.currentMaterial = src
                }
                else {
                    alert.pushAlert("Error loading material", "error")
                    clear()
                }
            } else {
                submit()
                clear()
                close()
            }
        }}
/>
{#if state.uniforms?.length > 0}
    <Checkbox
            noMargin={true}
            label={"Override material uniforms"}
            width={"100%"}
            height={"25px"}
            checked={state.overrideMaterial}
            handleCheck={() => {
                const s = !state.overrideMaterial
                state.overrideMaterial = s
                submit(s, "overrideMaterial")
            }} styles={{background: "var(--pj-border-primary)"}}
    />
{/if}
{#if state.overrideMaterial && state.uniforms}
    <div class="divider"></div>
{/if}
{#if state.overrideMaterial && state.uniforms}
    {#each state.uniforms as u, i}
        <Accordion title={u.label}>
            {#if u.type === DATA_TYPES.INT || u.type === DATA_TYPES.FLOAT}
                return (
                <Range
                        precision={u.type === DATA_TYPES.FLOAT ? 3 : 0}
                        maxValue={u.max}
                        incrementPercentage={u.type === DATA_TYPES.FLOAT ? .001 : 1}
                        minValue={u.min}
                        value={u.value ? u.value : 0}
                        onFinish={(v) => updateUniforms(u.key, v, u, true)}
                        handleChange={v => updateUniforms(u.key, v, u, false)}
                        label={u.label}
                />
                )
            {:else if type === DATA_TYPES.VEC3}
                {#if !u.normalized}

                    <div class="formWrapper">
                        <Range
                                accentColor={"red"}
                                maxValue={u.max}
                                minValue={u.min}
                                onFinish={(v) => updateUniforms(u.key, [parseFloat(v), u.value[1], u.value[2]], obj, true)}
                                handleChange={v => updateUniforms(u.key, [parseFloat(v), u.value[1], u.value[2]], obj, false)}
                                value={u.value ? u.value[0] : 0}

                                label={"X"}
                        />
                        <Range
                                accentColor={"green"}
                                onFinish={(v) => updateUniforms(u.key, [u.value[0], parseFloat(v), u.value[2]], obj, true)}
                                handleChange={v => updateUniforms(u.key, [u.value[0], parseFloat(v), u.value[2]], obj, false)}
                                value={u.value ? u.value[1] : 0}

                                label={"Y"}
                        />
                        <Range
                                accentColor={"blue"}
                                maxValue={u.max}
                                minValue={u.min}
                                onFinish={(v) => updateUniforms(u.key, [u.value[0], u.value[1], parseFloat(v)], obj, true)}
                                handleChange={v => updateUniforms(u.key, [u.value[0], u.value[1], parseFloat(v)], obj, false)}
                                value={u.value ? u.value[2] : 0}

                                label={"Z"}
                        />
                    </div>
                {:else}
                    <ColorPicker
                            submit={(_, v) => updateUniforms(u.key, v.map(vv => vv / 255), obj, true)}
                            value={!u.value ? "rgb(0,0,0)" : `rgb(${u.value[0] * 255},${u.value[1] * 255},${u.value[2] * 255})`}
                    />
                {/if}

            {:else if type === DATA_TYPES.TEXTURE}

                <Selector
                        type={"image"}
                        findData={true}
                        handleChange={async src => {
                            if (src) {
                                const k = u.format
                                const file = await loadFile(src, "string")
                                if (file) {
                                    let texture
                                    await new Promise(resolve => {
                                        texture = new TextureInstance(
                                            file,
                                            k.yFlip,

                                            window.gpu[k.internalFormat],
                                            window.gpu[k.format],
                                            true,
                                            false,
                                            window.gpu.UNSIGNED_BYTE,
                                            undefined,
                                            undefined,
                                            0,
                                            () => {
                                                resolve()
                                            }
                                        )
                                    })

                                    let index = state.uniforms.findIndex(u => u.key === u.key)
                                    if (index > -1) {
                                        const copy = [...state.uniforms]
                                        copy[index] = {...u, value: src.registryID}

                                        state.uniforms = copy

                                        const values = {}
                                        copy.forEach(c => {
                                            if (c.type !== DATA_TYPES.TEXTURE)
                                                values[c.key] = c.value
                                            else if (c.key === u.key)
                                                values[c.key] = texture.texture
                                        })

                                        index = state.uniforms.findIndex(u => u.key === u.key)
                                        if (index > -1) {
                                            const copy = [...state.uniforms]
                                            copy[index] = {...u, value: src.registryID, modified: true}

                                            state.uniforms = copy
                                            submit(copy, "uniforms")
                                        }
                                        submit(values, "uniformValues")
                                    }

                                }
                            }
                        }}
                        selected={u.value}
                />
            {/if}
        </Accordion>
    {/each}
{/if}
