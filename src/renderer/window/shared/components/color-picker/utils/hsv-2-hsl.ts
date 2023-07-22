export default function hsv2Hsl(h, s, v,) {

	const hh = ((200 - s) * v) / 100
	return {
		h,
		s: hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0,
		l: hh / 2,
	}

}