
var Controller = new function () {
    var windowModel,formModel = {}, inputs = {}, callerOptions,service = {},gridModel,invgridModel;
    function getModel() {
        var model = {},
            list = service.Medicine.GetData(),
            invlist = service.Investigation.GetInvData();
            model.PreviousInformation = formModel.PreviuosInformation;
            model.Complain = formModel.Complain;
            model.AdditionalInformation = formModel.AdditionalInformation;
            model.Advice = formModel.Advice;
            model.NextMeetingDate = formModel.NextMeetingDate;
            model.Items = list;
            model.InvItems = invlist;
            return model;
    };
    function save() {
        //var list = service.Medicine.Get();
        //console.log(list);
        //return;
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = getModel();
            model.PatientId = callerOptions.PatientId;
            model.DrugBrandId = callerOptions.DrugBrandId;
            model.InvestigationRefferenceId = callerOptions.InvestigationRefferenceId;
            Global.CallServer('/PrescriptionArea/Prescription/Create', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    //console.log(list);
                    callerOptions.onSaveSuccess(formModel, inputs);
                    close();
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                //response.Id = -8;
                alert('Network Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Error.');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {
        if (callerOptions.model) {

        } else {
            for (var key in formModel) formModel[key] = '';
        }
        //Global.Copy(formModel, callerOptions.model, true);
        //formModel.Due = formModel.PaidAmount = callerOptions.model.TradePrice - callerOptions.model.PaidAmount;
    };
    //function setDropdown() {
    //    var investigation = {
    //        elm: $(inputs['InvestigationRefferenceId']),
    //        url: '/InvestigationArea/InvestigationRefference/AutoComplete'
    //    };
    //    //Global.AutoComplete.Bind(drugbrand);
    //    Global.AutoComplete.Bind(investigation);
    //};
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            service.Medicine.Empty();
            service.Investigation.Empty();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PrescriptionArea/Templates/AddPrescription.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                //setDropdown();
                service.Medicine.Bind();
                service.Investigation.Bind();
                windowModel.Show();
            }, noop);
        }
    };
    (function () {
        var searchGridModel, filters = [],
            nameFilterModel = { "field": "Name", "value": "", Operation: 6 };
        function getInput(field,isRequired) {
            return '<input' + (isRequired ? ' required=""' : '') + ' data-binding="' + field + '" class="form-control" type="text">';
        };
        function onDelete(model) {
            var list = [];
            //gridModel.datasource.each(function () {
            //    if (this.Id != model.Id) {
            //        list.push(this);
            //    }
            //});
            gridModel.datasource = gridModel.dataSource = gridModel.dataSource.where('itm=>itm.Id != "' + model.Id + '"');
            gridModel.Reload();
        };
        function rowBound(elm) {
            var td = elm.find('td');
            $(td[1]).html(getInput('Contains', false));
            $(td[2]).html(getInput('Doses', true));
            $(td[3]).html(getInput('Timing', true));
            $(td[4]).html(getInput('DosesPeriod', true));
            var copy = Global.Copy({}, this);
            Global.Form.Bind(this, elm);
            Global.Copy(this, copy);

        };
        function setGridModel() {
            Global.List.Bind({
                Name: 'Medicine',
                Grid: {
                    elm: windowModel.View.find('#medicine_grid_container'),
                    columns: [
                            { field: 'Name', title: 'Name', filter: true },
                            { field: 'Contains', title: 'Contains', className: 'contains', autobind: false},
                            { field: 'Doses', title: 'Doses', className: 'doses', autobind: false },
                            { field: 'Timing', title: 'Timing', className: 'timing', autobind: false },
                            { field: 'DosesPeriod', title: 'Doses Period', className: 'period', autobind: false },
                    ],
                    Actions: [{
                        click: onDelete,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Add Prescription"><span class="glyphicon glyphicon-trash"></span></a>'
                    }],
                    dataSource: [],
                    Responsive:false,
                    page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Medicines ' },
                    //onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Printable: false
                },
                onComplete: function (model) {
                    console.log(model);
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            });
        };
        function setSearchGridModel() {
            filters = [nameFilterModel];
            Global.Grid.Bind({
                elm: windowModel.View.find('#search_grid_container'),
                columns: [
                    { field: 'Name', title: 'Name', filter: true },
                    { field: 'DrugType', title: 'Drug Type', filter: true, add: false },
                    { field: 'Comapny', title: 'Drug Company', filter: true, add: false },
                    { field: 'GenericName', title: 'Drug Generic', filter: true, add: false },
                    { field: 'Strength', title: 'Strength', filter: true },
                ],
                dataSource: [],
                Responsive: false,
                url: '/DrugArea/DrugBrand/Get',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Medicines ', filter: filters },
                rowBound:function (elm) {
                    Global.Click(elm, function (model) {
                        if (gridModel.dataSource.where('itm=>itm.Id=="' + model.Id + '"').length < 1) {
                            gridModel.dataSource.push({ Name: model.Name, Id: model.Id });
                            gridModel.Reload();
                            windowModel.View.find('#search_grid_container').hide();
                            $(inputs['DrugBrandId']).blur();
                        } else {
                            alert('This Item is already Added.');
                        }
                    }, this);
                },
                onComplete: function (model) {
                    model.dataSource = none;
                    searchGridModel = model;
                    windowModel.View.find('#search_grid_container').hide();
                },
                Printable:false
            });
        };
        this.Bind = function () {
            setGridModel();
            setSearchGridModel();
            $(inputs['DrugBrandId']).focus(function () {
                console.log(windowModel.View.find('#search_grid_container'));
                var offset = $(this).offset();
                offset.top += 15;
                offset.left = 0;
                windowModel.View.find('#search_grid_container').css(offset).show();
            }).keyup(function () {
                if (formModel.DrugBrandId != nameFilterModel.value) {
                    nameFilterModel.value = formModel.DrugBrandId;
                    searchGridModel.dataSource = searchGridModel.datasource = none;
                    searchGridModel.Reload();
                    //gridModel.dataSource.push({ Name: 'Namessssss' });
                    //gridModel.Reload();
                }
            }).closest('.row').mousedown(function (e) {
                e.stopPropagation();
            });
            windowModel.View.find('#search_grid_container').mousedown(function (e) {
                e.stopPropagation();
            });
            $(document).mousedown(function () {
                windowModel.View.find('#search_grid_container').hide();
            });
        };
        this.Get = function () {
            return gridModel.dataSource;
        };
        this.GetData = function () {
            var list = [];
            gridModel.dataSource.each(function () {
                list.push({
                    DrugBrandId: this.Id,
                    Contains: this.Contains,
                    Doses: this.Doses,
                    Timing: this.Timing,
                    DosesPeriod: this.DosesPeriod
                })
            });
            return list ;
        };
        this.Empty = function () {
            gridModel.dataSource = gridModel.datasource = [];
            gridModel.Reload();
        };
    }).call(service.Medicine = {});
    (function () {
        var invsearchGridModel, filters = [],
            nameFilterModel = { "field": "Name", "value": "", Operation: 6 };
        //function getInput(field, isRequired) {
        //    return '<input' + (isRequired ? ' required=""' : '') + ' data-binding="' + field + '" class="form-control" type="text">';
        //};
        function onDelete(model) {
            var list = [];
            //gridModel.datasource.each(function () {
            //    if (this.Id != model.Id) {
            //        list.push(this);
            //    }
            //});
            invgridModel.datasource = invgridModel.dataSource = invgridModel.dataSource.where('itm=>itm.Id != "' + model.Id + '"');
            invgridModel.Reload();
        };
        //function rowBound(elm) {
        //    var td = elm.find('td');
        //    //$(td[1]).html(getInput('Name', false));
        //    var copy = Global.Copy({}, this);
        //    Global.Form.Bind(this, elm);
        //    Global.Copy(this, copy);
        //};
        function setInvGridModel() {
            Global.List.Bind({
                Name: 'Investigation',
                Grid: {
                    elm: windowModel.View.find('#investigation_grid_container'),
                    columns: [
                            { field: 'Name', title: 'Investigation Name', filter: true },
                    ],
                    Actions: [{
                        click: onDelete,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Add Investigation"><span class="glyphicon glyphicon-trash"></span></a>'
                    }],
                    dataSource: [],
                    Responsive: false,
                    page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Investigations ' },
                    Printable: false
                    //onDataBinding: onDataBinding,
                    //rowBound: rowBound
                },
                onComplete: function (model) {
                    console.log(model);
                    invgridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            });
        };
        function setInvSearchGridModel() {
            filters = [nameFilterModel];
            Global.Grid.Bind({
                elm: windowModel.View.find('#inv_search_grid_container'),
                columns: [
                    { field: 'Name', title: 'Investigation Name', filter: true },
                ],
                dataSource: [],
                Responsive: false,
                url: '/InvestigationArea/Investigation/Get',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Investigations ', filter: filters },
                rowBound: function (elm) {
                    Global.Click(elm, function (model) {
                        if (invgridModel.dataSource.where('itm=>itm.Id=="' + model.Id + '"').length < 1) {
                            invgridModel.dataSource.push({ Name: model.Name, Id: model.Id });
                            invgridModel.Reload();
                            windowModel.View.find('#inv_search_grid_container').hide();
                            $(inputs['InvestigationRefferenceId']).blur();
                        } else {
                            alert('This Item is already Added.');
                        }
                    }, this);
                },
                onComplete: function (model) {
                    model.dataSource = none;
                    invsearchGridModel = model;
                    windowModel.View.find('#inv_search_grid_container').hide();
                },
                Printable: false
            });
        };
        this.Bind = function () {
            setInvGridModel();
            setInvSearchGridModel();
            $(inputs['InvestigationRefferenceId']).focus(function () {
                console.log(windowModel.View.find('#inv_search_grid_container'));
                var offset = $(this).offset();
                offset.top += 15;
                offset.left = 0;
                windowModel.View.find('#inv_search_grid_container').css(offset).show();
            }).keyup(function () {
                if (formModel.InvestigationRefferenceId != nameFilterModel.value) {
                    nameFilterModel.value = formModel.InvestigationRefferenceId;
                    invsearchGridModel.dataSource = invsearchGridModel.datasource = none;
                    invsearchGridModel.Reload();
                    //gridModel.dataSource.push({ Name: 'Namessssss' });
                    //gridModel.Reload();
                }
            }).closest('.row').mousedown(function (e) {
                e.stopPropagation();
            });
            windowModel.View.find('#inv_search_grid_container').mousedown(function (e) {
                e.stopPropagation();
            });
            $(document).mousedown(function () {
                windowModel.View.find('#inv_search_grid_container').hide();
            });
        };
        this.Get = function () {
            return invgridModel.dataSource;
        };
        this.GetInvData = function () {
            var invlist = [];
            invgridModel.dataSource.each(function () {
                invlist.push({
                    InvestigationRefferenceId: this.Id,
                    Name: this.Name,
                })
            });
            return invlist;
        };
        this.Empty = function () {
            invgridModel.dataSource = invgridModel.datasource = [];
            invgridModel.Reload();
        };
    }).call(service.Investigation = {});
};