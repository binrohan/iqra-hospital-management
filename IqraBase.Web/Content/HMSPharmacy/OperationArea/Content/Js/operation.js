var Controller = new function () {
    let _callerOptions
    filter = { "field": "OperationId", "value": "", "Operation": 0 };
    filterById = { "field": "Id", "value": "", "Operation": 0 };

    function changeStatus(model, grid) {
        console.log({ model });
        Global.Add({
            name: 'Change Status',
            title: 'Change Status',
            dropdownList: [
                {
                    title: 'Select New Status',
                    Id: 'NewStatus',
                    dataSource: [
                        { text: 'Initialted', value: 'Initialted' },
                        { text: 'Pre Operation Stage', value: 'Pre Operation Stage' },
                        { text: 'Post Operation Stage', value: 'Post Operation Stage' },
                        { text: 'Running', value: 'Running' },
                        { text: 'Cancelled', value: 'Cancelled' },
                        { text: 'Finished', value: 'Finished' }
                    ],
                }
            ],
            columns: [
                { field: 'Remarks', title: 'Remarks', required: false }
            ],
            onSubmit: function (formModel) {
                formModel.ActivityId = window.ActivityId;
                formModel.Id = _callerOptions.OperartionId;
            },
            onSaveSuccess: function () {
                model.Grid.Model.Reload();
            },
            save: '/OperationArea/Operation/ChangeStatus'
        });
    };

    function onAddSurgon(model) {
    
        Global.Add({
            name: 'AddRequisition',
            url: '/Content/HMSPharmacy/OperationArea/Content/Js/OperationSurgon/AddSurgon.js',
            OperartionId: _callerOptions.OperartionId,
            onSaveSuccess: function () {
                model.Grid.Model.Reload();
            }
        });
    };

    function addService(model) {
        Global.Add({
            name: 'AddRequisition',
            url: '/Content/HMSPharmacy/OperationArea/Content/Js/OperationSurgon/add-service.js',
            OperartionId: _callerOptions.OperartionId,
            onSaveSuccess: function () {
                model.Grid.Model.Reload();
            }
        });
    };

    function onDelete(model, grid) {
        console.log([model]);
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'OnRemove',
                save: '/OperationArea/OperationSurgon/Delete',
                msg: 'Do you want to remove this surgon?',
                data: { Id: model.Id },
                onsavesuccess: function () {
                    grid.Reload();
                },
                onerror: function (response) {
                    alert(response.Msg || 'Errors');
                }
            }
        });
    };

    function removeService(service, grid) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'OnRemove',
                save: '/OperationArea/OperationOTService/Delete',
                msg: 'Do you want to remove this service?',
                data: { Id: service.Id },
                onsavesuccess: function () {
                    grid.Reload();
                },
                onerror: function (response) {
                    alert(response.Msg || 'Errors');
                }
            }
        });
    }

    this.Show = function (options) {
        _callerOptions = options;
        filter.value = _callerOptions.OperartionId;
        filterById.value = _callerOptions.OperartionId;

        Global.Add({
            title: 'Operation Details',
            selected: 1,
            Tabs: [
                {
                    title: 'Assigned Surgons',
                    Grid: [{
                        Header: 'Assigned Surgons',
                        Columns: [
                            { field: 'SurgonName', title: 'Surgon Name', filter: true },
                            { field: 'Phone', title: 'Phone', filter: true },
                            { field: 'Department', title: 'Department', filter: true },
                            { field: 'Payable', title: 'Charge', filter: true, type: 2 },
                            { field: 'CreatedAt', title: 'Created At', filter: true, dateFormat: 'dd mmm yyyy' },
                            { field: 'Creator', title: 'Creator', filter: true },
                            { field: 'Remarks', title: 'Remarks', filter: true },
                        ],
                        filter: [filter, { "field": "IsDeleted", "value": 0, "Operation": 0 }],
                        Url: '/OperationArea/OperationSurgon/Get',
                        onDataBinding: () => { },
                        actions: [
                            {
                                click: onDelete,
                                html: `<a class="action-button info t-white"><i class="glyphicon glyphicon-trash" title="${"Add to the Festival"}"></i></a>`
                            }
                        ],
                        buttons: [{
                            click: onAddSurgon,
                            html: '<a class="btn btn-white btn-default btn-round pull-right"><span class="glyphicon glyphicon-plus"></span>New</a>'
                        }],
                        selector: false,
                        Printable: {
                            container: $('void')
                        }
                    }],
                },
                {
                    title: 'Consumed Services',
                    Grid: [{
                        Header: 'Consumed Services',
                        Columns: [
                            { field: 'Name', title: 'Service Name', filter: true },
                            { field: 'Payable', title: 'Price', filter: true, type: 2 },
                            { field: 'Unit', title: 'Unit', filter: true },
                            { field: 'Quantity', title: 'Quantity', filter: true },
                            { field: 'CreatedAt', title: 'Created At', filter: true, dateFormat: 'dd mmm yyyy' },
                            { field: 'Creator', title: 'Creator', filter: true },
                            { field: 'Remarks', title: 'Remarks', filter: true },
                        ],
                        filter: [filter, { "field": "IsDeleted", "value": 0, "Operation": 0 }],
                        Url: '/OperationArea/OperationOTService/Get',
                        onDataBinding: () => { },
                        actions: [
                            {
                                click: removeService,
                                html: `<a class="action-button info t-white"><i class="glyphicon glyphicon-trash" title="${"Remove Service"}"></i></a>`
                            }
                        ],
                        buttons: [{
                            click: addService,
                            html: '<a class="btn btn-white btn-default btn-round pull-right"><span class="glyphicon glyphicon-plus"></span>New</a>'
                        }],
                        selector: false,
                        Printable: {
                            container: $('void')
                        }
                    }],
                },
                {
                    title: 'Operation Status',
                    Grid: [{
                        Header: 'Consumed Services',
                        Columns: [
                            { field: 'CreatedAt', title: 'Date', Width: '100px', filter: true, dateFormat: 'dd mmm yyyy' },
                            { field: 'Creator', title: 'Actor', Width: '150px', filter: true },
                            { field: 'ActionType', title: 'Action', Width: '200px', filter: true },
                            { field: 'Description', title: 'Description', filter: true },
                            { field: 'AfterMath', title: 'AfterMath', filter: true },
                        ],
                        filter: [filter, { "field": "IsDeleted", "value": 0, "Operation": 0 }],
                        Url: '/OperationArea/OperationHistory/Get',
                        onDataBinding: () => { },
                        buttons: [{
                            click: changeStatus,
                            html: '<a class="btn btn-white btn-default btn-round pull-right"><span class="glyphicon glyphicon-plus"></span>Change Status</a>'
                        }],
                        selector: false,
                        Printable: {
                            container: $('void')
                        }
                    }],
                }
            ],
            name: 'OnOrderDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=OrderDetails',
        });
    };
};