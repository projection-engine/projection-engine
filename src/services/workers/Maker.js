import EVENTS from "../../views/editor/utils/misc/EVENTS";

const fs = window.require('fs');
export default class Maker {
    static make(id, load, setAlert) {
        //
        // load.pushEvent(EVENTS.PACKAGING_DATA)
        //
        // let output = fs.createWriteStream('packages/' + id + '.zip');
        // let archive = archiver('zip', {
        //     zlib: {level: 9}
        // });
        //
        // output.on('close', function () {
        //     load.finishEvent(EVENTS.PACKAGING_DATA)
        //     setAlert({type: 'success', message: 'Compression was successful.'})
        //
        //
        // });
        //
        // archive.on('error', function (err) {
        //     load.finishEvent(EVENTS.PACKAGING_DATA)
        //     setAlert({type: 'error', message: 'Error during packaging process.'})
        //
        //
        // });
        //
        // archive.pipe(output);
        // archive.directory('projects/' + id, true);
        // archive.finalize().then(r => {
        //     load.finishEvent(EVENTS.PACKAGING_DATA)
        // })
    }

    static parse(file) {

    }
}