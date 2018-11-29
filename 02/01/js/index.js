(function () {
    $(function () {

        $('#export').on('click', function () {
            exportFile();
        });
    });

    function exportFile() {
        var zip = new Zlib.Zip();
        var plainData = JSON.stringify(getJsonObj());
        log(plainData);
        zip.addFile(strToUtf8Array(plainData), {
            filename: strToUtf8Array('sample/sample001.json')
        });
        var compressData = zip.compress();

        var blob = new Blob([compressData], { 'type': 'application/zip' });

        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, 'sample.zip');
            window.navigator.msSaveOrOpenBlob(blob, 'sample.zip');
        } else {
            document.getElementById('export').href = window.URL.createObjectURL(blob);
        }
    }

    function strToUtf8Array(str) {
        var n = str.length,
            idx = -1,
            bytes = [],
            i, j, c;

        for (i = 0; i < n; ++i) {
            c = str.charCodeAt(i);
            if (c <= 0x7F) {
                bytes[++idx] = c;
            } else if (c <= 0x7FF) {
                bytes[++idx] = 0xC0 | (c >>> 6);
                bytes[++idx] = 0x80 | (c & 0x3F);
            } else if (c <= 0xFFFF) {
                bytes[++idx] = 0xE0 | (c >>> 12);
                bytes[++idx] = 0x80 | ((c >>> 6) & 0x3F);
                bytes[++idx] = 0x80 | (c & 0x3F);
            } else {
                bytes[++idx] = 0xF0 | (c >>> 18);
                bytes[++idx] = 0x80 | ((c >>> 12) & 0x3F);
                bytes[++idx] = 0x80 | ((c >>> 6) & 0x3F);
                bytes[++idx] = 0x80 | (c & 0x3F);
            }
        }
        return bytes;
    };

    function getJsonObj() {
        return {
            inputText1: $('#inputText1').val(),
            inputRadio1: $('input[name=inputRadio1]:checked').val(),
            select1: $('#select1').val()
        };
    }

})();