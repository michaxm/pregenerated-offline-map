function readMetadata(filename, callback) {
    readFile("sdcard", filename, function(result){
        callback(JSON.parse(result));
    });
}

function withUrlForFilePath(filePath, callback) {
    withStorageFile("sdcard", filePath, function () {
        var url = window.URL.createObjectURL(this.result);
        console.trace("FilePath "+filePath+" points to "+url);
        callback(url);
    });
}

function readFile(storageName, filePath, successCallback) {
    console.log('Reading '+filePath);
    withStorageFile(storageName, filePath, function () {
        var name = this.result.name;
        console.log("Accessing file " + name);
        var fileReader = new FileReader();
        fileReader.onload = function () {
            console.trace("File contents: "+fileReader.result);
            successCallback(fileReader.result);
        }
        fileReader.readAsText(this.result);
    });
}

function withStorageFile(storageName, filePath, callback) {
    var store = navigator.getDeviceStorage(storageName);
    var readRequest = store.get(filePath);
    readRequest.onerror = function() {
        logObject(this);
        console.log("Error loading "+filePath);
    }
    readRequest.onsuccess = callback;
}

function logObject(object) {
    console.log(object);
    var output = prettyPrint(object);
    console.log(output);
}

function prettyPrint(object) {
    var output = '';
    for (var property in object) {
        output += property + ': ' + object[property]+'; ';
    }
    return output;
}