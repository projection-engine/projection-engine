import {array, group, number} from "./prop-types";

export default  [
	number("MASS", "mass", undefined, 0),

	group("INERTIA", [
		array(["X", "Y", "Z"], "inertia",   .001)
	]),
]
