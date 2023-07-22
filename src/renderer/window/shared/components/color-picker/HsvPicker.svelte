<script>
    import {onDestroy, onMount} from "svelte"
    import Range from "../range/Range.svelte"

    export let startColor = [0, 0, 0]
    export let submit = undefined

    let tracked
    let h = 1
    let s = 1
    let v = 1
    let a = 1

    let r = 255
    let g = 0
    let b = 0
    let pickerSquare

    onMount(() => {
    	document.addEventListener("mouseup", mouseUp)
    	document.addEventListener("touchend", mouseUp)
    	document.addEventListener("mousemove", mouseMove)
    	r = startColor[0]
    	g = startColor[1]
    	b = startColor[2]
    	rgbToHSV(r, g, b, true)
    	updateCsPicker()
    	updateHuePicker()
    })

    onDestroy(() => killMouseEvents())


    function removeEventListenerFromElement(elementId, eventName, listenerCallback) {
    	let element = document.querySelector(elementId)
    	if (element) element.removeEventListener(eventName, listenerCallback)
    }

    function killMouseEvents() {

    	removeEventListenerFromElement("#colorsquare-event", "mousedown", csDown)
    	removeEventListenerFromElement("#hue-event", "mousedown", hueDown)
    	document.removeEventListener("mouseup", mouseUp)
    	document.removeEventListener("mousemove", mouseMove)
    }


    function updateCsPicker() {
    	let xPercentage = s * 100
    	let yPercentage = (1 - v) * 100
    	pickerSquare.style.top = yPercentage + "%"
    	pickerSquare.style.left = xPercentage + "%"
    }

    function updateHuePicker() {
    	let huePicker = document.querySelector("#hue-picker")
    	let xPercentage = h * 100
    	huePicker.style.left = xPercentage + "%"
    }

    function mouseMove(event) {
    	if (tracked) {
    		let mouseX = event.clientX
    		let mouseY = event.clientY
    		let trackedPos = tracked.getBoundingClientRect()
    		let xPercentage, yPercentage, picker
    		switch (tracked.id) {
    		case "colorsquare-event":
    			xPercentage = (mouseX - trackedPos.x) / 240 * 100
    			yPercentage = (mouseY - trackedPos.y) / 160 * 100;
    			(xPercentage > 100) ? xPercentage = 100 : (xPercentage < 0) ? xPercentage = 0 : null;
    			(yPercentage > 100) ? yPercentage = 100 : (yPercentage < 0) ? yPercentage = 0 : null

    			yPercentage = yPercentage.toFixed(2)
    			xPercentage = xPercentage.toFixed(2)
    			pickerSquare.style.top = yPercentage + "%"
    			pickerSquare.style.left = xPercentage + "%"
    			s = xPercentage / 100
    			v = 1 - yPercentage / 100
    			colorChange()
    			break
    		case "hue-event":
    			xPercentage = (mouseX - 10 - trackedPos.x) / 220 * 100;
    			(xPercentage > 100) ? xPercentage = 100 : (xPercentage < 0) ? xPercentage = 0 : null
    			xPercentage = xPercentage.toFixed(2)
    			picker = document.querySelector("#hue-picker")
    			picker.style.left = xPercentage + "%"
    			h = xPercentage / 100
    			hueChange()
    			break
    		case "alpha-event":
    			xPercentage = (mouseX - 10 - trackedPos.x) / 220 * 100;
    			(xPercentage > 100) ? xPercentage = 100 : (xPercentage < 0) ? xPercentage = 0 : null
    			xPercentage = xPercentage.toFixed(2)
    			picker = document.querySelector("#alpha-picker")
    			picker.style.left = xPercentage + "%"
    			a = xPercentage / 100
    			colorChange()
    			break
    		}

    	}

    }

    function csDown(event) {
    	tracked = event.currentTarget
    	let xPercentage = ((event.offsetX + 1) / 240) * 100
    	let yPercentage = ((event.offsetY + 1) / 160) * 100
    	yPercentage = yPercentage.toFixed(2)
    	xPercentage = xPercentage.toFixed(2)

    	pickerSquare.style.top = yPercentage + "%"
    	pickerSquare.style.left = xPercentage + "%"
    	s = xPercentage / 100
    	v = 1 - yPercentage / 100
    	colorChange()
    }


    function mouseUp() {
    	tracked = null
    }

    function hueDown(event) {
    	tracked = event.currentTarget
    	let xPercentage = ((event.offsetX - 9) / 220) * 100
    	xPercentage = xPercentage.toFixed(2)
    	let picker = document.querySelector("#hue-picker")
    	picker.style.left = xPercentage + "%"
    	h = xPercentage / 100
    	hueChange()
    }


    function hueChange() {
    	let rgb = hsvToRgb(h, 1, 1)
    	let colorsquare = document.querySelector(".colorsquare")
    	colorsquare.style.background = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`
    	colorChange()
    }

    function colorChange() {
    	let rgb = hsvToRgb(h, s, v)
    	r = rgb[0]
    	g = rgb[1]
    	b = rgb[2]
    	// hexValue = RGBAToHex();
    	if (submit)
    		submit({r, g, b})
    }

    //Math algorithms
    function hsvToRgb(h, s, v) {
    	let r, g, b

    	let i = Math.floor(h * 6)
    	let f = h * 6 - i
    	let p = v * (1 - s)
    	let q = v * (1 - f * s)
    	let t = v * (1 - (1 - f) * s)

    	switch (i % 6) {
    	case 0:
    		r = v, g = t, b = p
    		break
    	case 1:
    		r = q, g = v, b = p
    		break
    	case 2:
    		r = p, g = v, b = t
    		break
    	case 3:
    		r = p, g = q, b = v
    		break
    	case 4:
    		r = t, g = p, b = v
    		break
    	case 5:
    		r = v, g = p, b = q
    		break
    	}

    	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
    }

    function RGBAToHex() {
    	let rHex = r.toString(16)
    	let gHex = g.toString(16)
    	let bHex = b.toString(16)

    	if (rHex.length === 1)
    		rHex = "0" + rHex
    	if (gHex.length === 1)
    		gHex = "0" + gHex
    	if (bHex.length === 1)
    		bHex = "0" + bHex


    	return ("#" + rHex + gHex + bHex).toUpperCase()
    }

    function rgbToHSV(r, g, b, update) {
    	let rperc, gperc, bperc, max, min, diff, pr, hnew, snew, vnew
    	rperc = r / 255
    	gperc = g / 255
    	bperc = b / 255
    	max = Math.max(rperc, gperc, bperc)
    	min = Math.min(rperc, gperc, bperc)
    	diff = max - min

    	vnew = max;
    	(vnew === 0) ? snew = 0 : snew = diff / max

    	for (let i = 0; i < 3; i++) {
    		if ([rperc, gperc, bperc][i] === max) {
    			pr = i
    			break
    		}
    	}
    	if (diff === 0) {
    		hnew = 0
    		if (update) {
    			h = hnew
    			s = snew
    			v = vnew
    			hueChange()
    			updateCsPicker()
    			return
    		} else {
    			return {h: hnew, s: snew, v: vnew}
    		}
    	} else {
    		switch (pr) {
    		case 0:
    			hnew = 60 * (((gperc - bperc) / diff) % 6) / 360
    			break
    		case 1:
    			hnew = 60 * (((bperc - rperc) / diff) + 2) / 360
    			break
    		case 2:
    			hnew = 60 * (((rperc - gperc) / diff) + 4) / 360
    			break
    		}
    		if (hnew < 0) hnew += 6
    	}

    	if (update) {
    		h = hnew
    		s = snew
    		v = vnew
    		hueChange()
    	} else {
    		return {h: hnew, s: snew, v: vnew}
    	}
    }
</script>

<div class="main-container" data-svelteiscolorpicker="-">
    <div class="colorsquare size">
        <div class="saturation-gradient">
            <div class="value-gradient">
                <div bind:this={pickerSquare} class="colorsquare-picker"></div>
                <div id="colorsquare-event" on:mousedown={csDown}></div>
            </div>
        </div>
    </div>
    <div class="hue-selector">
        <div id="hue-picker"></div>
        <div id="hue-event" on:mousedown={hueDown}></div>
    </div>
    <div class="rgb-text-div">
        <Range
                label="R"
                value={r}
                onFinish={v => rgbToHSV(v,g,b,true)}
                handleChange={v => r = v}
                minValue={0}
                maxValue={255}
        />
        <Range
                label="G"
                value={g}
                onFinish={v => rgbToHSV(r,v,b,true)}
                handleChange={v => g = v}
                minValue={0}
                maxValue={255}
        />
        <Range
                label="B"
                value={b}
                onFinish={v => rgbToHSV(r,g,v,true)}
                handleChange={v => b = v}
                minValue={0}
                maxValue={255}
        />
    </div>
</div>


<style>
    .main-container {
        width: 240px;
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .saturation-gradient {
        background: linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0));
        width: 240px;
        height: 160px;
    }

    .value-gradient {
        background: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));
        overflow: hidden;
        width: 240px;
        height: 160px;
    }

    .hue-selector {
        background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
        margin: 15px 10px 10px 10px;
        border-radius: 10px;
        height: 10px;
    }

    #hue-picker {
        background: #FFF;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        left: 0%;
        position: relative;
        cursor: default;
        transform: translate(-5px, -1px);
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    }

    #hue-event {
        width: 236px;
        height: 14px;
        transform: translate(-8px, -14px);
        cursor: default;
        touch-action: none;
    }


    .colorsquare {
        background: rgb(255, 0, 0);
    }

    .colorsquare-picker {
        margin: 0;
        padding: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #FFFB;
        position: relative;
        transform: translate(-9px, -9px);
        left: 100%;
    }

    #colorsquare-event {
        width: 100%;
        height: 100%;
        position: relative;
        transform: translate(0, -16px);
        touch-action: none;
    }

    .rgb-text-div {
        padding: 6px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

</style>
