<script>
    import SelectionStore from "../../../../stores/SelectionStore";
    import Engine from "../../../../../../../engine-core/Engine";
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import {onDestroy} from "svelte";
    import Checkbox from "../../../../../../components/checkbox/Checkbox.svelte";
    import {quat} from "gl-matrix";
    import UndoRedoAPI from "../../../../lib/utils/UndoRedoAPI";
    import ACTION_HISTORY_TARGETS from "../../../../static/ACTION_HISTORY_TARGETS.ts";
    import Range from "../../../../../../components/range/Range.svelte";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";

    const tempQuat = quat.create()
    const toRad = Math.PI / 180
    const TYPES = ["QUATERNION", "EULER"]

    let targets = []
    let rotationType = TYPES[1]

    let totalTranslated = [0, 0, 0]
    let totalScaled = [0, 0, 0]
    let totalQuat = [0, 0, 0, 1]
    let totalEuler = [0, 0, 0]
    let totalPivot = [0, 0, 0]

    let hasStarted = false
    let lockedCache = [false, false, false]
    const unsubscribe = SelectionStore.getStore(() => {
        const cache = []
        SelectionStore.engineSelected.forEach(e => {
            const c = Engine.entities.map.get(e)
            if (c) {
                cache.push(c)
                c.__originalTranslation = undefined
                c.__originalPivot = undefined
                c.__originalScaling = undefined
                c.__originalQuat = undefined
            }
        })
        if (cache.length === 0) {
            const fallback = Engine.entities.map.get(SelectionStore.mainEntity)
            if (fallback)
                fallback.__originalQuat = undefined
            fallback && cache.push(fallback)
        }

        targets = cache
        totalEuler = [0, 0, 0]
        if (cache.length === 1) {
            totalTranslated = Array.from(cache[0]._translation)
            totalScaled = Array.from(cache[0]._scaling)
            totalQuat = Array.from(cache[0]._rotationQuat)
            totalPivot =  Array.from(cache[0].pivotPoint)
        } else {
            totalTranslated = [0, 0, 0]
            totalScaled = [0, 0, 0]
            totalQuat = [0, 0, 0, 1]
            totalPivot = [0, 0, 0]
        }
    })

    $: mainEntity = targets[0]
    $: isSingle = targets.length === 1
    $: lockedRotation = isSingle && mainEntity.lockedRotation
    $: lockedTranslation = isSingle && mainEntity.lockedTranslation
    $: lockedScaling = isSingle && mainEntity.lockedScaling


    onDestroy(unsubscribe)

    function rotate(axis, value) {
        if (!hasStarted) {
            hasStarted = true
            UndoRedoAPI.save(targets, ACTION_HISTORY_TARGETS.ENGINE)
        }

        const isQuat = rotationType === TYPES[0]

        if (!isQuat)
            totalEuler[axis] = value

        for (let i = 0; i < targets.length; i++) {
            const entity = targets[i]
            const q = entity._rotationQuat
            if (isQuat)
                q[axis] = isSingle ? value : q[axis] + value
            else {
                if (!entity.__originalQuat)
                    entity.__originalQuat = quat.clone(q)
                quat.copy(tempQuat, entity.__originalQuat)
                totalEuler[0] !== 0 && quat.rotateX(tempQuat, tempQuat, totalEuler[0])
                totalEuler[1] !== 0 && quat.rotateY(tempQuat, tempQuat, totalEuler[1])
                totalEuler[2] !== 0 && quat.rotateZ(tempQuat, tempQuat, totalEuler[2])
                quat.copy(q, tempQuat)
            }
            entity.__changedBuffer[0] = 1
        }

    }

    function transformScaleTranslation(axis, value, isTranslation) {
        if (!hasStarted) {
            hasStarted = true
            UndoRedoAPI.save(targets, ACTION_HISTORY_TARGETS.ENGINE)
        } 
        for (let i = 0; i < targets.length; i++) {
            const entity = targets[i]
            if (!isTranslation) {
                if (!entity.__originalScaling)
                    entity.__originalScaling =isSingle ? [0,0,0] : Array.from(entity._scaling)
                entity._scaling[axis] = entity.__originalScaling[axis] + value
            } else {
                if (!entity.__originalTranslation)
                    entity.__originalTranslation = isSingle ? [0,0,0] : Array.from(entity._translation)
                entity._translation[axis] = entity.__originalTranslation[axis] + value
            }
            entity.__changedBuffer[0] = 1
        }

        if (isTranslation)
            totalTranslated[axis] = value
        else
            totalScaled[axis] = value

    }

    function transformPivot(axis, value) {
        if (!hasStarted) {
            hasStarted = true
            UndoRedoAPI.save(targets, ACTION_HISTORY_TARGETS.ENGINE)
        }

        for (let i = 0; i < targets.length; i++) {
            const entity = targets[i]
            if (!entity.__originalPivot)
                entity.__originalPivot = isSingle ? [0,0,0] :Array.from(entity.pivotPoint)
            entity.pivotPoint[axis] = entity.__originalPivot[axis] + value
            entity.__pivotChanged = true
        }
        totalPivot[axis] = value
    }

    function onFinish() {
        UndoRedoAPI.save(targets, ACTION_HISTORY_TARGETS.ENGINE)
        hasStarted = false
    }
</script>

{#if !isSingle}
    <div class="alert" data-svelteinline="-">
        {LOCALIZATION_EN.TRANSFORMING_GROUP}
    </div>
{:else}
    <fieldset>
        <legend>{LOCALIZATION_EN.PIVOT_POINT}</legend>
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
    <legend>{LOCALIZATION_EN.TRANSLATION}</legend>
    {#if isSingle}
        <Checkbox
                label={LOCALIZATION_EN.LOCKED}
                checked={lockedCache[0]}
                handleCheck={_ => {
                      mainEntity.lockedTranslation = !mainEntity.lockedTranslation
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
    <legend>{LOCALIZATION_EN.SCALE}</legend>
    {#if isSingle}
        <Checkbox
                label={LOCALIZATION_EN.LOCKED}
                checked={lockedCache[1]}
                handleCheck={_ => {
                      mainEntity.lockedScaling = !mainEntity.lockedScaling
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

<fieldset>
    <legend>{LOCALIZATION_EN.ROTATION}</legend>
    {#if isSingle}
        <Dropdown buttonStyles="background: var(--background-input); border-radius: 3px">
            <button data-sveltebuttondefault="-"  slot="button" class="button">
                {LOCALIZATION_EN[rotationType]}
            </button>
            <button data-sveltebuttondefault="-"  on:click={() => rotationType = TYPES[0]}>
                {#if rotationType === TYPES[0]}
                    <Icon>check</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}
                {LOCALIZATION_EN.QUATERNION}
            </button>
            <button data-sveltebuttondefault="-"  on:click={() => rotationType = TYPES[1]}>
                {#if rotationType === TYPES[1]}
                    <Icon>check</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}
                {LOCALIZATION_EN.EULER}
            </button>
        </Dropdown>
        <Checkbox
                label={LOCALIZATION_EN.LOCKED}
                checked={lockedCache[2]}
                handleCheck={_ => {
                      mainEntity.lockedRotation = !mainEntity.lockedRotation
                      lockedCache[2] = !lockedCache[2]
                }}
        />
    {/if}
    {#if rotationType === TYPES[0] && isSingle}
        <Range
                onFinish={onFinish}
                disabled={lockedRotation}
                label="X"
                value={isSingle ? mainEntity._rotationQuat[0] : 0}
                handleChange={v => rotate(0, v)}
        />
        <Range
                onFinish={onFinish}
                disabled={lockedRotation}
                label="Y"
                value={isSingle ? mainEntity._rotationQuat[1] : 0}
                handleChange={v => rotate(1, v)}
        />
        <Range
                onFinish={onFinish}
                disabled={lockedRotation}
                label="Z"
                value={isSingle ? mainEntity._rotationQuat[2] : 0}
                handleChange={v => rotate(2, v)}
        />
        <Range
                onFinish={onFinish}
                disabled={lockedRotation}
                label="W"
                value={isSingle ? mainEntity._rotationQuat[3] : 0}
                handleChange={v => rotate(3, v)}
        />
    {:else}
        <div data-svelteinline="-">
            <Range
                    onFinish={onFinish}
                    value={totalEuler[0]}
                    disabled={lockedRotation}
                    label="X"
                    handleChange={v => rotate(0, v)}
            />
            <Range
                    onFinish={onFinish}
                    value={totalEuler[1]}
                    disabled={lockedRotation}
                    label="Y"
                    handleChange={v => rotate(1, v)}
            />
            <Range
                    onFinish={onFinish}
                    value={totalEuler[2]}
                    disabled={lockedRotation}
                    label="Z"
                    handleChange={v => rotate(2, v)}
            />
        </div>
    {/if}
</fieldset>

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
        font-weight: 550;


    }
</style>
