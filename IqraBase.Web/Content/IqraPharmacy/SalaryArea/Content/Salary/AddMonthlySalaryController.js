var Controller = new function () {
    var that = this, options, formModel = {}, defaultSalary = 0, windowModel, formInputs, drp = {}, dayOfweek = {};
    function getModel() {
        var model = {};
        var date = Global.DateTime.GetObject('01/'+formModel.Date, 'dd/MM/yyyy');
        model.From = date.format('dd/MM/yyyy');
        date.setMonth(date.getMonth() + 1);
        date.setSeconds(-1);
        model.To = date.format('dd/MM/yyyy hh:mm');
        model.Year = date.getFullYear();
        model.Month = date.getMonth()+1;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/SalaryArea/Salary/Create', function (response) {
                if (!response.IsError) {
                    windowModel.Free();
                    options.onSaveSuccess(formModel, formInputs);
                    cancel();
                } else {
                    alert('Errors.');;
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
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/SalaryArea/Templates/Salary/AddMonthlySalary.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Submit(windowModel.View.find('form'), save);
            }
        };
    };
};

