

var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions, gridModel, added = {},
        filter = { "field": "SurgeryId", "value": "", "Operation": 0 };
    function onAddSurgon(model, grid) {
        Global.Add({
            name: 'set-initial-price-for-package',
            title: 'Set Initial Price',
            model: { ...model, Id: undefined, Remarks: '', OriginalCost: model.Charge + callerOptions.surgeryCharge },
            columns: [
                { field: 'Price', title: 'Price', add: { sibling: 3 } },
                { field: 'MinPrice', title: 'Minimum Price', add: { sibling: 3 } },
                { field: 'OriginalCost', title: 'Original Cost', add: { sibling: 3 } },
                { field: 'Remarks', title: 'Remarks', add: { sibling: 1 } }
            ],
            onSubmit: function (formModel) {
                formModel.SurgonId = model.Id;
                formModel.SurgeryId = callerOptions.surgeryId;
                formModel.OriginalCost = model.Charge + callerOptions.surgeryCharge;
            },
            onSaveSuccess: function (reponse) {
                grid.Reload();
                callerOptions.onSaveSuccess(reponse);
                windowModel?.Hide();
            },
            SaveChange: '/SurgeryArea/OperationPackage/Create'
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
            Global.LoadTemplate('/Content/HMSPharmacy/OperationArea/Templates/AddOperationSurgon.html?v=add-surgon-to-operation-package', function (response) {
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
                    { field: 'BMDCNo', title: 'BMDC Number', filter: true },
                    { field: 'DoctorName', title: 'Surgon Name', filter: true },
                    { field: 'Charge', title: 'Charge', filter: true, type: 2 },
                    { field: 'DoctorTitle', title: 'Title', filter: true },
                    { field: 'Department', title: 'Department', filter: true },
                    { field: 'Designation', title: 'Designation', filter: true },
                    { field: 'Phone', title: 'Phone', filter: true },
                ],
                url: '/SurgeryArea/Surgon/Get',
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
                    page.filter.push(filter);
                    page.filter.push({ "field": "Status", "value": "Active", "Operation": 0 });
                }
            });
        };
    }).call(service.Grid = {});
};