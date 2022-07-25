ListController = Controller = new function () {
    var that = this;
    function bind(opts) {
        var that = this, gridModel, options;
        function edit() {
            var model = $(this).closest('tr').data('model');
            that.Add.Open(model);
        };
        function remove() {
            var model = $(this).closest('tr').data('model'), name = getName();
            name = name.substring(0, name.length - 1);
            option = options.remove || {};
            for (var key in option) { option[key.toLowerCase()] = option[key]; }
            if (!model.IsDeleted) {
                var opts = {
                    name: options.name,
                    data: { Id: model.Id },
                    onsavesuccess: function () {
                        gridModel.Reload();
                    }
                };
                Global.Copy(opts, option, true);
                Global.Controller.Call({
                    url: IqraConfig.Url.Js.WarningController,
                    functionName: 'Show',
                    options: opts
                });
            }
        };
        function rowBound(elm) {
            if (this.IsDeleted) {
                elm.addClass('removed').find('.btn_delete').addClass('disabled');
            }
            options.grid.rowbound && options.grid.rowbound.call(this, elm);
        };
        function getName() {
            var name = options.name + (options.name[options.name.length - 1] == 's' ? '' : 's');
            return name.replace(/[A-Z]/g, function (match) {
                return ' ' + match;
            });
        };
        this.Reload = function () {
            gridModel.Reload();
        };
        (function (that) {
            var grid = that.Grid = this, view;
            function getAction(option) {
                return Global.Copy({
                    title: {
                        items: option.pagger && option.pagger.items || IqraConfig.Grid.Pagger.PageSize,
                        selected: option.page.PageSize || IqraConfig.Grid.Pagger.Selected,
                        showingInfo: option.page.showingInfo || (option.pagger && option.pagger.showingInfo) || 'Showing {0} to {1}  of {2}  ' + getName()
                    },
                    items: option.actions,
                    className: 'action'
                }, option.action || {});
            };
            grid.Bind = function (option) {
                //for (var key in option) { option[key.toLowerCase()] = option[key]; }
                var model;
                Global.Grid.Bind(model = Global.Copy(Global.Copy({}, option, true), {
                    elm: option.elm || $('#' + options.name.toLowerCase() + '_table_container'),
                    url: option.url || '/' + options.name + 's/Get',
                    Action: getAction(option),
                    dataBinding: function (response) {
                        option.ondatabinding && option.ondatabinding(response);
                    },
                    rowBound: rowBound,
                    oncomplete: function (model) {
                        gridModel = model;
                        console.log(['gridModel', gridModel]);
                        options.oncomplete && options.oncomplete(model);
                    },
                }, true));

                console.log(['Global.Grid.Bind', model])
            };
        })(this);
        this.Add = new function () {
            var add = this;
            function show(model) {
                var opts = {
                    name: options.name,
                    columns: (gridModel.selector && gridModel.selector.columns) || gridModel.columns,
                    model: model,
                    onSaveSuccess: function (response) {
                        //console.log([response, gridModel]);
                        gridModel.Reload();
                        var func;
                        if (model && options.edit) {
                            func = (options.edit.onsavesuccess || options.edit.onsuccess) || (options.add ? (options.add.onsavesuccess || options.add.onsuccess) : '');
                        } else {

                            func = (options.add ? (options.add.onsavesuccess || options.add.onsuccess) : '') || (options.edit ? (options.edit.onsavesuccess || options.edit.onsuccess) : '');
                        }
                        func && func(response);
                    }
                };
                options.edit && Global.Copy(opts, options.edit || {}, true);
                options.add && Global.Copy(opts, options.add || {}, true);
                Global.Add(opts);
            };
            this.Open = function (model) {
                show(model);
            };
            this.Bind = function () {
                if (options.add != false) {
                    options.add = options.add || {};
                    options.add.elm = options.add.elm || $('#btn_add_new_' + that.Name.toLowerCase());
                    options.add.elm.length == 0 && (options.add.elm = $('#btn_add_new'));
                    options.add.elm.click(function () { show() });
                }
            };
        };
        (function (opts) {
            for (var key in opts) { opts[key.toLowerCase()] = opts[key]; }
            opts.grid = opts.grid || {};
            for (var key in opts.grid) { opts.grid[key.toLowerCase()] = opts.grid[key]; }
            options = opts;
            that.Name = options.name;
            options.grid = options.grid || {};
            options.grid.page = options.grid.page || { "PageNumber": 1, "PageSize": 10 };
            options.grid.actions = options.grid.actions || [];
            options.edit != false && options.grid.actions.push({
                click: edit,
                html: '<span class="icon_container"><span class="glyphicon glyphicon-edit"></span></span>'
            });
            options.remove != false && options.grid.actions.push({
                click: remove,
                html: '<span class="icon_container" style="margin-left: 5px;"><span class="glyphicon glyphicon-trash"></span></span>'
            });
            that.Grid.Bind(options.grid);
            that.Add.Bind();
            return that;
        })(opts);
    };
    that.Bind = function (opts) {
        return new bind(opts);
    }
};


