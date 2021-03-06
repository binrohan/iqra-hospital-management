//var Controller = new function () {
//    this.Wait = true;
//    var that = this, name = 'Access', formModel = {}, oldTitle = document.title, windowModel, callerOptions, formInputs;
//    var error = new function () {
//        this.Save = function (response, path) {
//            windowModel.Free();
//            Global.Error.Show(response, { path: path, section: 'AddController save', user: name, });
//        };
//    };
//    function save() {
//        if (formModel.IsValid) {
//            windowModel.Wait();
//            var saveUrl = '/AccessArea/AppAccess/SetControllerAcces';
//            var model = { roleId: formModel.RoleId, controllerId: callerOptions.model.Id };
//            model.rollType = model.roleId === '00000000-0000-0000-0000-000000000000' ? 4 : 1;
//            Global.CallServer(saveUrl, function (response) {
//                if (!response.IsError) {
//                    windowModel.Free();
//                    callerOptions.onSaveSuccess && callerOptions.onSaveSuccess(response);
//                    callerOptions.model.Access.push({ Id: formModel.RoleId });
//                    dropDownList.Bind();
//                } else {
//                    error.Save(response, saveUrl);
//                }
//            }, function (response) {
//                response.Id = -8;
//                error.Save(response, saveUrl);
//            }, model, 'POST');
//        }
//        return false;
//    };
//    function cancel() {
//        windowModel.Hide(function () {
//        });
//        document.title = oldTitle;
//    };
//    function populate(model) {
//        model = model || {};
//        formModel.ActionMethode = model.Name;
//    };
//    var dropDownList = new function () {
//        var roles, elm;
//        function bindDropDownList() {
//            elm = elm || $(formInputs['RoleId']);
//            elm.empty();
//            var dic = {};
//            callerOptions.model.Access.each(function () { dic[this.Id.toLowerCase()] = this; });
//            elm.append('<option value="00000000-0000-0000-0000-000000000000">All Users</option>');
//            roles.each(function () {
//                !dic[this.value] && elm.append('<option value="' + this.value + '">' + this.text + '</option>');
//            });
//            return true;
//        };
//        function set() {
//            Global.CallServer('/StuffArea/Stuff/DropDown', function (response) {
//                if (!response.IsError) {
//                    console.log(response);
//                    roles = response.Data;
//                    bindDropDownList();
//                } else {
//                }
//            }, function (response) {
//                response.Id = -8;
//                error.Save(response, saveUrl);
//            }, {}, 'GET');
//        };
//        this.Bind = function () {
//            roles && bindDropDownList() || set();
//        };
//    };
//    function show(model, template) {
//        windowModel.Show();
//        oldTitle = document.title;
//        document.title = formModel.Title = 'Set Access';
//        populate(model);
//        dropDownList.Bind();
//    }
//    this.Show = function (options) {
//        callerOptions = options;
//        if (windowModel) {
//            show(options.model);
//        } else {
//            Global.LoadTemplate('/Areas/AccessArea/Templates/SetControllerAccess.html', function (response) {
//                Global.Free();
//                windowModel = Global.Window.Bind(response);
//                that.Events.Bind(options.model);
//                show(options.model);
//            }, function (response) {
//            });
//        }
//    }
//    this.Events = new function () {
//        var evt = this, isBind = false;
//        this.Bind = function (model) {
//            if (!isBind) {
//                model = model || {};
//                isBind = true;
//                formInputs = Global.Form.Bind(formModel, windowModel.View);
//                windowModel.View.find('.btn_cancel').click(cancel);
//                windowModel.View.find('.btn_save').click(function () { setTimeout(save, 0); return false; });
//            }
//        };
//    };
//};
var Controller = new function () {
    this.Wait = true;
    var that = this, formModel = {}, oldTitle = document.title, windowModel, callerOptions, formInputs;
    var error = new function () {
        this.Save = function (response, path) {
            windowModel.Free();
            Global.Error.Show(response, { path: path, section: 'AddController save', user: name, });
        };
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var saveUrl = callerOptions.saveUrl|| '/AccessArea/AppAccess/SetControllerAcces';
            var model = { roleId: formModel.RoleId, rollType: callerOptions.Type };
            model[callerOptions.field || 'controllerId'] = callerOptions.model.Id;
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
        var roles = {}, atoComplete;
        function set() {
            atoComplete = {
                elm: $(formInputs['RoleId']),
                url: callerOptions.dpr,
                ondatabinding: function (response) {
                    //console.log(response);
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
        formModel.LabelText = callerOptions.Label || 'Action Controller';
        populate(model);
        dropDownList.Bind();
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Areas/AccessArea/Templates/SetAppAccess.html', function (response) {
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
                formModel.RoleName = callerOptions.Name;
                formModel.title = 'Set ' + callerOptions.Name + ' Access';
                windowModel.View.find('.btn_cancel').click(cancel);
                windowModel.View.find('.btn_save').click(function () { setTimeout(save, 0); return false; });
            }
        };
    };
};

