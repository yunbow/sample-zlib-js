(function () {
    $(function () {

        $('#export').on('click', function () {
            exportFile();
        });

        $('.inputFileCustom').on('click', function () {
            $(this).parent().find('.inputFile').click();
        });

        $('.inputFile').on('change', function () {
            var id = $(this).attr('id');
            var file = $(this).prop('files')[0];
            var fileName = file ? file.name : null;
            setInputFile(id, file, fileName);
            $(this).replaceWith($(this).clone());
        });
    });

    function exportFile() {
        var zip = new Zlib.Zip();

        var plainData1 = getInputFile('uploadFile1');
        zip.addFile(plainData1.file, {
            filename: strToUtf8Array('sample/' + plainData1.fileName)
        });

        var plainData2 = getInputFile('uploadFile2');
        zip.addFile(plainData2.file, {
            filename: strToUtf8Array('sample/' + plainData2.fileName)
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

    var uploadFileList = [];

    function setInputFile(id, file, fileName) {
        if (file) {
            $('#' + id).parent().find('.fileStatus').text(fileName);
        } else {
            $('#' + id).parent().find('.fileStatus').text('not selected.');
        }

        var isExist = false
        for (var i in uploadFileList) {
            var uploadFile = uploadFileList[i];
            if (uploadFile.id == id) {
                isExist = true;
                uploadFile.file = file;
                uploadFile.fileName = fileName;
            }
        }
        if (!isExist) {
            uploadFileList.push({ id: id, file: file, fileName: fileName });
        }
    }

    function getInputFile(id) {
        for (var i in uploadFileList) {
            var uploadFile = uploadFileList[i];
            if (uploadFile.id == id) {
                return {
                    file: uploadFile.file ? uploadFile.file : new Blob([], { type: 'application/octet-stream' }),
                    fileName: uploadFile.fileName ? uploadFile.fileName : '',
                }
            }
        }
        return {
            file: new Blob([], { type: 'application/octet-stream' }),
            fileName: '',
        };
    }

    function getFileName(filePath) {
        var pathList = filePath.split("/");
        return pathList[pathList.length - 1];
    }

})();