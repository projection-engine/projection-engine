export default function AssimpJS(files) {
    const assimpjs = window.require('assimpjs')
    const promises = []
    const reader = new FileReader();

    function readFile(index) {
        if (index >= files.length) return;
        let file = files[index];
        promises.push(new Promise(async resolve => {
            reader.onload = async (e) => {
                await readFile(index + 1)
                resolve({
                    data: new Uint8Array(e.target.result),
                    name: file.name
                })
            }
        }))
        reader.readAsArrayBuffer(file);
    }
    readFile(0);

    return Promise.all(promises).then(f => {
        return new Promise(async resolve1 => {
            const ajs = await assimpjs()
            let fileList = new ajs.FileList();

            f.forEach(file => {
                fileList.AddFile(
                    file.name,
                    file.data
                )
            })
            let result = ajs.ConvertFileList(fileList, 'assjson');
            if (!result.IsSuccess() || result.FileCount() === 0) {
                resolve1()
            }
            let resultFile = result.GetFile(0);
            try {
                resolve1(JSON.parse(new TextDecoder().decode(resultFile.GetContent())))
            } catch (e) {
                resolve1()
            }
        })
    })
}