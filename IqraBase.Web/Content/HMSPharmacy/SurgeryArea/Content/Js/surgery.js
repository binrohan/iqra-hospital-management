var Controller = new function () {
    let _callerOptions = {};
    const filterById = { "field": "SurgeryId", "value": "", "Operation": 0 };

    function registerSurgon(surgon) {
        Global.Add({
            name: 'add-surgon-to-the-surgery',
            url: '/Content/HMSPharmacy/SurgeryArea/Content/Js/register-surgon.js',
            surgeryId: _callerOptions.surgeryId,
            onSaveSuccess: function () {
                model.Grid.Model.Reload();
            }
        });
    };

    function editSurgonInformation(model) {
        Global.Add({
            name: 'AddRequisition',
            url: '/Content/HMSPharmacy/OperationArea/Content/Js/OperationSurgon/registerSurgon.js',
            OperartionId: _callerOptions.OperartionId,
            onSaveSuccess: function () {
                model.Grid.Model.Reload();
            }
        });
    };

    this.Show = function (options) {
        _callerOptions = options;
        filterById.value = _callerOptions.surgeryId;

        Global.Add({
            title: 'Operation Details',
            selected: 0,
            Tabs: [{
                title: 'Active Surgons',
                Grid: [{
                    Header: 'Active Surgons',
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
                    { "field": "Status", "value": "Active", "Operation": 0 }],
                    Url: '/SurgeryArea/Surgon/Get',
                    onDataBinding: () => { },
                    actions: [{
                        click: editSurgonInformation,
                        html: `<a class="action-button info t-white"><i class="glyphicon glyphicon-edit" title="${"Add to the Festival"}"></i></a>`
                    }],
                    buttons: [{
                        click: registerSurgon,
                        html: '<a class="btn btn-white btn-default btn-round pull-right"><span class="glyphicon glyphicon-plus"></span>New</a>'
                    }],
                    selector: false,
                    Printable: {
                        container: $('void')
                    }
                }, 
            ],
            },{
                title: 'Inactive Surgons',
                Grid: [{
                    Header: 'Inactive Surgons',
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
                    buttons: [{
                        click: registerSurgon,
                        html: '<a class="btn btn-white btn-default btn-round pull-right"><span class="glyphicon glyphicon-plus"></span>New</a>'
                    }],
                    selector: false,
                    Printable: {
                        container: $('void')
                    }
                }, 
            ],
            }, {
                title: 'Previous Operations',
                Grid: [{
                    Header: 'Previous Operations',
                    Columns: [
                        { field: 'Name', title: 'Surgery Name', filter: true, Width: '255px', add: false },
                        { field: 'Status', filter: true, add: false},
                    ],
                    filter: [filterById, { "field": "IsDeleted", "value": 0, "Operation": 0 },
                    { "field": "Status", "value": "Finished", "Operation": 0 }],
                    Url: '/OperationArea/Operation/Get',
                    onDataBinding: () => { },
                    selector: false,
                    Printable: {
                        container: $('void')
                    }
                }, 
            ],
            },{
                title: 'Schedule Operations',
                Grid: [{
                    Header: 'Schedule Operations',
                    Columns: [
                        { field: 'Name', title: 'Surgery Name', filter: true, Width: '255px', add: false },
                        { field: 'Status', filter: true, add: false},
                    ],
                    filter: [filterById, { "field": "IsDeleted", "value": 0, "Operation": 0 }],
                    Url: '/OperationArea/Operation/Get',
                    onDataBinding: () => { },
                    selector: false,
                    Printable: {
                        container: $('void')
                    }
                }, 
            ],
            },],
            name: 'OnOrderDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=OrderDetails',
        });
    };
};