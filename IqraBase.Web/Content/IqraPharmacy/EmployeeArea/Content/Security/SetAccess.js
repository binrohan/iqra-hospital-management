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
            var saveUrl = '/Security/SetAcces';
            var model = Global.Copy({}, formModel, true);
            Global.CallServer(saveUrl, function (response) {
                if (!response.IsError) {
                    windowModel.Free();
                    callerOptions.onSaveSuccess && callerOptions.onSaveSuccess(response);
                    callerOptions.model.Roles.push({ Id: formModel.RoleId });
                    dropDownList.Bind();
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, { groupId: formModel.RoleId, actionMethodId: callerOptions.model.Id }, 'POST');
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
        var roles,elm;
        function bindDropDownList() {
            elm = elm || $(formInputs['RoleId']);
            elm.empty();
            var dic = {};
            callerOptions.model.Roles.each(function () { dic[this.Id] = this;});
            roles.each(function () {
                !dic[this.value] && elm.append('<option value="' + this.value + '">' + this.text + '</option>');
            });
            return true;
        };
        function set() {
            Global.CallServer('/Designation/DropDown', function (response) {
                if (!response.IsError) {
                    console.log(response);
                    roles = response.Data;
                    bindDropDownList();
                } else {
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, {}, 'GET');
        };
        this.Bind = function () {
            roles && bindDropDownList() || set();
        };
    };
    function show(model, template) {
        windowModel.Show();
        oldTitle = document.title;
        document.title = formModel.Title = 'Set Access';
        populate(model);
        dropDownList.Bind();
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/Security/AssignRole.html', function (response) {
                Global.Free();
                windowModel = Global.Window.Bind(response);
                that.Events.Bind(options.model);
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
                windowModel.View.find('.btn_cancel').click(cancel);
                windowModel.View.find('.formContainer form.middleForm').submit(function () { setTimeout(save, 0); return false; });
            }
        };
    };
};

