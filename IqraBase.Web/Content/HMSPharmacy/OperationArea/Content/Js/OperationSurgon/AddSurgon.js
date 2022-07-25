

var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions, gridModel, added = {},
        filter = { "field": "OperartionId", "value": "", "Operation": 13 };
    function onAddSurgon(model,grid) {
        Global.Add({
            name: 'OnAddSurgon',
            title: 'Add Surgon',
            model: model,
            columns: [
                { field: 'Name', title: 'Name', required: false },
                { field: 'Phone', title: 'Phone', required: false },
                { field: 'Fee', title: 'Charge', required: false },
                { field: 'Payable', title: 'Charge For Patient',  },
                { field: 'Remarks', title: 'Remarks'}
            ],
            onSubmit: function (formModel) {
                formModel.OperationId = callerOptions.OperartionId;
                formModel.SurgonId = model.Id;
                formModel.ActivityId = window.ActivityId;
                formModel.Name = model.Name,
                formModel.Designation = model.Designation;
                formModel.Phone = model.Phone;
                formModel.Code = model.EmployeeCode;
                formModel.Id = undefined;
            },
            onSaveSuccess: function (reponse) {
                grid.Reload();
                callerOptions.onSaveSuccess(reponse);
            },
            SaveChange: '/OperationArea/OperationSurgon/Create'
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
                    { field: 'BMDCNo', filter: true },
                    { field: 'Name', filter: true, Click: onSurgonDetails },
                    { field: 'Phone', filter: true },
                    { field: 'Fee', filter: true },
                    { field: 'DoctorTitle', title: 'Doctor Title', filter: true },
                ],
                url: '/OperationArea/OperationSurgon/SurgonByOperatrion',
                page: { 'PageNumber': 1, 'PageSize': 10},
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
                    page.Id = callerOptions.OperartionId
                }
            });
        };
    }).call(service.Grid = {});
};