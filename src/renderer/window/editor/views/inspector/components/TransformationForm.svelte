<script>
    import EntitySelectionStore from "../../../../shared/stores/EntitySelectionStore"
    import Engine from "../../../../../engine/core/Engine"

    import {onDestroy, onMount} from "svelte"
    import Checkbox from "../../../../shared/components/checkbox/Checkbox.svelte"
    import EditorActionHistory from "../../../services/EditorActionHistory"
    import Range from "../../../../shared/components/range/Range.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import Accordion from "../../../../shared/components/accordion/Accordion.svelte"
    import ROTATION_TYPES from "../static/ROTATION_TYPES"
    import Movable from "../../../../../engine/core/instances/components/Movable"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import EmptyIcon from "../../../../shared/components/icon/EmptyIcon.svelte"

    const COMPONENT_ID = crypto.randomUUID()
    let targets = []
    let rotationType = Movable.ROTATION_QUATERNION
    let totalTranslated = [0, 0, 0]
    let totalScaled = [0, 0, 0]
    let totalPivot = [0, 0, 0]
    let mainEntity
    let isSingle
    let lockedRotation
    let lockedTranslation
    let lockedScaling
    let hasStarted = false
    let lockedCache = [false, false, false]

    onMount(() => {
    	EntitySelectionStore.getInstance().addListener(COMPONENT_ID, () => {
    		const cache = []
    		const entitiesSelected = EntitySelectionStore.getEntitiesSelected()
    		for (let i = 0; i < entitiesSelected.length; i++) {
    			const e = entitiesSelected[i]
    			const c = Engine.entities.get(e)
    			if (c) {
    				cache.push(c)
    				c.__originalTranslation = undefined
    				c.__originalPivot = undefined
    				c.__originalScaling = undefined
    				c.__originalQuat = undefined
    			}
    		}
    		if (cache.length === 0) {
    			const fallback = Engine.entities.get(EntitySelectionStore.getMainEntity())
    			if (fallback)
    				fallback.__originalQuat = undefined
    			fallback && cache.push(fallback)
    		}

    		targets = cache

    		if (cache.length === 1) {
    			totalTranslated = Array.from(cache[0]._translation)
    			totalScaled = Array.from(cache[0]._scaling)
    			totalPivot = Array.from(cache[0].pivotPoint)
    		} else {
    			totalTranslated = [0, 0, 0]
    			totalScaled = [0, 0, 0]
    			totalPivot = [0, 0, 0]
    		}
    	})
    })

    onDestroy(() => EntitySelectionStore.getInstance().removeListener(COMPONENT_ID))

    $: {
    	mainEntity = targets[0]
    	rotationType = mainEntity?.rotationType[0]
    	isSingle = targets.length === 1
    	lockedRotation = isSingle && mainEntity?.lockedRotation
    	lockedTranslation = isSingle && mainEntity?.lockedTranslation
    	lockedScaling = isSingle && mainEntity?.lockedScaling
    }

    function rotate(axis, value) {
    	if (!hasStarted) {
    		hasStarted = true
    		EditorActionHistory.save(targets)
    	}

    	if (rotationType === Movable.ROTATION_QUATERNION)
    		mainEntity.rotationQuaternion[axis] = value
    	else
    		mainEntity.rotationEuler[axis] = value
    	mainEntity.changed = true
    }

    function transformScaleTranslation(axis, value, isTranslation) {
    	if (!hasStarted) {
    		hasStarted = true
    		EditorActionHistory.save(targets)
    	}
    	for (let i = 0; i < targets.length; i++) {
    		const entity = targets[i]
    		if (!isTranslation) {
    			if (!entity.__originalScaling)
    				entity.__originalScaling = isSingle ? [0, 0, 0] : Array.from(entity._scaling)
    			entity._scaling[axis] = entity.__originalScaling[axis] + value
    		} else {
    			if (!entity.__originalTranslation)
    				entity.__originalTranslation = isSingle ? [0, 0, 0] : Array.from(entity._translation)
    			entity._translation[axis] = entity.__originalTranslation[axis] + value
    		}
    		entity.changed = true
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
    		if (!entity.__originalPivot)
    			entity.__originalPivot = isSingle ? [0, 0, 0] : Array.from(entity.pivotPoint)
    		entity.pivotPoint[axis] = entity.__originalPivot[axis] + value
    		entity.__pivotChanged = true
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
            <legend>{LocalizationEN.SCALE}</legend>
            {#if isSingle}
                <Checkbox
                        label={LocalizationEN.LOCKED}
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

        {#if isSingle}
            <fieldset>
                <legend>{LocalizationEN.ROTATION}</legend>
                <div data-svelteform="-">
                    <Dropdown buttonStyles="background: var(--background-input); border-radius: 3px">
                        <button data-sveltebuttondefault="-" slot="button" class="button">
                            {ROTATION_TYPES.find(e => e.type === rotationType).label}
                        </button>
                        {#each ROTATION_TYPES as rt}
                            <button data-sveltebuttondefault="-" on:click={() => {
                        rotationType = rt.type
                        mainEntity.rotationType[0] = rt.type
                        mainEntity.changed = true
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
                          mainEntity.lockedRotation = !mainEntity.lockedRotation
                          lockedCache[2] = !lockedCache[2]
                    }}
                    />
                    {#if rotationType === Movable.ROTATION_QUATERNION}
                        <Range
                                onFinish={onFinish}
                                disabled={lockedRotation}
                                label="X"
                                value={mainEntity.rotationQuaternion[0]}
                                handleChange={v => rotate(0, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                disabled={lockedRotation}
                                label="Y"
                                value={mainEntity.rotationQuaternion[1]}
                                handleChange={v => rotate(1, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                disabled={lockedRotation}
                                label="Z"
                                value={mainEntity.rotationQuaternion[2]}
                                handleChange={v => rotate(2, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                disabled={lockedRotation}
                                label="W"
                                value={mainEntity.rotationQuaternion[3]}
                                handleChange={v => rotate(3, v)}
                        />
                    {:else}

                        <Range
                                onFinish={onFinish}
                                value={mainEntity.rotationEuler[0]}
                                disabled={lockedRotation}
                                label="X"
                                handleChange={v => rotate(0, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                value={mainEntity.rotationEuler[1]}
                                disabled={lockedRotation}
                                label="Y"
                                handleChange={v => rotate(1, v)}
                        />
                        <Range
                                onFinish={onFinish}
                                value={mainEntity.rotationEuler[2]}
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
