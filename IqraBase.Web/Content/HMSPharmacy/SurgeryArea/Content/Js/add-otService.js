var Controller = new function () {
    var service = {}, windowModel, callerOptions, gridModel, added = {},
        filter = { "field": "SurgeryId", "value": "", "Operation": 0 };
    function onAddSurgon(model, grid) {
        Global.Add({
            name: 'OnAddSurgon',
            title: 'Add Surgon',
            model: { ...model, Remarks: '' },
            columns: [
                { field: 'Quantity', title: 'Quantity', add: { sibling: 2 } },
                { field: 'Remarks', title: 'Remarks', add: { sibling: 2 } }
            ],
            onSubmit: function (formModel) {
                formModel.OperationPackageId = callerOptions.operationPackageId;
                formModel.ServiceId = model.Id;
                formModel.Id = undefined
            },
            onSaveSuccess: function (reponse) {
                grid.Reload();
                callerOptions.onSaveSuccess(reponse);
            },
            SaveChange: '/SurgeryArea/OperationPackageOTService/Create',
            Save: '/SurgeryArea/OperationPackageOTService/Create'
        });
    };

    function close() {
        //dataSource = [];
        windowModel && windowModel.Hide();
    };

    function show(options) {
        var model;
        added = {};
        windowModel.Show();
        gridModel && gridModel.Reload();
    };

    this.Show = function (model) {
        filter.value = model.surgeryId;
        callerOptions = model;

        if (windowModel) {
            show(callerOptions);
        } else {
            Global.LoadTemplate('/Content/HMSPharmacy/OperationArea/Templates/AddOperationSurgon.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                show(callerOptions);
                service.Grid.Bind();
            }, noop);
        }
    };

    (function () {
        function onSurgonDetails(model) {
            Global.Add({
                SurgonId: model.SurgonId,
                name: 'SurgonDetails',
                url: '/Areas/SurgonArea/Content/Surgon/SurgonDetails.js',
            });
        };

        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_selector_grid'),
                columns: [
                    { field: 'Name', filter: true, Width: '255px', add: { sibling: 1 } },
                    { field: 'Price', filter: true, add: { datatype: 'float' }, type: 2 },
                    { field: 'Unit', filter: true },
                    { field: 'CreatedAt', title: 'Created At', filter: true, dateFormat: 'dd mmm yyyy' },
                    { field: 'Creator', title: 'Creator', filter: true },
                    { field: 'Remarks', title: 'Remarks', filter: true },
                ],
                url: '/OTServiceArea/OTService/Get',
                page: { 'PageNumber': 1, 'PageSize': 10 },
                Action: {
                    title: {
                        items: IqraConfig.Grid.Pagger.PageSize,
                        selected: IqraConfig.Grid.Pagger.Selected,
                        showingInfo: '{0}-{1} of {2} Items'
                    },
                    items: [{
                        click: onAddSurgon,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Add This Surgon"><span class="glyphicon glyphicon-plus"></span> Add</a>'
                    }],
                    className: 'action'
                },
                //pagger: { showingInfo: '{0}-{1} of {2} Items' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                Printable: false,
                onrequest: (page) => {
                    page.filter.push({ "field": "IsDeleted", "value": 0, "Operation": 0 });
                }
            });
        };
    }).call(service.Grid = {});
};