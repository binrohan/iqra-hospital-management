
(function () {
    var gridModel, service = {};
    function onOpen(model) {
        Global.Add({
            url: '/Areas/AccessArea/Content/ActionMethod.js',
            OnChange: function () {
                gridModel.Reload();
            },
            model: model
        });
    };
    function removeAccess(data, msg) {
        var opts = {
            name: 'Access',
            Message: msg,
            Save: '/AccessArea/AppAccess/RemoveControllerAccess',
            data: data,
            onsavesuccess: function () {
                gridModel.Reload();
                //callerOptions.OnChange();
            }
        };
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: opts
        });
    };
    function onParse(elm, model, name) {
        model[name] = JSON.parse('[' + (model[name] || '') + ']');
        var elm = elm.find('.' + name.toLowerCase());
        model[name].each(function () {
            var button = $('<span class="icon_container" style="margin-right: 15px;"><span>' + this.Name + '<small>(' + this.Count + ')</small></span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-remove"></span></span>');
            this.ControllerId = model.Id;
            Global.Click(button.find('.glyphicon-remove'), service.Remove[name], this);
            elm.append(button);
        });
        var add = $('<a class="icon_container"><span>Add<small>(' + model.TotalMethod + ')</small></span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-plus"></span></a>');
        Global.Click(add, service.Add[name], model);
        elm.append(add);
    };
    function setPublic(elm, model, name) {
        var elm = elm.find('.' + name.toLowerCase()).empty();
        if (model[name] > 0) {
            var button = $('<span class="icon_container" style="margin-right: 15px;"><span> Has Access<small>(' + model[name] + ')</small></span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-remove"></span></span>');
            Global.Click(button.find('.glyphicon-remove'), service.Remove[name], model);
            elm.append(button);
        };
        if (model[name] < model.TotalMethod) {
            var add = $('<a class="icon_container"><span>Add<small>(' + model.TotalMethod + ')</small></span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-plus"></span></a>');
            Global.Click(add, service.Add[name], model);
            elm.append(add);
        }
        
    };
    function onRowBound(elm) {
        onParse(elm, this, 'Designation');
        onParse(elm, this, 'User');
        onParse(elm, this, 'NotAccess');
        setPublic(elm, this, 'Public');
        setPublic(elm, this, 'LogedIn');
    };
    function onDataBinding(response) {
        var data;
        response.Data.Data.each(function () {
            data = JSON.parse(this.Public);
            this.TotalMethod = data[0];
            this.LogedIn = data[1];
            this.Public = data[2];
        });
    };
    Global.List.Bind({
        Name: 'Security',
        Grid: {
            columns: [
                { field: 'Name', title: 'Name', filter: true, click: onOpen },
                { field: 'Public', add: true, className: 'public',sorting:false },
                { field: 'LogedIn', add: true, className: 'logedin', sorting: false },
                { field: 'Designation', add: true, className: 'designation', sorting: false },
                { field: 'User', add: true, className: 'user', sorting: false },
                { field: 'NotAccess', add: true, className: 'notaccess', sorting: false }
            ],
            url: '/AccessArea/AppAccess/ControllerInfo',
            page: { "PageNumber": 1, "PageSize": 10 },
            Actions: [
                { click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>' }
            ],
            onDataBinding: onDataBinding,
            rowbound: onRowBound,
            selector:false
        },
        onComplete: function (grid) {
            gridModel = grid;
        },
        edit: false,
        remove: false
    });
    (function () {
        this.Public = function (model) {
            console.log(model);
            var data = { roleId: '00000000-0000-0000-0000-000000000000', controllerId: model.Id, rollType: 4 };
            removeAccess(data, 'Are you sure you want to remove Public access?');
        };
        this.LogedIn = function (model) {
            var data = { roleId: '00000000-0000-0000-0000-000000000000', controllerId: model.Id, rollType: 3 };
            removeAccess(data, 'Are you sure you want to remove LogedIn access?');
        };
        this.Designation = function (model) {
            //Guid roleId, int accessType, Guid categoryId
            var data = { roleId: model.Id, controllerId: model.ControllerId, rollType: 0 };
            removeAccess(data, 'Are you sure you want to remove this Designation access?');
        };
        this.User = function (model) {
            var data = { roleId: model.Id, controllerId: model.ControllerId, rollType: 1 };
            removeAccess(data, 'Are you sure you want to remove this User access?');
        };
        this.NotAccess = function (model) {
            var data = { roleId: model.Id, controllerId: model.ControllerId, rollType: 2 };
            removeAccess(data, 'Are you sure you want to remove this User Not access?');
        };
    }).call(service.Remove = {});
    (function () {
        function giveAccess(model,type,name) {
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: {
                    name: 'Set ' + name + ' Access',
                    Message: 'Are you sure you want to give ' + name + ' access to this controller?',
                    Save: '/AccessArea/AppAccess/SetControllerAcces',
                    data: { roleId: '00000000-0000-0000-0000-000000000000', controllerId: model.Id, rollType: type },
                    onsavesuccess: function () {
                        gridModel.Reload();
                    }
                }
            });
        };
        this.Public = function (model) {
            giveAccess(model, 4, 'Public');
        };
        this.LogedIn = function (model) {
            giveAccess(model, 3, 'LogedIn');
        };
        this.Designation = function (model) {
            Global.Add({
                url: '/Areas/AccessArea/Content/SetControllerAccess.js?Designation=Designation',
                onSaveSuccess: function () {
                    gridModel.Reload();
                },
                dpr: '/Designation/AutoComplete',
                Type: 0,
                Name: 'Designation',
                model: model
            });
        };
        this.User = function (model) {
            Global.Add({
                //url: '/Areas/MenuArea/Content/MenuAccess/SetCategoryUserAccess.js?User=User',
                url: '/Areas/AccessArea/Content/SetControllerAccess.js?User=User',
                onSaveSuccess: function () {
                    gridModel.Reload();
                },
                dpr: '/EmployeeArea/Employee/AutoComplete',
                Type: 1,
                Name: 'User',
                model: model
            });
        };
        this.NotAccess = function (model) {
            Global.Add({
                //url: '/Areas/MenuArea/Content/MenuAccess/SetCategoryUserAccess.js?User=User',
                url: '/Areas/AccessArea/Content/SetControllerAccess.js?UserNot=UserNot',
                onSaveSuccess: function () {
                    gridModel.Reload();
                },
                dpr: '/EmployeeArea/Employee/AutoComplete',
                Type: 2,
                Name: 'UserNot',
                model: model
            });
        };
    }).call(service.Add = {});
})();

