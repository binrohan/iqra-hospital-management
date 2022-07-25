var Controller = new function () {
    var that = this, view, options, formModel = {}, oldTitle = document.title, IsNew = true, windowModel, formInputs;
    var error = new function () {
        this.Save = function (response, path) {
            windowModel.Free();
            if (options.onerror) {
                options.onerror(response);
            } else {
                Global.Error.Show(response, { path: path, section: 'AddController.Add', user: options.name });
            }
        };
        this.Load = function (response, path) {
            windowModel.Free();
            Global.Error.Show(response, { path: path, section: 'AddController load]', user: options.name });
            cancel();
        };
    },
        defaultItemOptions = [], Identifier;
    function cancel() {
        windowModel.Hide(function () {
        });
        document.title = oldTitle;
    };
    function show(model) {
        windowModel.Show();
        oldTitle = document.title;
        document.title = formModel.Title = 'Add ' + options.DocumentName;
        that.Image.OnOpen();

    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        that.Image.Bind();
        show();
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/StuffArea/Templates/AddEmployeeDocument.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        var container, questionId;
        function onDelete(model) {
            if (model.IsCompleted) {
                Global.Controller.Call({
                    url: IqraConfig.Url.Js.WarningController,
                    functionName: 'Show',
                    options: {
                        name: 'Delete',
                        msg: 'Do you want to delete?',
                        save: '/StuffArea/EmployeeDocument/Delete',
                        data: { Id: model.Id, ReferenceType: options.ReferenceType },
                        onsavesuccess: function () {
                            model.elm.remove();
                        }
                    }
                });
            } else {
                model.request.Cancel();
                model.elm.remove();
            }
            model.IsCompleted = true;
        };
        function save(model) {
            model.request = Global.Uploader.upload({
                data: model.Data,
                url: '/StuffArea/EmployeeDocument/AddFiles',
                onProgress: function (data) {
                    model.Layer.css({ width: parseInt((data.loaded / data.total) * 100) + 'px' });
                },
                onComplete: function (response) {
                    model.IsCompleted = true;
                    if (!response.IsError) {
                        model.Layer.remove();
                        model.Id = response.Data[0];
                        return;
                    }
                    model.IsError = true;
                    model.Layer.css({ width: '100px' }).html('<div style="color: red; font-weight: bold; margin: 0px auto; padding: 38px 0px 38px 15px;">Error </div>');
                },
                onError: function () {
                    model.IsError = true;
                    model.IsCompleted = true;
                    model.Layer.css({ width: '100px' }).html('<div style="color: red; font-weight: bold; margin: 0px auto; padding: 38px 0px 38px 15px;">Error </div>');
                }
            });
        }
        function createView(src, file) {
            var layer = $('<div style="position: absolute; z-index: 1; background-color: rgba(20, 20, 20, 0.7); height: 100px; top: 0px; right: -10px; width: 100px;"></div>');
            var btn = $('<div class="btn_delete" style="position: absolute; right: -10px; top: -3px;z-index: 2;"><span class="icon_container" style="border-radius: 50%; padding: 0px 1px; border: 2px solid rgb(255, 255, 255); cursor: pointer; font-size: 0.8em;"> <span class="glyphicon glyphicon-remove"></span></span></div>');
            var img = $('<img style="max-width:100px; max-height:100px;" />'), elm = $('<div class="col-md-3 image_item"></div>').append(btn).append(img).append(layer);
            img.attr('src', src);
            var model = {
                Id: Global.Guid(),
                elm: elm,
                Layer: layer,
                Data: {
                    Images: [{ IsFile: true, File: file }],
                    EmployeeId: options.EmployeeId,
                    DocumentName: options.DocumentName
                }
            };
            Global.Click(btn, onDelete, model);
            container.append(elm);
            save(model);
        };
        function readURL(reader, input, index) {
            index = index || 0;
            var reader = reader || new FileReader();
            if (input.files && input.files.length - 1 >= index) {
                var file = input.files[index];
                reader.onload = function (e) {
                    createView(e.target.result, file);
                    index++;
                    readURL(reader, input, index);
                }
                reader.readAsDataURL(file);
            }
        }
        function onEmpPic() {
            var input = this, reader;
            options.DocumentName = 'Picture';
            readURL(reader, input);
        };

        function onEmpNid() {
            var input = this, reader;
            options.DocumentName = 'NID';
            readURL(reader, input);
        };

        function onEmpCertificate() {
            var input = this, reader;
            options.DocumentName = 'Certificates';
            readURL(reader, input);
        };

        var loadImages = (function () {
            function onDelete(model) {
                model.elm.remove();
                Global.Controller.Call({
                    url: IqraConfig.Url.Js.WarningController,
                    functionName: 'Show',
                    options: {
                        name: 'OnDelete',
                        save: '/StuffArea/EmployeeDocument/OnDelete',
                        data: { Id: model.Id},
                        onsavesuccess: function () {
                            model.elm.remove();
                        }
                    }
                });
            };
            function createView(data) {
                var btn = $('<div class="btn_delete" style="position: absolute; right: -10px; top: -3px;z-index: 2;"><span class="icon_container" style="border-radius: 50%; padding: 0px 1px; border: 2px solid rgb(255, 255, 255); cursor: pointer; font-size: 0.8em;"> <span class="glyphicon glyphicon-remove"></span></span></div>');
                var elm = $('<div class="col-md-3 image_item"><img src="/StuffArea/EmployeeDocument/Icons?Id=' + data.Id + '" style="max-width:100px; max-height:100px;" /> <div>' + data.DocumentName + ' </div></div> ').append(btn);
                var model = {
                    Id: data.Id,
                    elm: elm
                };
                Global.Click(btn, onDelete, model);
                container.append(elm);
            };
            return function () {
                windowModel.Wait('Please wait while loading data.');
                Global.CallServer('/StuffArea/EmployeeDocument/GetByEmployeeId?employeeId=' + options.EmployeeId, function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        response.Data.each(function () {
                            createView(this);
                        });
                    }
                }, function (response) {
                    windowModel.Free();
                }, {}, 'Get')
            };
        })();
        this.Bind = function () {
            windowModel.View.find('#btn_emp_pic').change(onEmpPic);
            windowModel.View.find('#btn_nid').change(onEmpNid);
            windowModel.View.find('#btn_certificates').change(onEmpCertificate);
            container = windowModel.View.find('#image_container');
        };
        this.OnOpen = function () {
            questionId = none;
            container && container.empty();
            loadImages();
        };
        this.IsValid = function () {

            return true;
        };
    }).call(that.Image = {});
}