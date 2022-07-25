
(function () {
    var gridModel, service = {};
    function onOpen(model) {
        Global.Add({
            url: '/Areas/MenuArea/Content/MenuAccess/MenuAccess.js',
            OnChange: function () {
                gridModel.Reload();
            },
            model: model
        });
    };
    function removeAccess(data,msg) {
        var opts = {
            name: 'Access',
            Message: msg,
            Save: '/MenuArea/MenuAccess/RemoveCategoryAccess',
            data: data,
            onsavesuccess: function () {
                gridModel.Reload();
                //callerOptions.OnChange();
            }
        };
        Global.Controller.Call({
            url: '/Content/IqraService/Js/WarningController.js',
            functionName: 'Show',
            options: opts
        });
    };
    function onParse(elm,model,name) {
        model[name] = JSON.parse('[' + (model[name] || '') + ']');
        var elm = elm.find('.' + name.toLowerCase()).empty();
        model[name].each(function () {
            var button = $('<span class="icon_container" style="margin-right: 15px;"><span>' + this.Name + '</span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-remove"></span></span>');
            this.CategoryId = model.Id;
            Global.Click(button.find('.glyphicon-remove'), service.Remove[name], this);
            elm.append(button);
        });
        var add = $('<a class="icon_container"><span>Add</span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-plus"></span></a>');
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
            elm:$('#grid'),
            columns: [
                { field: 'Name', title: 'Name', filter: true, click: onOpen },
                { field: 'Public', add: true, className: 'public', sorting: false },
                { field: 'LogedIn', add: true, className: 'logedin', sorting: false },
                { field: 'Description', filter: true },
                { field: 'Designation', add: true, className: 'designation' },
                { field: 'User', add: true, className: 'user' },
                { field: 'NotAccess', add: true, className: 'notaccess' }
            ],
            url: '/MenuArea/MenuAccess/Get',
            page: { "PageNumber": 1, "PageSize": 10 },
            Actions: [
                { click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>' }
            ],
            onDataBinding: onDataBinding,
            rowbound: onRowBound
        },
        onComplete: function (grid) {
            gridModel = grid;
        },
        edit: false,
        remove: false
    });
    (function () {
        this.Public = function (model) {
            var data = { roleId: '00000000-0000-0000-0000-000000000000', categoryId: model.Id, accessType: 4 };
            removeAccess(data, 'Are you sure you want to remove Public access?');
        };
        this.LogedIn = function (model) {
            var data = { roleId: '00000000-0000-0000-0000-000000000000', categoryId: model.Id, accessType: 3 };
            removeAccess(data, 'Are you sure you want to remove LogedIn access?');
        };
        this.Designation = function (model) {
            //Guid roleId, int accessType, Guid categoryId
            var data = { roleId: model.Id, categoryId: model.CategoryId, accessType: 0 };
            removeAccess(data, 'Are you sure you want to remove this Designation access?');
        };
        this.User = function (model) {
            var data = { roleId: model.Id, categoryId: model.CategoryId, accessType: 1 };
            removeAccess(data, 'Are you sure you want to remove this User access?');
        };
        this.NotAccess = function (model) {
            var data = { roleId: model.Id, categoryId: model.CategoryId, accessType: 2 };
            removeAccess(data, 'Are you sure you want to remove this User Not access?');
        };
    }).call(service.Remove = {});
    (function () {
        function giveAccess(model, type, name) {
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: {
                    name: 'Set ' + name + ' Access',
                    Message: 'Are you sure you want to give ' + name + ' access to this Menu Category?',
                    Save: '/MenuArea/MenuAccess/SetCategoryAccess',
                    data: { roleId: '00000000-0000-0000-0000-000000000000', categoryId: model.Id, rollType: type },
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
                url: '/Areas/MenuArea/Content/MenuAccess/SetCategoryDesignationAccess.js?Designation=Designation',
                onSaveSuccess: function () {
                    gridModel.Reload();
                },
                dpr: '/Designation/AutoComplete',
                Type: 0,
                Name:'Designation',
                model: model
            });
        };
        this.User = function (model) {
            Global.Add({
                //url: '/Areas/MenuArea/Content/MenuAccess/SetCategoryUserAccess.js?User=User',
                url: '/Areas/MenuArea/Content/MenuAccess/SetCategoryDesignationAccess.js?User=User',
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
                url: '/Areas/MenuArea/Content/MenuAccess/SetCategoryDesignationAccess.js?UserNot=UserNot',
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
