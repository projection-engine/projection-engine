
export default function sortItems(arr:MutableObject[], isDSC:boolean, sortKey:string) {
	function compare(A, B) {
		if (A[sortKey] < B[sortKey])
			return isDSC ? -1 : 1
		if (A[sortKey] > B[sortKey])
			return isDSC ? 1 : -1
		return 0
	}


	return arr.sort(compare)
}
