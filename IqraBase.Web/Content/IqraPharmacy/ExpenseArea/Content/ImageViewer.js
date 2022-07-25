var Controller = new function () {
    var that = this, options, formModel = {}, oldTitle = document.title, windowModel, selected;
    var filter = { "field": "ExpenseItemId", "value": "", Operation: 0 },
        page = { 'PageSize': 1000000, filter: [filter, { "field": "IsDeleted", "value": 0, Operation: 0 }] };
    function cancel() {
        windowModel.Hide(function () {
        });
        document.title = oldTitle;
    };
    function onDownload() {
        if (selected) {
            location.href = '/ExpenseArea/ExpenseDocument/File?Id=' + selected.Data.Id;
        }
        console.log(selected);
    };
    function show(model) {
        windowModel.Show();
        oldTitle = document.title;
        document.title = formModel.Title = 'Files Preview';
        console.log(options);
        filter.value = options.model.Id;
        that.Image.OnOpen();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        windowModel.View.find('.btn_download').click(onDownload);
        that.Image.Bind();
        show();
    };
    this.Show = function (opts) {
        options = opts;
        selected = none;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ExpenseArea/Templates/ImageViewer.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        var container;
        var loadImages = (function () {
            function onDelete(model) {
                Global.Controller.Call({
                    url: IqraConfig.Url.Js.WarningController,
                    functionName: 'Show',
                    options: {
                        name: 'OnDelete',
                        save: '/ExpenseArea/ExpenseDocument/Delete',
                        data: { Id: model.Data.Id },
                        onsavesuccess: function () {
                            model.Elm.remove();
                        }
                    }
                });
            };
            function onClick(model) {
                windowModel.View.find('#preview')[0].src = '/ExpenseArea/ExpenseDocument/File?Id=' + model.Data.Id;
                if (selected) {
                    selected.Elm.css({opacity:1});
                }
                selected = model;
                selected.Elm.css({ opacity: 0.4 });
            };
            function getIconUrl(model) {
                var iconUrl = '/ExpenseArea/ExpenseDocument/Icons?Id=' + model.Id;
                return iconUrl;
            };
            function createView(model) {
                var btn = $('<div class="btn_delete" style="position: absolute; right: -10px; top: -3px;z-index: 2;"><span class="icon_container" style="border-radius: 50%; padding: 0px 1px; border: 2px solid rgb(255, 255, 255); cursor: pointer; font-size: 0.8em;"> <span class="glyphicon glyphicon-remove"></span></span></div>');
                var elm = $('<div class="col-md-3 image_item" style="max-width:100px; max-height:100px;"><img src="' + getIconUrl(model) + '" style="max-width:100%; max-height:100px;" /></div>').append(btn);
                Global.Click(btn, onDelete, { Data: model, Elm: elm });
                Global.Click(elm, onClick, { Data: model, Elm: elm });
                container.append(elm);
                return elm
            };
            return function () {
                windowModel.Wait('Please wait while loading data.');
                Global.CallServer('/ExpenseArea/ExpenseDocument/Get', function (response) {
                    if (!response.IsError) {
                        windowModel.Free();
                        response.Data.Data.each(function (i) {
                            var elm = createView(this);
                            if (i == 0) {
                                elm.click();
                            }
                        });
                    }
                }, function (response) {
                    windowModel.Free();
                }, page, 'Post')
            };
        })();
        this.Bind = function () {
            container = windowModel.View.find('#image_icon');
        };
        this.OnOpen = function () {
            container && container.empty();
            loadImages();
        };
        this.IsValid = function () {
            for (var key in fileModels) {
                if (!fileModels[key].IsCompleted) {
                    alert('Please wait while image is uploading.');
                    return false;
                }
            }
            return true;
        };
    }).call(that.Image = {});
}