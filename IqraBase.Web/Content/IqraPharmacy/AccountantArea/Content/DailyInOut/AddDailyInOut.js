var Controller = new function () {
    var that = this, dataModel = {}, formModel = {}, callarOptions = {}, defaultSalary = 0, windowModel, formInputs, drp = {};
    function getModel() {
        dataModel.Remarks = formModel.Remarks;
        return dataModel;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/AccountantArea/DailyInOut/OnCreate', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/ItemSalesArea/DailySale/Create');
                }
            }, function (response) {
                windowModel.Free();
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
    function populate(list) {
        windowModel.Free();

        var model = list[1][0];
        dataModel = {};
        dataModel.BeforeBalance = list[1][0].AfterBalance || 0;
        formModel.BeforeBalance = dataModel.BeforeBalance.toFloat()
        dataModel.In = model.Debit || 0;
        dataModel.Out = model.Credit || 0;
        dataModel.AfterBalance = dataModel.In - dataModel.Out + dataModel.BeforeBalance;
        formModel.AfterBalance = dataModel.AfterBalance.toFloat();
        formModel.In = dataModel.In.toFloat();
        formModel.Out = dataModel.Out.toFloat();
        formModel.Date = Global.DateTime.GetObject(list[2][0].FilterDate, 'yyyy-MM-dd HH:mm').format('dd/MM/yyyy');

    };
    function load() {
        var to = (formModel.Date ? '?Date=' + Global.DateTime.GetObject(formModel.Date, 'dd/MM/yyyy').format('yyyy-MM-dd HH:mm') : '');
        windowModel.Wait();
        Global.CallServer('/AccountantArea/DailyInOut/GetLastEntry' + to, function (response) {
            windowModel.Free();
            if (!response.IsError) {
                populate(response.Data)
            } else {
                Global.Error.Show(response, '');
            }
        }, function (response) {
            windowModel.Free();
            response.Id = -8;
            alert(' Errors');
        }, null, 'Get');
    };
    function show() {
        windowModel.Show();
        load();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '98%' });
        that.Events.Bind();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/AddDailyInOut.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    this.Events = new function () {
        var isBind = false;
        this.Bind = function () {
            if (!isBind) {
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Click(windowModel.View.find('.btn_save'), save);
                Global.DatePicker.Bind($(formInputs['Date']), { format: 'dd/MM/yyyy', onChange: load });
            }
        };
    };
};

