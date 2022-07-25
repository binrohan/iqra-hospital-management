var Controller = new function () {
    var service = {}, windowModel, callerOptions,
        filter = { "field": "Id", "value": "", Operation: 0 };
    function close() {
        windowModel && windowModel.Hide();
    };
    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    }
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    this.Show = function (model) {
        callerOptions = model;
        filter.value = model.Id;
        if (windowModel) {
            windowModel.Show();
            service.AppointmentTime.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/AppointmentTimeDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.AppointmentTime.Bind();
                setTabEvent();
            }, noop);
        }
    };

    (function () {
        var isBind, formModel = {}, dataSource = {}, Id;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#appointment_time'));
            }
            reset();
            windowModel.View.find('#appointment_time').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function populate(model) {
            for (var key in formModel) {
                if (typeof model[key] != 'undefined') {
                    formModel[key] = model[key];
                }
            }
            formModel.DateOfAppointment = model.DateOfAppointment === "\/Date(-2209010400000)\/" ? "" : model.DateOfAppointment.getDate().format('dd/MM/yyyy hh:mm');
            formModel.CreatedAt = model.CreatedAt.getDate().format('dd/MM/yyyy hh:mm');
            formModel.UpdatedAt = model.UpdatedAt === "\/Date(-2209010400000)\/" ? "" : model.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm');
        };
        function load() {
            Global.CallServer('/AppointmentTime/Details?Id=' + callerOptions.Id, function (response) {
                if (!response.IsError) {
                    populate(response.Data);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                response.Id = -8;
                Global.Error.Show(response, {});
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (Id === callerOptions.Id) {
                return;
            }
            load();
            Id = callerOptions.Id;
        };
    }).call(service.AppointmentTime = {});
};