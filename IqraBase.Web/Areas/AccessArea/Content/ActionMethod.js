//var Controller = new function () {
//    this.Wait = true;
//    var that = this, name = 'ActionMethod',oldTitle = document.title, windowModel, callerOptions;
//    function cancel() {
//        windowModel.Hide(function () {
//        });
//        document.title = oldTitle;
//    };
//    function populate(model) {
//    };
//    function show(model) {
//        windowModel.Show();
//        oldTitle = document.title;
//        document.title = 'Action Methods of ' + callerOptions.model.Name;
//        windowModel.View.find('.widget-title h4').html(document.title);
//    }
//    this.Show = function (options) {
//        callerOptions = options;
//        if (windowModel) {
//            show(options.model);
//            that.Grid.Reload(options.model.Id);
//        } else {
//            Global.LoadTemplate('/Areas/AccessArea/Templates/Add.html', function (response) {
//                Global.Free();
//                windowModel = Global.Window.Bind(response);
//                show(options.model);
//                that.Grid.Set(options.model.Id);
//                that.EventsBind();
//            }, function (response) {
//            });
//        }
//    }
//    this.Grid = new function () {
//        var gridModel, controllerId;
//        function onOpen() {
//            var model = $(this).closest('tr').data('model');
//            Global.Add({
//                url: '/Areas/AccessArea/Content/SetAccess.js',
//                onSaveSuccess: function () {
//                    gridModel.Reload();
//                    callerOptions.OnChange();
//                },
//                model: model
//            });
//        }
//        function removeAccess(model) {
//            var opts = {
//                name: 'Access',
//                Message:'Are you sure you want to remove this access?',
//                Save: '/AccessArea/AppAccess/RemoveAccess',
//                data: { roleId: model.Id, actionMethodId: model.ActionMethodId },
//                onsavesuccess: function () {
//                    gridModel.Reload();
//                    callerOptions.OnChange();
//                }
//            };
//            Global.Controller.Call({
//                url: '/Content/IqraService/Js/WarningController.js',
//                functionName: 'Show',
//                options: opts
//            });
//        }
//        function onRowBound(elm) {
//            this.Access = JSON.parse('[' + (this.Access||'') + ']');
//            var elm=elm.find('.roles'),model=this;
//            this.Access.each(function () {
//                var button = $('<span class="icon_container"><span>' + this.Name + '</span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-remove"></span></span>');
//                this.ActionMethodId = model.Id;
//                var access = this;
//                button.find('.glyphicon-remove').click(function () {
//                    removeAccess(access);
//                    return false;
//                })
//                elm.append(button);
//            });
//        };
//        this.Reload = function (id) {
//            controllerId = id;
//            gridModel && gridModel.Reload();
//        };
//        this.Set = function (id) {
//            controllerId = id;
//            //console.log(windowModel.View.find('#action_method_table_container'));
//            Global.List.Bind({
//                Name: 'ActionMethod',
//                Grid: {
//                    elm: windowModel.View.find('#action_method_table_container'),
//                    columns: [
//                        { field: 'Name', title: 'Name', filter: true },
//                        { field: '', title: 'Access', add: true, className: 'roles' }
//                    ],
//                    url: function () { return '/AccessArea/AppAccess/GetMethodInfo?ControllerId=' + controllerId },
//                    rowbound: onRowBound,
//                    Actions: [
//                                { click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>' }
//                            ]
//                }, edit:false, remove: false,
//                onComplete: function (grid) {
//                    gridModel = grid;
//                }
//            });
//        };
//    }
//    this.EventsBind = function () {
//        windowModel.View.find('.btn_cancel').click(cancel);
//    };
//};
//[{Name:"Admin",Id:1},{Name:"Coordinator",Id:2}]


var Controller = new function () {
    this.Wait = true;
    var that = this, oldTitle = document.title, windowModel, callerOptions;
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
                windowModel = Global.Window.Bind(response, { width: '95%' });
                show(options.model);
                that.Grid.Set(options.model.Id);
                windowModel.View.find('.btn_cancel').click(cancel);
            }, function (response) {
            });
        }
    };
    this.Grid = new function () {
        var gridModel, controllerId, service = {};
        function removeAccess(data, msg) {
            var opts = {
                name: 'RemoveAccess',
                Message: msg,
                Save: '/AccessArea/AppAccess/RemoveAccess',
                data: data,
                onsavesuccess: function (response) {
                    gridModel.Reload();
                    callerOptions.OnChange && callerOptions.OnChange(response);
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
            var elm = elm.find('.' + name.toLowerCase());
            model[name].each(function () {
                var button = $('<span class="icon_container" style="margin-right: 15px;"><span>' + this.Name + '</span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-remove"></span></span>');
                this.ActionMethodId = model.Id;
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
            controllerId = id;
            gridModel && gridModel.Reload();
        };
        this.Set = function (id) {
            controllerId = id;
            Global.Grid.Bind({
                elm: windowModel.View.find('#action_method_table_container'),
                columns: [
                    { field: 'Name', title: 'Name', filter: true },
                    { field: 'Public', add: true, className: 'public', sorting: false },
                    { field: 'LogedIn', add: true, className: 'logedin', sorting: false },
                    { field: 'Designation', add: true, className: 'designation', sorting: false },
                    { field: 'User', add: true, className: 'user', sorting: false },
                    { field: 'NotAccess', add: true, className: 'notaccess', sorting: false }
                ],
                url: function () { return '/AccessArea/AppAccess/GetMethodInfo?ControllerId=' + controllerId },
                rowBound: onRowBound,
                dataBinding: onDataBinding,
                onComplete: function (grid) {
                    gridModel = grid;
                },
                Printable: false,
                selector: false
            });
        };
        (function () {
            this.Public = function (model) {
                var data = { roleId: '00000000-0000-0000-0000-000000000000', actionMethodId: model.Id, rollType: 4 };
                removeAccess(data, 'Are you sure you want to remove Public access?');
            };
            this.LogedIn = function (model) {
                var data = { roleId: '00000000-0000-0000-0000-000000000000', actionMethodId: model.Id, rollType: 3 };
                removeAccess(data, 'Are you sure you want to remove LogedIn access?');
            };
            this.Designation = function (model) {
                var data = { roleId: model.Id, actionMethodId: model.ActionMethodId, accessType: 0 };
                removeAccess(data, 'Are you sure you want to remove this Designation access?');
            };
            this.User = function (model) {
                var data = { roleId: model.Id, actionMethodId: model.ActionMethodId, accessType: 1 };
                removeAccess(data, 'Are you sure you want to remove this User access?');
            };
            this.NotAccess = function (model) {
                var data = { roleId: model.Id, actionMethodId: model.ActionMethodId, accessType: 2 };
                removeAccess(data, 'Are you sure you want to remove this User Not access?');
            };
        }).call(service.Remove = {});
        (function () {
            var setting = {};
            function giveAccess(model, type, name) {
                Global.Controller.Call({
                    url: IqraConfig.Url.Js.WarningController,
                    functionName: 'Show',
                    options: {
                        name: 'Set ' + name + ' Access',
                        Message: 'Are you sure you want to give ' + name + ' access to this method?',
                        Save: '/AccessArea/AppAccess/SetAcces',
                        data: { roleId: '00000000-0000-0000-0000-000000000000', actionMethodId: model.Id, rollType: type },
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
                    url: '/Areas/AccessArea/Content/SetControllerAccess.js?Designation=Designation',
                    onSaveSuccess: function (response) {
                        gridModel.Reload();
                        callerOptions.OnChange && callerOptions.OnChange(response);
                    },
                    saveUrl: '/AccessArea/AppAccess/SetAcces',
                    field: 'actionMethodId',
                    Label: 'Action MethodId',
                    dpr: '/Designation/AutoComplete',
                    Name: 'Designation',
                    Type: 0,
                    model: model
                });
            };
            this.User = function (model) {
                Global.Add({
                    url: '/Areas/AccessArea/Content/SetControllerAccess.js?User=User',
                    onSaveSuccess: function (response) {
                        gridModel.Reload();
                        callerOptions.OnChange && callerOptions.OnChange(response);
                    },
                    saveUrl: '/AccessArea/AppAccess/SetAcces',
                    field: 'actionMethodId',
                    Label: 'Action MethodId',
                    dpr: '/EmployeeArea/Employee/AutoComplete',
                    Name: 'User',
                    Type: 1,
                    model: model
                });
            };
            this.NotAccess = function (model) {
                Global.Add({
                    url: '/Areas/AccessArea/Content/SetControllerAccess.js?UserNot=UserNot',
                    onSaveSuccess: function (response) {
                        gridModel.Reload();
                        callerOptions.OnChange && callerOptions.OnChange(response);
                    },
                    dpr: '/EmployeeArea/Employee/AutoComplete',
                    saveUrl: '/AccessArea/AppAccess/SetAcces',
                    field: 'actionMethodId',
                    Label: 'Action MethodId',
                    Name: 'UserNot',
                    Type: 2,
                    model: model
                });
            };
        }).call(service.Add = {});
    };
};
