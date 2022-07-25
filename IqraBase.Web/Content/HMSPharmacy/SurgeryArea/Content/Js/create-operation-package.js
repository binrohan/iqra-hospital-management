var Controller = new function () {
    let _callerOptions = {}, windowModel;

    function addSurgeryAndForward(model, grid) {
        Global.Add({
            name: 'add-surgon-to-operation-package',
            url: '/Content/HMSPharmacy/SurgeryArea/Content/Js/add-surgon-to-operation-package.js',
            surgeryId: model.Id,
            surgeryCharge: model.Price,
            onSaveSuccess: function () {
                grid.Reload();
            }
        });
    };

    this.Show = function (options) {
        _callerOptions = options;

        Global.Add({
            title: 'Select Surgery',
            selected: 0,
            Tabs: [
                {
                    title: 'Refresh',
                    Grid: [{
                        Header: 'Refresh',
                        Columns: [
                            { field: 'Code', filter: true, add: false },
                            { field: 'Name', filter: true, Width: '255px' },
                            { field: 'Type', filter: true, add: false },
                            { field: 'Price', filter: true, add: { dataType: 'float' }, type: 2 },
                        ],
                        filter: [{ "field": "IsDeleted", "value": 0, "Operation": 0 }],
                        Url: '/SurgeryArea/Surgery/Get',
                        onDataBinding: () => { },
                        onViewCreated: (wnd, formInputs, dropDownList, IsNew, formModel) => {
                            windowModel = wnd;
                        },
                        actions: [
                            {
                                click: addSurgeryAndForward,
                                html: `<a class="action-button info t-white"><i class="glyphicon glyphicon-plus" title="${"Add"}"></i>Add Surgon</a>`
                            }
                        ],
                        buttons: [],
                        selector: false,
                        Printable: {
                            container: $('void')
                        }
                    }],
                }
            ],
            name: 'OnOrderDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=create-operation-package',
        });
    };
};