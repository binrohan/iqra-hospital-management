var Controller = new function () {
    this.Wait = true;
    var that = this, name = 'ActionMethod',oldTitle = document.title, windowModel, callerOptions;
    
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
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
            that.Grid.Reload(options.model.Id);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/Security/Add.html', function (response) {
                Global.Free();
                windowModel = Global.Window.Bind(response);
                show(options.model);
                that.Grid.Set(options.model.Id);
                that.EventsBind();
            }, function (response) {
            });
        }
    }
    this.Grid = new function () {
        var gridModel, controllerId;
        function onOpen(model) {
            //var model = $(this).closest('tr').data('model');
            Global.Add({
                url: '/Content/IqraPharmacy/EmployeeArea/Content/Security/SetAccess.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                    callerOptions.OnChange();
                },
                model: model
            });
        }
        function removeAccess(model) {
            var opts = {
                name: 'Access',
                Message:'Are you sure you want to remove this access?',
                Save: '/Security/RemoveAccess',
                data: { groupId: model.Id, actionMethodId: model.ActionMethodId },
                onsavesuccess: function () {
                    gridModel.Reload();
                    callerOptions.OnChange();
                }
            };
            Global.Controller.Call({
                url: '/Content/IqraService/Js/WarningController',
                functionName: 'Show',
                options: opts
            });
        }
        function onRowBound(elm) {
            this.Roles = JSON.parse('[' + this.Roles + ']');
            var elm=elm.find('.roles'),model=this;
            this.Roles.each(function () {
                var button = $('<span class="icon_container"><span>' + this.Name + '</span><span style="font-size:10px; margin-left:5px;" class="glyphicon glyphicon-remove"></span></span>');
                this.ActionMethodId = model.Id;
                var access = this;
                console.log(button.find('.glyphicon-remove').click(function () {
                    console.log(this);
                    removeAccess(access);
                    return false;
                }));
                elm.append(button);
            });
        };
        this.Reload = function (id) {
            controllerId = id;
            gridModel && gridModel.Reload();
        };
        this.Set = function (id) {
            controllerId = id;
            console.log(windowModel.View.find('#action_method_table_container'));
            Global.List.Bind({
                Name: 'ActionMethod',
                Grid: {
                    elm: windowModel.View.find('#action_method_table_container'),
                    columns: [
                        { field: 'Name', title: 'Name', filter: true },
                        { field: '', title: 'Roles', add: true,className:'roles' }
                    ],
                    url: function () { return '/Security/ActionMethods?ControllerId=' + controllerId },
                    rowbound: onRowBound,
                    Actions: [
                                { click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>' }
                            ]
                }, edit:false, remove: false,
                onComplete: function (grid) {
                    gridModel = grid;
                }
            });
        };
    }
    this.EventsBind = function () {
        windowModel.View.find('.btn_cancel').click(cancel);
    };
};
//[{Name:"Admin",Id:1},{Name:"Coordinator",Id:2}]
