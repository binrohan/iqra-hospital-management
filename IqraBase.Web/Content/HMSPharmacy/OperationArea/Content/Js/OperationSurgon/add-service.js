

var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions, gridModel, added = {},
        filter = { "field": "OperartionId", "value": "", "Operation": 13 };
    function addService(model, grid) {
        console.log(['odel, grid',model, grid]);
        Global.Add({
            name: 'add-service',
            title: 'Add OT Service',
            model: {...model, Id: null},
            columns: [
                { field: 'Name', title: 'Name', required: false, add: {sibling: 1} },
                { field: 'Price', title: 'Original Price', required: false, add: { datatype: 'float', sibling: 2 } },
                { field: 'Unit', title: 'Unit', required: false },
                { field: 'Payable', title: 'Price', required: false, add: { datatype: 'float', sibling: 2 } },
                { field: 'Quantity', title: 'Quantity', required: false },
                { field: 'Remarks', title: 'Description', required: false }
            ],
            onSubmit: function (formModel) {
                formModel.OperationId = callerOptions.OperartionId;
                formModel.RefOTServiceId = callerOptions.Id;
                formModel.ActivityId = window.ActivityId;
            },
            onSaveSuccess: function (reponse) {
                grid.Reload();
                callerOptions.onSaveSuccess(reponse);
            },
            SaveChange: '/OperationArea/OperationOTService/Create'
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
        filter.value = "'" + model.OperartionId+"'";
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
                    { field: 'Name', title: 'Service Name', filter: true },
                    { field: 'Price', title: 'Price', filter: true, type: 2 },
                    { field: 'Unit', title: 'Unit', filter: true },
                    { field: 'Remarks', title: 'Remarks', filter: true },
                ],
                url: '/OTServiceArea/OTService/Get',
                page: { 'PageNumber': 1, 'PageSize': 10},
                Action: {
                    title: {
                        items: IqraConfig.Grid.Pagger.PageSize,
                        selected: IqraConfig.Grid.Pagger.Selected,
                        showingInfo: '{0}-{1} of {2} Items'
                    },
                    items: [{
                        click: addService,
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
                    page.Id = callerOptions.OperartionId
                }
            });
        };
    }).call(service.Grid = {});
};