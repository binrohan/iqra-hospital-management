var Controller = new function () {
    var that = this, options, formModel = {}, defaultSalary = 0, windowModel, formInputs, drp = {}, dates = [],
        startDate, endDate;
    function getModel() {
        var model = {};
        model.AdmissionId = options.model.AdmissionId;
        model.ServiceId = formModel.ServiceId;
        model.ConsultantId = formModel.ConsultantId;
        model.ReferredBy = formModel.ReferredBy;
        model.StartAt = formModel.StartAt || new Date().format('dd/MM/yyyy HH:mm');

        return model;
    };
    function save() {
        //console.log(['options.model', options.model]);
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/ServiceArea/PatientService/Add', function (response) {
                if (!response.IsError) {
                    windowModel.Free();
                    options.onSuccess(formModel, formInputs);
                    cancel();
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                alert('Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Errors.');
        }
        return false;
    };
    function cancel() {
        windowModel.Hide(function () {
        });
    };
    function show(model) {
        windowModel.Show();
    }
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        that.Events.Bind(options.model);
        show(options.model);
    };
    function setDate() {
        dates = [];
        if (endDate && startDate) {
            var date = new Date(startDate), leaveItem;
            for (; date < endDate;) {
                leaveItem = { StartAt: date.format('dd/MM/yyyy hh:mm') };
                date = Global.DateTime.GetObject(date.format('dd/MM/yyyy'), 'dd/MM/yyyy');
                date.setDate(date.getDate() + 1);
                if (date > endDate) {
                    date = endDate;
                }
                leaveItem.EndAt = date.format('dd/MM/yyyy hh:mm');
                dates.push(leaveItem)
            }
        }
    }
    this.OnStartDateChanged = function (date) {
        startDate = date;
        setDate();
    };
    this.OnEndDateChanged = function (date) {
        endDate = date;
        setDate();
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraHMS/ServiceArea/Templates/AddPatientService.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        function bindDropDown() {
            AppComponent.Service.AutoCompleteDone({ elm: $(formInputs['ServiceId']) });
            AppComponent.Doctor.AutoCompleteDone({ elm: $(formInputs['ConsultantId']) });
            Global.AutoComplete.Bind({
                elm: $(formInputs['ReferredBy']),
                Id: 'ReferredBy',
                url: '/ReferralArea/Reference/AutoComplete'
            });
        };
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Click(windowModel.View.find('.btn_save'), save);
                bindDropDown();
            }
        };
    };
};

