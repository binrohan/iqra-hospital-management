
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, purchaseBill = {};
    function save() {
        if (formModel.IsValid) {
            windowModel.View.find('#progress_ba_container').show();
            windowModel.Wait('Please Wait while saving data......');
            var model = {
                Description: formModel.Description,
                Responsible: formModel.Responsible,
                TypeId: formModel.TypeId,
                ExpenseAt: formModel.ExpenseAt,
                Amount: formModel.Amount
            };
            model.Image = { IsFile: true, File: windowModel.Image.files[0] }
            Global.Uploader.upload({
                data: model,
                url: '/Expense/AddNew',
                onProgress: function (data) {
                    windowModel.View.find('#progress_ba_container #myBar').css({ width: (data.loaded / data.total) * 100 + '%' });
                    console.log(data);
                },
                onComplete: function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        windowModel.View.find('#progress_ba_container #myBar').css({ width: 100 + '%' });
                        callerOptions.onSaveSuccess();
                        close();
                    } else if (response.Id === -4) {
                        //alert('This email is already registered.');
                    }
                    else
                        Global.Error.Show(response);
                },
                onError: function () {
                    windowModel.Free();
                    response.Id = -8;
                    Global.Error.Show(response, { user: '' })
                }
            });
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function setPurchaseBill(list) {
        //Payment,Bill,Expense
    };
    function load() {
        var to =Global.DateTime.GetObject(formModel.Date, 'yyyy/MM/dd');
        to.setDate(to.getDate()+1);
        to=to.format('yyyy/MM/dd HH:mm');
        Global.CallServer('/ExpenseArea/Expense/GetReportData?from=' + formModel.Date + ' 00:00' + '&to=' + to, function (response) {
            if (!response.IsError) {
                
            } else {
                Global.Error.Show(response, {});
            }
        }, function (response) {
            response.Id = -8;
            Global.Error.Show(response, {});
        }, null, 'Get');
    };
    function onChange(date) {
        load();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            load();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ExpenseArea/Templates/AddReport.html', function (response) {
                windowModel = Global.Window.Bind(response);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                $(inputs['Date']).val(new Date().format('yyyy/MM/dd'));
                Global.DatePicker.Bind($(inputs['Date']), { format: 'yyyy/MM/dd', onChange: onChange });
                windowModel.Show();
                load();
            }, noop);
        }
    };
};