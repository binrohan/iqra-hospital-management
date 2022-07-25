var Controller = new function () {
    this.Wait = true;
    var that = this, name = 'Access', formModel = {}, oldTitle = document.title, windowModel, callerOptions, formInputs;
    var error = new function () {
        this.Save = function (response, path) {
            windowModel.Free();
            Global.Error.Show(response, { path: path, section: 'AddController save', user: name, });
        };
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var saveUrl = '/MenuArea/MenuAccess/SetCategoryAccess';
            var model = { roleId: formModel.RoleId, categoryId: callerOptions.model.Id, rollType:callerOptions.Type };
            Global.CallServer(saveUrl, function (response) {
                if (!response.IsError) {
                    windowModel.Free();
                    callerOptions.onSaveSuccess && callerOptions.onSaveSuccess(response);
                    callerOptions.model.Designation.push({ Id: formModel.RoleId });
                    dropDownList.Bind();
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, model, 'POST');
        }
        return false;
    };
    function cancel() {
        windowModel.Hide(function () {
        });
        document.title = oldTitle;
    };
    function populate(model) {
        model = model || {};
        formModel.ActionMethode = model.Name;
    };
    var dropDownList = new function () {
        var roles = {},atoComplete;
        function set() {
            atoComplete = {
                elm: $(formInputs['RoleId']),
                url: callerOptions.dpr,
                ondatabinding: function (response) {
                    console.log(response);
                },
            };
            Global.AutoComplete.Bind(atoComplete);
        };
        this.Bind = function () {
            atoComplete && atoComplete.Reload() || set();
        };
    };
    function show(model, template) {
        windowModel.Show();
        oldTitle = document.title;
        document.title = formModel.title = 'Set ' + callerOptions.Name + ' Access';
        populate(model);
        dropDownList.Bind();
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/MenuArea/Templates/SetMenuAccess.html', function (response) {
                Global.Free();
                windowModel = Global.Window.Bind(response);
                that.Events.Bind(options.model);
                formModel.RoleName = callerOptions.Name;
                show(options.model);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var evt = this, isBind = false;
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                formModel.RoleName = 'Designation';
                formModel.title = 'Set Designation Access';
                windowModel.View.find('.btn_cancel').click(cancel);
                windowModel.View.find('.btn_save').click(function () { setTimeout(save, 0); return false; });
            }
        };
    };
};

