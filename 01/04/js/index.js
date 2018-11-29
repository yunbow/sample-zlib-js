(function () {
    $(function () {

        $('#importCustom').on('click', function () {
            $('#import').click();
        });

        $('#import').on('change', function () {
            var file = $(this).prop('files')[0];
            importFile(file);
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

        $('#outputButton').on('click', function () {
            log('uploadFile1=\n' + JSON.stringify(getInputFile('uploadFile1')));
            log('uploadFile2=\n' + JSON.stringify(getInputFile('uploadFile2')));
        });
    });

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

    function importFile(file) {
        var zipReader = new FileReader();
        zipReader.onload = function () {
            try {
                var zipArr = new Uint8Array(zipReader.result);
                var unzip = new Zlib.Unzip(zipArr);
                var importFileList = unzip.getFilenames();

                var uploadFile1Path = 'sample/upload1.json';
                var uploadFile2Path = 'sample/upload2.zip';

                for (var i in importFileList) {
                    var importFile = importFileList[i];

                    if (importFile === uploadFile1Path) {
                        var fileBuffer = unzip.decompress(uploadFile1Path);
                        var fileBlob = new Blob([fileBuffer], { type: 'application/octet-stream' });
                        setInputFile('uploadFile1', fileBlob, getFileName(uploadFile1Path));
                    }

                    if (importFile === uploadFile2Path) {
                        var fileBuffer = unzip.decompress(uploadFile2Path);
                        var fileBlob = new Blob([fileBuffer], { type: 'application/octet-stream' });
                        setInputFile('uploadFile2', fileBlob, getFileName(uploadFile2Path));
                    }
                }
            } catch (e) {
                log(e.message);
            }
        }
        zipReader.readAsArrayBuffer(file);
    }

})();