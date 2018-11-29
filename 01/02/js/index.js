(function () {
    $(function () {

        $('#import').on('change', function () {
            var file = $(this).prop('files')[0];
            importFile(file);
        });
    });

    function importFile(file) {
        var zipReader = new FileReader();
        zipReader.onload = function () {
            try {
                var zipArr = new Uint8Array(zipReader.result);
                var unzip = new Zlib.Unzip(zipArr);
                var importFileList = unzip.getFilenames();

                var filePath = 'sample/sample001.json';
                var isExist = false;

                for (var i in importFileList) {
                    var importFile = importFileList[i];
                    if (importFile === filePath) {
                        isExist = true;
                    }
                }

                if (!isExist) {
                    log('JSON file does not exist. filePath=' + filePath);
                    return;
                }

                var jsonBuffer = utf8ArrayToStr(unzip.decompress(filePath));
                var jsonObj = null;

                try {
                    jsonObj = JSON.parse(jsonBuffer);
                    log('file=\n' + jsonBuffer);
                } catch (e) {
                    log('JSON syntax is incorrect.' + e.message);
                    return;
                }

                diplayImportFile(jsonObj);
            } catch (e) {
                log(e.message);
            }
        }
        zipReader.readAsArrayBuffer(file);
    }

    function utf8ArrayToStr(array) {
        var len = array.length;
        var out = "";
        var i = 0;
        var char1, char2, char3;

        while (i < len) {
            char1 = array[i++];
            switch (char1 >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    out += String.fromCharCode(char1);
                    break;
                case 12: case 13:
                    char2 = array[i++];
                    out += String.fromCharCode(((char1 & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((char1 & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }

    function diplayImportFile(jsonObj) {
        $('#inputText1').val(jsonObj.inputText1);
        $('input[name=inputRadio1]').val([jsonObj.inputRadio1])
        $('#select1').val(jsonObj.select1);
    }

})();