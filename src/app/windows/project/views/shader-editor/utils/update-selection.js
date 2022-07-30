export default function setSelected(i, selected, setSelected) {
    if (i && !selected.find(e => e === i))
        setSelected([...selected, i])
    else if (selected.find(e => e === i)) {
        const copy = [...selected]
        copy.splice(copy.indexOf(i), 1)
        setSelected(copy)
    }
}