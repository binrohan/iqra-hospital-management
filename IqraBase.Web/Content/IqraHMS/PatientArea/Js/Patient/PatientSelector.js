
var Controller = new function (none) {
    var service = {}, windowModel, dataSource = [], selected = {}, formModel = {},  callerOptions, gridModel, added = {}, inputs, filter = [
        { field: 'Code', title: 'Code', "value": "", "Operation": 5 },
        { field: 'Name', title: 'Name', "value": "", "Operation": 5 },
        { field: 'Gender', title: 'Gender', "value": "", "Operation": 5 },
        { field: 'BloodGroup', title: 'Blood Group', "value": "", "Operation": 5 },
        { field: 'Mobile', title: 'Mobile', "value": "", "Operation": 5 },
        { field: 'AlternativeMobile', title: 'Alt Mobile', "value": "", "Operation": 5 },
        { field: 'FatherName', title: 'Father Name', "value": "", "Operation": 5 },
        { field: 'Email', title: 'Email', "value": "", "Operation": 5 }
    ];
    function save() {
        selected.model && callerOptions.onSaveSuccess(selected.model);
        close();
    };
    function close() {
        //dataSource = [];
        windowModel && windowModel.Hide();
    };
    function show(options) {
        var model;
        added = {};
        windowModel.Show();
        filter.each(function () {
            formModel[this.field] = '';
            this.value = '';
        });
        $(inputs.Mobile).focus();
        gridModel && gridModel.Reload();
    };
    this.Show = function (model) {
        selected = {};
        //dataSource = [];
        callerOptions = model;
        if (windowModel) {
            show(callerOptions);
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/PatientSelector.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '98%' });
                inputs = Global.Form.Bind(formModel, windowModel.View.find('.filter_container'));
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                show(callerOptions);
                service.Grid.Bind();
            }, noop);
        }
    };
    (function (none) {
        var timer, lastCall;
        function onSelect(model) {
            if (selected.elm) {
                selected.elm.removeClass('i-state-selected');
            }
            selected = { model: model, elm: $(this)};
            selected.elm.addClass('i-state-selected');
        };
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
            var model = this;
            elm.dblclick(function () {
                callerOptions.onSaveSuccess(model);
                close();
            });
        };
        function onDataBinding(response) {
            dataSource = response.Data.Data;
        };
        function onDetails(model) {
            Global.Add({
                PatientId: model.Id,
                name: 'PatientDetails',
                url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
            });
        };
        function onFilter(model) {
            model.value = formModel[model.field];
            lastCall && lastCall.abort && lastCall.abort();
            lastCall = gridModel.Reload(() => { lastCall = none});
        };
        function onKeyup(elm, model) {
            elm.keyup(function () {
                if (model.value != formModel[model.field]) {
                    timer && clearTimeout(timer);
                    lastCall && lastCall.abort && lastCall.abort();
                    lastCall = none;
                    timer = setTimeout(function () { onFilter(model) }, 150);
                }
            });
        };
        function setFilter() {
            filter.each(function () {
                inputs[this.field] && onKeyup($(inputs[this.field]), this);
            });
        };
        this.Bind = function () {
            setFilter();
            Global.Grid.Bind({
                elm: windowModel.View.find('#patient_selector_grid'),
                columns: [
                    { field: 'Code', title: 'Code', Click: onDetails },
                    { field: 'Name', title: 'Name',},
                    { field: 'Gender', title: 'Gender', },
                    { field: 'BloodGroup', title: 'BG',},
                    { field: 'Mobile', title: 'Mobile' },
                    { field: 'PatientType', title: 'Type'},
                    { field: 'AlternativeMobile', title: 'Alt Mobile'},
                    { field: 'FatherName', title: 'Father Name' },
                    { field: 'MotherName', title: 'Mother Name' },
                    { field: 'Profession', title: 'Profession' },
                    { field: 'Email', title: 'Email' },
                    { field: 'LastDateOfAdmission', title: 'Addmission Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                    { field: 'LastDateOfRealese', title: 'Release Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                    { field: 'LastDateOfAppointment', title: 'Appointment Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                    { field: 'CAddress', title: 'Current Address'},
                    { field: 'PAddress', title: 'Permanent Address' }
                ],
                url: '/PatientArea/Patient/Get',
                page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Patients ',filter:[] },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                oncomplete: function (model) {
                    gridModel = model;
                },
                onrequest: function (data) {
                    data.filter = data.filter.concat(filter.where('itm=>itm.value'));
                },
                Printable: false
            });
        };
    }).call(service.Grid = {});
};