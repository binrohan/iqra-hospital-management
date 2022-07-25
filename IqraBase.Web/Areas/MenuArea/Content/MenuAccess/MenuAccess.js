var Controller = new function () {
    this.Wait = true;
    var that = this, name = 'ActionMethod', oldTitle = document.title, windowModel, callerOptions;

    function cancel() {
        windowModel.Hide(function () {
        });
        document.title = oldTitle;
    };
    function populate(model) {

    };
    function show(model) {
        windowModel.Show();
        oldTitle = document.title;
        document.title = 'Action Methods of ' + callerOptions.model.Name;
        windowModel.View.find('.widget-title h4').html(document.title);
    };
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
            that.Grid.Reload(options.model.Id);
        } else {
            Global.LoadTemplate('/Areas/AccessArea/Templates/Add.html', function (response) {
                Global.Free();
                windowModel = Global.Window.Bind(response,{width:'95%'});
                show(options.model);
                that.Grid.Set(options.model.Id);
                that.EventsBind();
            }, function (response) {
            });
        }
    };
    this.Grid = new function () {
        var gridModel, categoryId, service = {};
        function onOpen() {
            var model = $(this).closest('tr').data('model');
            Global.Add({
                url: '/Areas/AccessArea/Content/SetAccess.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                    callerOptions.OnChange();
                },
                model: model
            });
        }
        function removeAccess(data, msg) {
            var opts = {
                name: 'Access',
                Message: msg,
                Save: '/MenuArea/MenuAccess/RemoveAccess',
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
        function onParse(elm, model, name) {
            model[name] = JSON.parse('[' + (model[name] || '') + ']');
            var elm = elm.find('.' + name.toLowerCase()).empty();;
            model[name].each(function () {
                var button = $('<span class="icon_container" style="margin-right: 15px;"><span>' + this.Name + '</span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-remove"></span></span>');
                this.MenuId = model.Id;
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
                var button = $('<span class="icon_container" style="margin-right: 15px;"><span> Has Access</span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-remove"></span></span>');
                Global.Click(button.find('.glyphicon-remove'), service.Remove[name], model);
                elm.append(button);
            };
            if (model[name] < model.TotalMethod) {
                var add = $('<a class="icon_container"><span>Add</span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-plus"></span></a>');
                Global.Click(add, service.Add[name], model);
                elm.append(add);
            }
            //console.log([elm, model, name, model[name]]);
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
                this.TotalMethod = 1;
                this.LogedIn = data[0];
                this.Public = data[1];
            });
        };
        this.Reload = function (id) {
            categoryId = id;
            gridModel && gridModel.Reload();
        };
        this.Set = function (id) {
            categoryId = id;
            //console.log(windowModel.View.find('#action_method_table_container'));
            Global.Grid.Bind({
                elm: windowModel.View.find('#action_method_table_container'),
                columns: [
                    { field: 'Name', title: 'Name', filter: true, width: 150 },
                    { field: 'Description', filter: true },
                    { field: 'Public', add: true, className: 'public', sorting: false },
                    { field: 'LogedIn', add: true, className: 'logedin', sorting: false },
                    { field: 'Designation', add: true, className: 'designation' },
                    { field: 'User', add: true, className: 'user' },
                    { field: 'NotAccess', add: true, className: 'notaccess' }
                ],
                url: function () { return '/MenuArea/MenuAccess/GetByCategory?CategoryId=' + categoryId },
                rowBound: onRowBound,
                dataBinding: onDataBinding,
                onComplete: function (grid) {
                    gridModel = grid;
                },
                Printable: false
            });
        };
        (function () {
            this.Public = function (model) {
                var data = { roleId: '00000000-0000-0000-0000-000000000000', menuId: model.Id, accessType: 4 };
                removeAccess(data, 'Are you sure you want to remove Public access?');
            };
            this.LogedIn = function (model) {
                var data = { roleId: '00000000-0000-0000-0000-000000000000', menuId: model.Id, accessType: 3 };
                removeAccess(data, 'Are you sure you want to remove LogedIn access?');
            };
            this.Designation = function (model) {
                //Guid roleId, int accessType, Guid categoryId
                var data = { roleId: model.Id, menuId: model.MenuId, accessType: 0 };
                removeAccess(data, 'Are you sure you want to remove this Designation access?');
            };
            this.User = function (model) {
                var data = { roleId: model.Id, menuId: model.MenuId, accessType: 1 };
                removeAccess(data, 'Are you sure you want to remove this User access?');
            };
            this.NotAccess = function (model) {
                var data = { roleId: model.Id, menuId: model.MenuId, accessType: 2 };
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
                        Message: 'Are you sure you want to give ' + name + ' access to this menu?',
                        Save: '/MenuArea/MenuAccess/SetAcces',
                        data: { roleId: '00000000-0000-0000-0000-000000000000', menuId: model.Id, rollType: type },
                        //var model = { roleId: formModel.RoleId, menuId: callerOptions.model.Id, rollType: callerOptions.Type };
                        onsavesuccess: function (response) {
                            gridModel.Reload();
                            callerOptions.OnChange && callerOptions.OnChange(response);
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
                    url: '/Areas/MenuArea/Content/MenuAccess/SetMenuAccess.js?Designation=Designation',
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
                    url: '/Areas/MenuArea/Content/MenuAccess/SetMenuAccess.js?User=User',
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
                    url: '/Areas/MenuArea/Content/MenuAccess/SetMenuAccess.js?UserNot=UserNot',
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
    };
    this.EventsBind = function () {
        windowModel.View.find('.btn_cancel').click(cancel);
    };
};
//[{Name:"Admin",Id:1},{Name:"Coordinator",Id:2}]
