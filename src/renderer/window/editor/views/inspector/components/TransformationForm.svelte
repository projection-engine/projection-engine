<script lang="ts">
    import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore"
    import {Components, TransformationRotationTypes,} from "@engine-core/engine.enum";
    import {onDestroy, onMount} from "svelte"
    import Checkbox from "../../../../shared/components/checkbox/Checkbox.svelte"
    import EditorActionHistory from "../../../services/EditorActionHistory"
    import Range from "../../../../shared/components/range/Range.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import Accordion from "../../../../shared/components/accordion/Accordion.svelte"
    import ROTATION_TYPES from "../static/ROTATION_TYPES"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import EmptyIcon from "../../../../shared/components/icon/EmptyIcon.svelte"
    import EngineToolsState from "../../../../../engine/tools/EngineToolsState";
    import EditorEntityManager from "../../../../../engine/tools/EditorEntityManager";
    import EditorEntity from "../../../../../engine/tools/EditorEntity";
    import EntityManager from "@engine-core/managers/EntityManager";
    import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
    import UUIDGen from "../../../../../../shared/UUIDGen";

    const COMPONENT_ID = UUIDGen()
    let targets: EditorEntity[] = []
    let rotationType = TransformationRotationTypes.ROTATION_QUATERNION
    let totalTranslated = [0, 0, 0]
    let totalScaled = [0, 0, 0]
    let totalPivot = [0, 0, 0]
    let mainEntity: EditorEntity
    let mainEntityTransformationComponent: TransformationComponent
    let isSingle: boolean
    let lockedRotation: boolean
    let lockedTranslation: boolean
    let lockedScaling: boolean
    let hasStarted = false
    let lockedCache = [false, false, false]

    onMount(() => {
        EntitySelectionStore.getInstance().addListener(COMPONENT_ID, () => {
            const cache: EditorEntity[] = []
            const entitiesSelected = EntitySelectionStore.getEntitiesSelected()
            for (let i = 0; i < entitiesSelected.length; i++) {
                const currentEntity = EditorEntityManager.getEntity(entitiesSelected[i])
                if (currentEntity != null && currentEntity.hasComponent(Components.TRANSFORMATION)) {
                    cache.push(currentEntity)
                    currentEntity.__originalTranslation = undefined
                    currentEntity.__originalPivot = undefined
                    currentEntity.__originalScaling = undefined
                    currentEntity.__originalQuat = undefined
                }
            }
            if (cache.length === 0) {
                const fallback = EditorEntityManager.getEntity(EntitySelectionStore.getMainEntity())
                if (fallback && EntityManager.hasComponent(fallback.id, Components.TRANSFORMATION)) {
                    fallback.__originalQuat = undefined
                    cache.push(fallback)
                }
            }

            targets = cache

            if (cache.length === 1) {
                const transformComp = cache[0].getComponent<TransformationComponent>(Components.TRANSFORMATION)
                totalTranslated = Array.from(transformComp.translation)
                totalScaled = Array.from(transformComp.scaling)
                totalPivot = Array.from(transformComp.pivotPoint)
            } else {
                totalTranslated = [0, 0, 0]
                totalScaled = [0, 0, 0]
                totalPivot = [0, 0, 0]
            }
        })
    })

    function getTransformationComponent(entity: EditorEntity): TransformationComponent {
        return entity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
    }

    onDestroy(() => EntitySelectionStore.getInstance().removeListener(COMPONENT_ID))

    $: {
        mainEntity = targets[0]
        if(mainEntity != null) {
            mainEntityTransformationComponent = getTransformationComponent(mainEntity)
            rotationType = mainEntityTransformationComponent.rotationType[0]
            isSingle = targets.length === 1
            lockedRotation = isSingle && mainEntityTransformationComponent.lockedRotation
            lockedTranslation = isSingle && mainEntityTransformationComponent.lockedTranslation
            lockedScaling = isSingle && mainEntityTransformationComponent.lockedScaling
        }
    }

    function rotate(axis: number, value: number) {
        if (!hasStarted) {
            hasStarted = true
            EditorActionHistory.save(targets)
        }
        const transformationComponent = getTransformationComponent(mainEntity)
        if (rotationType === TransformationRotationTypes.ROTATION_QUATERNION)
            transformationComponent.rotationQuaternion[axis] = value
        else
            transformationComponent.rotationEuler[axis] = value
        transformationComponent.changed = true
    }

    function transformScaleTranslation(axis: number, value: number, isTranslation?: boolean) {
        if (!hasStarted) {
            hasStarted = true
            EditorActionHistory.save(targets)
        }
        for (let i = 0; i < targets.length; i++) {
            const entity = targets[i]
            const transformationComponent = getTransformationComponent(entity)
            if (!isTranslation) {
                if (!entity.__originalScaling)
                    entity.__originalScaling = isSingle ? [0, 0, 0] : Array.from(transformationComponent._scaling)
                transformationComponent._scaling[axis] = entity.__originalScaling[axis] + value
            } else {
                if (!entity.__originalTranslation)
                    entity.__originalTranslation = isSingle ? [0, 0, 0] : Array.from(transformationComponent._translation)
                transformationComponent._translation[axis] = entity.__originalTranslation[axis] + value
            }
            transformationComponent.changed = true
        }

        if (isTranslation)
            totalTranslated[axis] = value
        else
            totalScaled[axis] = value

    }

    function transformPivot(axis, value) {
        if (!hasStarted) {
            hasStarted = true
            EditorActionHistory.save(targets)
        }

        for (let i = 0; i < targets.length; i++) {
            const entity = targets[i]
            const transformationComponent = getTransformationComponent(entity)
            if (!entity.__originalPivot)
                entity.__originalPivot = isSingle ? [0, 0, 0] : Array.from(transformationComponent.pivotPoint)
            transformationComponent.pivotPoint[axis] = entity.__originalPivot[axis] + value
            EngineToolsState.pivotChanged.set(entity.id, true)
        }
        totalPivot[axis] = value
    }

    function onFinish() {
        EditorActionHistory.save(targets)
        hasStarted = false
    }
</script>

{#if mainEntity}

    <Accordion title={LocalizationEN.TRANSFORMATION} startOpen={true}>
        {#if !isSingle}
            <div class="alert" data-svelteinline="-">
                {LocalizationEN.TRANSFORMING_GROUP}
            </div>
        {:else}
            <fieldset>
                <legend>{LocalizationEN.PIVOT_POINT}</legend>
                <div data-svelteinline="-">
                    <Range
                            onFinish={onFinish}
                            label="X"
                            value={totalPivot[0]}
                            handleChange={v => transformPivot(0, v)}
                    />
                    <Range
                            onFinish={onFinish}
                            label="Y"
                            value={totalPivot[1]}
                            handleChange={v => transformPivot(1, v)}
                    />
                    <Range
                            onFinish={onFinish}
                            label="Z"
                            value={totalPivot[2]}
                            handleChange={v => transformPivot(2, v)}
                    />
                </div>
            </fieldset>
        {/if}

        <fieldset>
            <legend>{LocalizationEN.TRANSLATION}</legend>
            {#if isSingle}
                <Checkbox
                        label={LocalizationEN.LOCKED}
                        checked={lockedCache[0]}
                        handleCheck={_ => {
                              mainEntityTransformationComponent.lockedTranslation = !mainEntityTransformationComponent.lockedTranslation
                              lockedCache[0] = !lockedCache[0]
                        }}
                />
            {/if}
            <div data-svelteinline="-">
                <Range
                        onFinish={onFinish}
                        disabled={lockedTranslation}
                        label="X"
                        value={totalTranslated[0]}
                        handleChange={v => transformScaleTranslation(0, v, true)}
                />
                <Range
                        onFinish={onFinish}
                        disabled={lockedTranslation}
                        label="Y"
                        value={totalTranslated[1]}
                        handleChange={v => transformScaleTranslation(1, v, true)}
                />
                <Range
                        onFinish={onFinish}
                        disabled={lockedTranslation}
                        label="Z"
                        value={totalTranslated[2]}
                        handleChange={v => transformScaleTranslation(2, v, true)}
                />
            </div>
        </fieldset>

        <fieldset>
            <legend>{LocalizationEN.SCALE}</legend>
            {#if isSingle}
                <Checkbox
                        label={LocalizationEN.LOCKED}
                        checked={lockedCache[1]}
                        handleCheck={_ => {
                              mainEntityTransformationComponent.lockedScaling = !mainEntityTransformationComponent.lockedScaling
                              lockedCache[1] = !lockedCache[1]
                        }}
                />
            {/if}
            <div data-svelteinline="-">
                <Range
                        onFinish={onFinish}
                        disabled={lockedScaling}
                        label="X"
                        value={totalScaled[0]}
                        handleChange={v => transformScaleTranslation(0, v)}
                />
                <Range
                        onFinish={onFinish}
                        disabled={lockedScaling}
                        label="Y"
                        value={totalScaled[1]}
                        handleChange={v => transformScaleTranslation(1, v)}
                />
                <Range
                        onFinish={onFinish}
                        disabled={lockedScaling}
                        label="Z"
                        value={totalScaled[2]}
                        handleChange={v => transformScaleTranslation(2, v)}
                />
            </div>
        </fieldset>

        {#if isSingle}
            <fieldset>
                <legend>{LocalizationEN.ROTATION}</legend>
                <div data-svelteform="-">
                    <Dropdown buttonStyles="background: var(--background-input); border-radius: 3px">
                        <button data-sveltebuttondefault="-" slot="button" class="button">
                            {ROTATION_TYPES.find(e => e.type === rotationType).label}
                        </button>
                        {#each ROTATION_TYPES as rt}
                            <button
                                    data-sveltebuttondefault="-"
                                    on:click={() => {

                                        rotationType = rt.type
                                        mainEntityTransformationComponent.rotationType[0] = rt.type
                                        mainEntityTransformationComponent.changed = true
                                    }}>
                                {#if rotationType === rt.type}
                                    <Icon>check</Icon>
                                {:else}
                                    <EmptyIcon/>
                                {/if}
                                {rt.label}
                            </button>
                        {/each}
                    </Dropdown>
                    <Checkbox
                            label={LocalizationEN.LOCKED}
                            checked={lockedCache[2]}
                            handleCheck={_ => {
                                  mainEntityTransformationComponent.lockedRotation = !mainEntityTransformationComponent.lockedRotation
                                  lockedCache[2] = !lockedCache[2]
                            }}
                    />
                    {#if rotationType === TransformationRotationTypes.ROTATION_QUATERNION}
                        <Range
                                onFinish={onFinish}
                                disabled={lockedRotation}
                                label="X"
                                value={mainEntityTransformationComponent.rotationQuaternion[0]}
                                handleChange={v => rotate(0, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                disabled={lockedRotation}
                                label="Y"
                                value={mainEntityTransformationComponent.rotationQuaternion[1]}
                                handleChange={v => rotate(1, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                disabled={lockedRotation}
                                label="Z"
                                value={mainEntityTransformationComponent.rotationQuaternion[2]}
                                handleChange={v => rotate(2, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                disabled={lockedRotation}
                                label="W"
                                value={mainEntityTransformationComponent.rotationQuaternion[3]}
                                handleChange={v => rotate(3, v)}
                        />
                    {:else}

                        <Range
                                onFinish={onFinish}
                                value={mainEntityTransformationComponent.rotationEuler[0]}
                                disabled={lockedRotation}
                                label="X"
                                handleChange={v => rotate(0, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                value={mainEntityTransformationComponent.rotationEuler[1]}
                                disabled={lockedRotation}
                                label="Y"
                                handleChange={v => rotate(1, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                value={mainEntityTransformationComponent.rotationEuler[2]}
                                disabled={lockedRotation}
                                label="Z"
                                handleChange={v => rotate(2, v)}
                        />

                    {/if}
                </div>
            </fieldset>
        {/if}
    </Accordion>
{/if}

<style>
    .button {
        border: none;
        width: 100%;
        text-align: left;
    }

    .alert {
        height: 20px;
        border-radius: 3px;
        background: var(--pj-accent-color);
        color: white;
        font-size: .75rem;
        justify-content: center;
        width: 100%;


    }
</style>
