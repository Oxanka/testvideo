angular.module('myApp.directive', [])
    .directive('ngUpload', function ($upload) {
        return {
            restrict: "EA",
            scope: {
                accept: '@',
                multiple: '=',
                ngUpload: "&"
            },
            link(scope, element) {
                var accept = scope.accept || false;
                var multiple = scope.multiple || false;

                element.on('click', function (event) {
                    $upload.open({
                        accept: accept,
                        multiple: multiple
                    }, function (files, dataUrl) {
                        scope.ngUpload({
                            $files: files,
                            $result: dataUrl
                        });
                    });
                });
            }
        }
    });
