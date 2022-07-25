var Controller = new function () {
    let _callerOptions = {};
    const filterById = { "field": "OperationPackageId", "value": "", "Operation": 0 };

    function addOTService(surgon) {
        Global.Add({
            name: 'add-OTservie-to-the-operation-package',
            url: '/Content/HMSPharmacy/SurgeryArea/Content/Js/add-otService.js',
            operationPackageId: _callerOptions.operationPackageId,
            onSaveSuccess: function () {
                model.Grid.Model.Reload();
            }
        });
    };

    function edit(model) {
        Global.Add({
            name: 'edit-operation-package-ot-service-quantity',
            model: model,
            title: 'Change Service Quantity',
            columns: [
                { field: 'Quantity', title: 'Surgery Name', add: { sibling: 2 } },
                { field: 'Unit', title: 'Unit', add: { sibling: 2 } },
                { field: 'Remarks', title: 'Remarks', Width: '255px', add: { type: 'textarea', sibling: 1 } }
            ],
            dropdownList: [],
            additionalField: [],
            onSubmit: function (postModel, data, formModel) {
                postModel.Id = data.Id;
                postModel.OperationPackageId = data.OperationPackageId;
                postModel.ServiceId = data.ServiceId;
            },
            onShow:(model, formInputs, dropDownList, IsNew, windowModel, formModel) => {

            },
            onViewCreated:(windowModel, formInputs, dropDownList, IsNew, formModel) => {
                $(formInputs['Unit']).prop('disabled',true);
            },
            onSaveSuccess: function () {
                tabs.gridModel?.Reload();
            },
            save: `/OperationPackageOTService/Create`,
            saveChange: `/OperationPackageOTService/Edit`,
        });
    };

    function deleteService(model, grid) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'OnRemove',
                save: '/SurgeryArea/OperationPackageOTService/Delete',
                msg: 'Do you want to remove this service?',
                data: { Id: model.Id },
                onsavesuccess: function () {
                    grid?.Reload();
                },
                onerror: function (response) {
                    alert(response.Msg || 'Errors');
                }
            }
        });
    }

    this.Show = function (options) {
        _callerOptions = options;

        filterById.value = _callerOptions.operationPackageId;

        Global.Add({
            title: 'Operation Package Details',
            selected: 0,
            Tabs: [{
                title: 'Services',
                Grid: [{
                    Header: 'Services',
                    Columns: [
                        { field: 'ServiceName', filter: true, Width: '255px', add: { sibling: 1 } },
                        { field: 'Quantity', filter: true, add: { datatype: 'float' } },
                        { field: 'Unit', filter: true },
                        { field: 'CreatedAt', title: 'Created At', filter: true, dateFormat: 'dd mmm yyyy' },
                        { field: 'Creator', title: 'Creator', filter: true },
                        { field: 'Remarks', title: 'Remarks', filter: true },
                    ],
                    filter: [filterById, { "field": "IsDeleted", "value": 0, "Operation": 0 }],
                    Url: '/SurgeryArea/OperationPackageOTService/Get',
                    onDataBinding: () => { },
                    actions: [{
                        click: edit,
                        html: `<a class="action-button info t-white"><i class="glyphicon glyphicon-edit" title="${"Add to the Festival"}"></i></a>`
                    }, {
                        click: deleteService,
                        html: `<a class="action-button info t-white"><i class="glyphicon glyphicon-trash" title="${"Remove This Service"}"></i></a>`
                    }],
                    buttons: [{
                        click: addOTService,
                        html: '<a class="btn btn-white btn-default btn-round pull-right"><span class="glyphicon glyphicon-plus"></span>New</a>'
                    }],
                    selector: false,
                    Printable: {
                        container: $('void')
                    }
                },
                ],
            }, {
                title: 'Subscritions',
                Grid: [{
                    Header: 'Subscritions',
                    Columns: [
                        { field: 'BMDCNo', title: 'BMDC Number', filter: true },
                        { field: 'DoctorName', title: 'Surgon Name', filter: true },
                        { field: 'Charge', title: 'Charge', filter: true, type: 2 },
                        { field: 'DoctorTitle', title: 'Title', filter: true },
                        { field: 'Department', title: 'Department', filter: true },
                        { field: 'Designation', title: 'Designation', filter: true },
                        { field: 'Phone', title: 'Phone', filter: true },
                    ],
                    filter: [filterById, { "field": "IsDeleted", "value": 0, "Operation": 0 },
                        { "field": "Status", "value": "Inactive", "Operation": 0 }],
                    Url: '/SurgeryArea/Surgon/Get',
                    onDataBinding: () => { },
                    actions: [],
                    buttons: [],
                    selector: false,
                    Printable: {
                        container: $('void')
                    }
                },
                ],
            }],
            name: 'OnOrderDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=operation-package',
        });
    };
};