
var Controller = new function () {
    var windowModel, formModel = {}, callerOptions, savedData, service = {}, gridModel;
    function save() {
        windowModel.Wait('Please Wait while saving data......');
        var data = {
            Id: callerOptions.model.id,
            RelationType: callerOptions.model.setting.relationtype || 'Aplication',
            Content: JSON.stringify(service.Grid.GetData())
        };
        console.log(['data', data]);
        Global.CallServer('/IqraGridArea/IqraGrid/Add', function (response) {
            windowModel.Free();
            if (!response.IsError) {
                callerOptions.Success(data.Content);
                close();
                service.Choice.Close();
                localStorage.removeItem(callerOptions.model.id);
            }
        }, function (response) {
            windowModel.Free();
        }, data, 'POST');
    };
    function saveBrowser() {
        var data = service.Grid.GetData();
        localStorage.setItem(callerOptions.model.id, JSON.stringify(data));
        callerOptions.Success(data.Content);
        service.Choice.Close();
        close();
    };
    function remove() {
        windowModel.Wait('Please Wait while saving data......');
        Global.CallServer('/IqraGridArea/IqraGrid/Remove?Id=' + callerOptions.model.id, function (response) {
            windowModel.Free();
            if (!response.IsError) {
                callerOptions.Success({});
                close();
                service.Choice.Close();
                localStorage.removeItem(callerOptions.model.id);
            }
        }, function (response) {
            windowModel.Free();
        }, {}, 'POST');
    };
    function removeBrowser() {
        localStorage.removeItem(callerOptions.model.id);
        callerOptions.Success({});
        close();
        service.Choice.Close();
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function setDefault(name, cName) {
        if (typeof savedData[name] != typeof none) {
            savedData[name] = savedData[name];
        } else if (typeof callerOptions.model[name] != typeof none) {
            savedData[name] = callerOptions.model[name];
        } else {
            savedData[name] = IqraConfig.Grid[cName] || false;
        }
        formModel[name] = savedData[name];
    };
    function setFilter(col) {
        if (typeof col.filter != typeof none) {
            if (typeof col.filter != typeof col) {
                col.filter = col.filter ? (this.filter ? this.filter : true) : false;
            }
        } else {
            col.filter = this.filter;
        }

        if (typeof col.filter === typeof col) {
            col.filterObject = col.filter;
            col.filter = true;
        }
    };
    function populate() {
        var dic = {};
        savedData = callerOptions.savedData || {};

        setDefault('responsive', 'Responsive');
        setDefault('printable', 'Printable');
        setDefault('selector', 'selector');
        setDefault('resizable', 'resizable');
        savedData.columns = savedData.columns || [];

        savedData.columns.each(function () {
            dic[this.field] = this;
        });
        var list = [], col, colOrder = 0,
            maxOrder = savedData.columns.length,
            columns = callerOptions.model.selector ? callerOptions.model.selector.columns : callerOptions.model.columns;

        columns.each(function (i) {
            col = dic[this.field] ? Global.Copy({}, dic[this.field], true) : none;
            if (col) {
                col.Index = i + 1;
                col.order = colOrder++;

                col.selected = (this.selected === false ? false : true),
                setFilter.call(this, col);
                col.sorting = typeof col.sorting != typeof none ? col.sorting : (this.sorting === false ? false : true);
                col.title = col.title ? col.title : (this.title || this.field);
                col.width = (this.width ? this.width : '');
                list.push(col);
            } else {
                col = {
                    field: this.field,
                    selected: (this.selected === false ? false : true),
                    //filter: (this.filter ? true : false),
                    sorting: (this.sorting === false ? false : true),
                    title: this.title || this.field,
                    width: this.width ? this.width : '',
                    Index: i + 1,
                    order: maxOrder++
                };
                setFilter.call(this, col);
                list.push(col);
            }
        });
        service.Grid.Set(list.orderBy('order'));
        console.log(['callerOptions', callerOptions]);
    };
    function createView() {
        windowModel = Global.Window.Bind('<div class="formBody">' +
                '<div class="row formHeader headerFormMenu">' +
                    '<div style="float: left" class="widget-title">' +
                        '<h4 style="margin:5px;" class="auto_bind" data-binding="Title">Grid Editor</h4>' +
                    '</div><span class="pull-right button_container">' +
                        '<a class="button btn_cancel"><span class="glyphicon glyphicon-remove"></span></a>' +
                    '</span>' +
                '</div>' +
                '<div class="middleForm">' +
                    '<div class="attr_container">' +
                        '<label class="lbl_selector"><input type="checkbox" data-binding="responsive" /> Is Responsive </label>' +
                        '<label class="lbl_selector" style="margin-left: 15px;"><input type="checkbox" data-binding="printable" /> Is Printable </label>' +
                        '<label class="lbl_selector" style="margin-left: 15px;"><input type="checkbox" data-binding="selector" /> Is Column Selector </label>' +
                        '<label class="lbl_selector" style="margin-left: 15px;"><input type="checkbox" data-binding="resizable" /> Is Column Resizable </label>' +
                    '</div>' +
                    '<div class="grid_container">' +

                    '</div>' +
                    '<div class="row">' +
                        '<div class="text-center formFooter FooterFormMenu">' +
                            '<button class="btn btn_save btn-white btn-default btn-round" type="button" style="margin-right: 10px;"><span class="glyphicon glyphicon-save"></span> Save </button>' +
                            '<button class="btn btn_remove btn-white btn-default btn-round" type="button" style="margin-right: 10px;"><span class="glyphicon glyphicon-trash"></span> Remove </button>' +
                            '<button class="btn btn_cancel btn-white btn-default btn-round" type="button"> <span class="glyphicon glyphicon-remove"></span> Cancel </button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>');
        Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(close);
        Global.Click(windowModel.View.find('.btn_save'), service.Choice.Open, true);
        Global.Click(windowModel.View.find('.btn_remove'), service.Choice.Open);
        windowModel.Show();
        populate();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            createView();
        }
    };
    (function () {
        var len = 0;
        function goUp(model, elm) {
            var pElm = elm.prev(), index = model.Index - 1, temp = gridModel.dataSource[index], temp2 = gridModel.dataSource[index - 1];
            gridModel.dataSource[index] = temp2;
            gridModel.dataSource[index - 1] = temp;
            temp.Index--;
            temp2.Index++;
            pElm.before(elm);
            if (temp.Index === 1) {
                elm.find('.order').empty();
                bindOrder(temp2, pElm);
            }
        };
        function bindOrder(model, elm) {
            if (model.Index > 1) {
                var btn = $('<a title="Go Up" style="font-size: 1.5em;"><span class="glyphicon glyphicon-chevron-up"></span></a>');
                elm.find('.order').empty().append(btn);
                Global.Click(btn, goUp, model, false, elm);
            } else {
                elm.find('.order').empty();
            }
        };
        function rowBound(elm) {
            elm.find('.slted').empty().append('<label><input type="checkbox" data-binding="selected" /> </label>');
            elm.find('.filter').empty().append('<label><input type="checkbox" data-binding="filter" /> </label>');
            elm.find('.sorting').empty().append('<label><input type="checkbox" data-binding="sorting" /> </label>');
            elm.find('.title').empty().append('<input data-binding="title" class="form-control" data-type="string" style="max-width: calc(100% - 14px);" type="text">');
            elm.find('.width').empty().append('<input data-binding="width" class="form-control" data-type="string" style="max-width: calc(100% - 14px);" type="text">');
            bindOrder(this, elm);
            var pModel = this.FormModel;
            this.FormModel = this.FormModel || {};
            Global.Form.Bind(this.FormModel, elm);
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
            if (pModel) {
                for (var key in pModel) { this.FormModel[key] = pModel[key]; }
            }
        };
        function bind(list) {
            Global.Grid.Bind({
                elm: windowModel.View.find('.grid_container'),
                columns: [
                    { field: 'Index', title: 'SL#', sorting: false },
                    //{ field: 'field', title: 'Field', sorting: false },
                    { field: 'selected', title: 'Is Selected', sorting: false, autoBind: false, className: 'slted' },
                    { field: 'filter', sorting: false, title: 'Is Filterable', autoBind: false, className: 'filter' },
                    { field: 'sorting', sorting: false, title: 'Is Sorting', autoBind: false, className: 'sorting' },
                    { field: 'title', sorting: false, title: 'Title', autoBind: false, className: 'title', width: '20%' },
                    { field: 'width', sorting: false, title: 'Width', autoBind: false, className: 'width', width: '20%' },
                    { field: 'order', sorting: false, title: 'Actions', autoBind: false, className: 'order action' }
                ],
                dataSource: list,
                page: { 'PageNumber': 1, 'PageSize': 1000 },
                rowBound: rowBound,
                action: {
                    title: 'Actions',
                    items: [
                        {
                            click: service.Filter.Open,
                            html: '<span class="icon_container btn_add_files" title="Add Files"><span class="glyphicon glyphicon-open"></span></span>'
                        }
                    ],
                    className: 'action'
                },

                pagger: false,
                pagging: false,
                Printable: false,
                responsive: false,
                selector: false,
                onComplete: function (model) {
                    gridModel = model;
                },
            })
        };

        this.Set = function (list) {
            len = list.length;
            if (gridModel) {
                gridModel.dataSource = list;
                gridModel.Reload();
            } else {
                bind(list);
            }
        };
        this.GetData = function () {
            var model = {
                Version: parseFloat((callerOptions.model.version || IqraConfig.Version || 0) + ''),
                responsive: formModel.responsive,
                printable: formModel.printable,
                selector: formModel.selector,
                resizable: formModel.resizable,
                columns: []
            };
            gridModel.dataSource.each(function (i) {
                var item = {
                    order: i,
                    field: this.field,
                    selected: this.FormModel.selected,
                    filter: this.FormModel.filter ? this.filterObject ? this.filterObject : true : false,
                    sorting: this.FormModel.sorting,
                    title: this.FormModel.title,
                    width: this.FormModel.width.trim().toLowerCase()
                };
                if (item.width && item.width != 'fit' && item.width[item.width.length - 1] != '%') {
                    item.width = parseFloat(item.width);
                }
                model.columns.push(item);
            });
            return model;
        };
    }).call(service.Grid = {});
    (function () {
        var filterView, filterFormModel = {}, filterGrid, filterService = {}, callarOptions, valuefield, textfield, drp = {};
        function getCol(field, title) {
            return '<section class="col-sm-6 col col-md-6">' +
                        '<div><label for="' + field + '">' + title + '</label></div>' +
                        '<div class="input-group">' +
                            '<input data-type="string" data-binding="' + field + '" class="form-control" type="text">' +
                        '</div>' +
                    '</section>';
        };
        function getRow(field1, title1, field2, title2) {
            return '<div class="row">' +
                        getCol(field1, title1) +
                        getCol(field2, title2) +
                    '</div>';
        };
        function setDRP(inputs) {
            callarOptions.filterObject = callarOptions.filterObject || {};
            drp.Type = {
                elm: $(inputs['type']),
                dataSource: [
                    { text: 'Multi-Select', value: '' },
                    { text: 'Auto-Complete', value: '1' },
                    { text: 'Multi-Select  and Search By Text', value: '2' }
                ],
                selectedValue: callarOptions.filterObject.type
            };
            drp.Display = {
                elm: $(inputs['displaytype']),
                dataSource: [
                    { text: 'Search By Text', value: '' },
                    { text: 'Multi-Select', value: '1' }
                ],
                selectedValue: callarOptions.filterObject.displaytype
            };
            Global.DropDown.Bind(drp.Type);
            Global.DropDown.Bind(drp.Display);
        };
        function createView(list) {
            filterView = Global.Window.Bind('<div class="formBody">' +
                    '<div class="row formHeader headerFormMenu">' +
                        '<div style="float: left" class="widget-title">' +
                            '<h4 style="margin:5px;">Grid Filter Editor</h4>' +
                        '</div><span class="pull-right button_container">' +
                            '<a class="button btn_cancel"><span class="glyphicon glyphicon-remove"></span></a>' +
                        '</span>' +
                    '</div>' +
                    '<div class="middleForm">' +
                        '<div class="attr_container">' +
                            getRow('type', 'Search Type', 'displaytype', 'First Display Type') +
                            getRow('field', 'Search By', 'url', 'Data Url') +
                            getRow('valuefield', 'Data Value Field', 'textfield', 'Data Title Field') +
                        '</div>' +
                        '<div class="empty_style button_container row">' +
                            '<a class="btn btn-white btn-default btn-round pull-right btn_add_new_row" style="margin: 0px;"><span class="glyphicon glyphicon-plus"></span>New</a>' +
                        '</div>' +
                        '<div class="grid_container">' +

                        '</div>' +
                        '<div class="row">' +
                            '<div class="text-center formFooter FooterFormMenu">' +
                                '<button class="btn btn_save btn-white btn-default btn-round" type="button" style="margin-right: 10px;"><span class="glyphicon glyphicon-save"></span> Save </button>' +
                                '<button class="btn btn_cancel btn-white btn-default btn-round" type="button"> <span class="glyphicon glyphicon-remove"></span> Cancel </button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>');
            setDRP(Global.Form.Bind(filterFormModel, filterView.View));
            filterView.View.find('.btn_cancel').click(close);
            Global.Click(filterView.View.find('.btn_save'), save);
            Global.Click(filterView.View.find('.btn_add_new_row'), filterService.Grid.AddNew);
            show(list);
        };

        function save() {
            var model = filterService.Grid.GetData();
            if (!model.IsValid) {
                alert(model.Msg);
                return;
            }
            model = {
                datasource: model.dataSource.length ? model.dataSource : none,
                type: filterFormModel.type ? parseInt(filterFormModel.type) : none,
                displaytype: filterFormModel.displaytype ? parseInt(filterFormModel.displaytype) : none,
                field: filterFormModel.field ? filterFormModel.field : none,
                url: filterFormModel.url ? filterFormModel.url : none,
                valuefield: filterFormModel.valuefield ? filterFormModel.valuefield : none,
                textfield: filterFormModel.textfield ? filterFormModel.textfield : none,
            };
            console.log(['model', model, filterModel]);
            callarOptions.filterObject = model;
            close();
        };
        function close() {
            filterView && filterView.Hide();
        };

        function populate(model) {
            console.log(['model', model, drp.Type && drp.Type.val]);
            for (var key in filterFormModel) {
                if (model[key]) {
                    filterFormModel[key] = model[key];
                } else {
                    filterFormModel[key] = '';
                }
            }
            if (drp.Type && drp.Type.val) {
                drp.Type.val(model.type);
                drp.Display.val(model.displaytype);
            }
        };
        function show(list) {
            filterView.Show();
            populate(callarOptions.filterObject);
            filterService.Grid.Set(list);
        };
        function setData(model) {
            model.filterObject = model.filterObject || {};
            model.filterObject.datasource = model.filterObject.datasource || [];
            var list = [], valuefield = model.filterObject.valuefield || 'Id', textfield = model.filterObject.textfield || 'Name';
            model.filterObject.datasource.each(function () {
                list.push({ Title: this[textfield], Value: this[valuefield] });
            });
            return list;
        };
        this.Open = function (model) {
            callarOptions = model;
            var list = setData(model);
            if (filterView) {
                show(list);
            } else {
                createView(list);
            }
        };
        (function () {
            var len = 0, id = 0;
            function goUp(model, elm) {
                var pElm = elm.prev(), index = model.Index - 1,
                    temp = filterGrid.dataSource[index],
                    temp2 = filterGrid.dataSource[index - 1];

                filterGrid.dataSource[index] = temp2;
                filterGrid.dataSource[index - 1] = temp;
                temp.Index--;
                temp2.Index++;
                pElm.before(elm);
                if (temp.Index === 1) {
                    elm.find('.order').empty();
                    bindOrder(temp2, pElm);
                }
            };
            function bindOrder(model, elm) {
                if (model.Index > 1) {
                    var btn = $('<a title="Go Up" style="font-size: 1.5em;"><span class="glyphicon glyphicon-chevron-up"></span></a>');
                    elm.find('.order').empty().append(btn);
                    Global.Click(btn, goUp, model, false, elm);
                } else {
                    elm.find('.order').empty();
                }
            };
            function rowBound(elm) {
                elm.find('.title').empty().append('<input data-binding="Title" required="" class="form-control" data-type="string" style="max-width: calc(100% - 14px);" type="text">');
                elm.find('.value').empty().append('<input data-binding="Value" required="" class="form-control" data-type="string" style="max-width: calc(100% - 14px);" type="text">');
                bindOrder(this, elm);
                var pModel = this.FormModel;
                this.Id = id++;
                this.FormModel = {};
                Global.Form.Bind(this.FormModel, elm);
                for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
                if (pModel) {
                    for (var key in pModel) { this.FormModel[key] = pModel[key]; }
                }
            };
            function setIndex() {
                filterGrid.Body.view.find('tr').each(function (i) {
                    var model = $(this).data('model');
                    model.Index = i + 1;
                });
            }
            function onRemove(model) {
                var elm = $(this).closest('tr'), newList = [];
                filterGrid.dataSource.each(function () {
                    this.Id != model.Id && newList.push(this);
                });
                filterGrid.dataSource = newList;
                elm.remove();
                setIndex();
            };

            function bind(list) {
                Global.Grid.Bind({
                    elm: filterView.View.find('.grid_container'),
                    columns: [
                        { field: 'Index', title: 'SL#', sorting: false },
                        { field: 'Title', title: 'Title', autoBind: false, className: 'title' },
                        { field: 'Value', autoBind: false, className: 'value' },
                        { field: 'order', sorting: false, title: 'Actions', autoBind: false, className: 'order action' }
                    ],
                    dataSource: list,
                    page: { 'PageNumber': 1, 'PageSize': 1000 },
                    rowBound: rowBound,
                    action: {
                        title: 'Actions',
                        items: [
                            {
                                click: onRemove,
                                html: '<span class="icon_container btn_add_files" title="Add Files"><span class="glyphicon glyphicon-trash"></span></span>'
                            }
                        ],
                        className: 'action'
                    },
                    pagger: false,
                    pagging: false,
                    Printable: false,
                    responsive: false,
                    selector: false,
                    onComplete: function (model) {
                        filterGrid = model;
                    },
                });
            };

            this.Set = function (list) {
                len = list.length;
                if (filterGrid) {
                    filterGrid.dataSource = list;
                    filterGrid.Reload();
                } else {
                    bind(list);
                }
            };
            this.GetData = function () {
                var model = {
                    Msg: '',
                    IsValid: true,
                    dataSource: []
                }, item;
                filterGrid.dataSource.each(function (i) {
                    if (this.FormModel.IsValid) {
                        item = {};
                        item[valuefield] = this.FormModel.Value;
                        item[textfield] = this.FormModel.Title;
                        model.dataSource.push(item);
                    } else if (this.FormModel.Title) {
                        model.IsValid = false;
                        model.Msg = "Title Field is Missing.";
                    } else {
                        model.IsValid = false;
                        model.Msg = "Value Field is Missing.";
                    }
                });
                return model;
            };
            this.AddNew = function () {
                filterGrid.AddTottom({ Title: '', Value: '', Index: filterGrid.dataSource.length + 1 });
            };
        }).call(filterService.Grid = {});
    }).call(service.Filter = {});
    (function () {
        var choiceModel;
        function close() {
            choiceModel && choiceModel.Hide();
        };

        function show(isSaved) {
            if (isSaved) {
                choiceModel.View.find('.btn_save_server').show();
                choiceModel.View.find('.btn_remove_server').hide();
                choiceModel.View.find('.btn_save_brouser').show();
                choiceModel.View.find('.btn_remove_browser').hide();
            } else {
                choiceModel.View.find('.btn_save_server').hide();
                choiceModel.View.find('.btn_remove_server').show();
                choiceModel.View.find('.btn_save_brouser').hide();
                choiceModel.View.find('.btn_remove_browser').show();
            }
            choiceModel.Show();
        };
        function createView(isSaved) {
            choiceModel = Global.Window.Bind('<div class="formBody">' +
                '<div class="middleForm">' +
                    '<div class="row">' +
                        '<div class="text-center formFooter FooterFormMenu">' +

                            '<button class="btn btn_save_server btn-white btn-default btn-round" type="button" style="margin-right: 10px;"><span class="glyphicon glyphicon-save"></span> Save For All </button>' +
                            '<button class="btn btn_save_brouser btn-white btn-default btn-round" type="button" style="margin-right: 10px;"><span class="glyphicon glyphicon-save"></span> Save Only For This Browser </button>' +


                            '<button class="btn btn_remove_server btn-white btn-default btn-round" type="button" style="margin-right: 10px;"><span class="glyphicon glyphicon-trash"></span> Remove From All </button>' +
                            '<button class="btn btn_remove_browser btn-white btn-default btn-round" type="button" style="margin-right: 10px;"><span class="glyphicon glyphicon-trash"></span> Remove Only From This Browser </button>' +

                            '<button class="btn btn_cancel btn-white btn-default btn-round" type="button"> <span class="glyphicon glyphicon-remove"></span> Cancel </button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>');
            choiceModel.View.find('.btn_cancel').click(close);
            Global.Click(choiceModel.View.find('.btn_save_server'), save);
            Global.Click(choiceModel.View.find('.btn_remove_server'), remove);
            Global.Click(choiceModel.View.find('.btn_save_brouser'), saveBrowser);
            Global.Click(choiceModel.View.find('.btn_remove_browser'), removeBrowser);
            show(isSaved);
        };
        this.Open = function (isSaved) {
            if (choiceModel) {
                show(isSaved);
            } else {
                createView(isSaved);
            }
        };
        this.Close = function () {
            close();
        };
    }).call(service.Choice = {});
};