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
        document.title = 'Menu Items of ' + callerOptions.model.Name;
        windowModel.View.find('.widget-title h4').html(document.title);
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
            that.Grid.Reload(options.model.Id);
        } else {
            Global.LoadTemplate('/Areas/Account/Templates/SubMenu.html', function (response) {
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
        var gridModel, baseId;
        function onOpen() {
            var model = $(this).closest('tr').data('model');
            Global.Add({
                url: '/Areas/Account/Scripts/SetAccess.js',
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
                Save:'/Securities/RemoveAccess',
                data: { roleId: model.Id, actionMethodId: model.ActionMethodId },
                onsavesuccess: function () {
                    gridModel.Reload();
                    callerOptions.OnChange();
                }
            };
            Global.Controller.Call({
                url: '/Content/TigerService/Js/WarningController',
                functionName: 'Show',
                options: opts
            });
        }
        function onRowBound(elm) {
            elm.find('.url_field').html('<a href="' + this.Url + '">' + this.Url + '</a>');
        };
        this.Reload = function (id) {
            baseId = id;
            gridModel && gridModel.Reload();
        };
        this.Set = function (id) {
            baseId = id;
            Global.List.Bind({
                Name: 'ActionMethod',
                Grid: {
                    elm: windowModel.View.find('#sub_menu_table_container'),
                    columns: [
                        { field: 'Name', filter: true },
                        { field: 'DisplayName', title: 'Display Name', filter: true },
                        { field: 'Url', filter: true,className:'url_field' },
                        { field: 'Position', title: 'Position' }
                    ],
                    url: function () { return '/MenuList/GetSubMenu?baseId=' + baseId },
                    rowbound: onRowBound,
                    Actions: [
                                { click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>' }
                            ]
                },
                Add: {
                    save: '/SubMenu/Add',
                    onSubmit: function (model) {

                    }
                },
                remove: false,
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
