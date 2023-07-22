import {vec2} from "gl-matrix";

export default class EngineToolsState{
	static gridColor = .3
	static gridScale = 1
	static gridThreshold = 100
	static gridOpacity = 1
	static showGrid = true

	static showIcons= true
	static showLines= true
	static iconScale = 1
	static maxDistanceIcon = 50

	static showOutline = true
	static outlineWidth = .75
	static outlineColor = [1., .5, .0]
	static mouseCoordinates = vec2.create()
	static unconvertedMouseCoordinates = vec2.create()

}
