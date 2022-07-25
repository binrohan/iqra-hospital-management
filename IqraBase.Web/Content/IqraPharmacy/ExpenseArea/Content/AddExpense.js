
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;
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
    function bindDropdown() {
        var responsible = {
            url: '/EmployeeArea/Employee/AutoComplete',
            onDataBinding: function (response) {

            },
            elm: $(inputs['Responsible'])
        };
        Global.AutoComplete.Bind(responsible);
        var type = {
            url: '/ExpenseArea/ExpenseType/AutoComplete',
            onDataBinding: function (response) {

            },
            elm: $(inputs['TypeId'])
        };
        Global.AutoComplete.Bind(type);
    };
    function readURL() {
        var input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#img_prev').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ExpenseArea/Templates/AddExpense.html', function (response) {
                windowModel = Global.Window.Bind(response);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Submit(windowModel.View.find('form'), save);
                windowModel.Image = $('#btn_image').change(readURL)[0];
                inputs = Global.Form.Bind(formModel, windowModel.View);
                bindDropdown();
                windowModel.Show();
            }, noop);
        }
    };
    this.Status = function (txt) {
        if (txt == 'End') {
            windowModel.View.find('.status_container').empty();
            //windowModel.View.find('#progress_ba_container').hide();
            windowModel.View.find('#progress_ba_container #myBar').css({ width: 0 });
            close();
            callerOptions.Success();
        } else {
            windowModel.View.find('.status_container').prepend('<div class="col-md-12">' + txt + '</div>');
        }
    };
};