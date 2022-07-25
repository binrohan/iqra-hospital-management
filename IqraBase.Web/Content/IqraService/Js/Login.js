var LogIn = new function () {
    var that = this, form = $('#login_form'), bindingModel = { RememberMe: true };

    function checkValidation() {

    };
    function submit() {
        if (bindingModel.IsValid) {
            bindingModel.RememberMe = false;
            Global.Busy();
            Global.CallServer('/Account/LogIn/', function (response) {
                Global.Free();
                if (!response.IsError) {
                    location.href = "/";
                } else {
                    alert('UserName and Password does not match.')
                }
            }, function () {
                Global.Free();
            }, bindingModel);
        }
        return false;
    };

    this.ForgetPassword = new function () {
        var label2 = this, windowModel, formModel = {}, inputs;
        var error = new function () {
            this.Save = function (response) {
                if (response.Id == -1) {
                    alert('Username and email do not match!!');
                } else {
                    Global.ShowError(response.Id, { path: '/Health/Dashboard/ChangePassword', section: 'Global.Deactivate save', user: 'Global', });
                }
            };
        };
        function save() {
            if (formModel.IsValid) {
                windowModel.Wait('Please wait while sending mail....');
                Global.CallServer('/ForgetPassword/Index', function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        alert('Your Password is sent to your email.')
                        cancel();
                    } else {
                        error.Save(response);
                    }
                }, function (response) {
                    windowModel.Free();
                    Global.ShowError(response);
                }, formModel, 'POST')
            }
            return false;
        };
        function cancel() {
            windowModel.Hide();
        };
        function populateModel() {
            formModel.UserName = '';
            formModel.Email = '';
            formModel.RememberMe = false;
        };
        this.Show = function () {
            populateModel();
            if (windowModel) {
                windowModel.Show();
            } else {
                Global.Wait();
                Global.LoadTemplate('/Areas/Account/Templates/ForgetPassword.html', function (response) {
                    Global.Free();
                    windowModel = Global.Window.Bind(response, { width: 400 });
                    windowModel.View.find('.btn_cancel').click(cancel);
                    windowModel.View.find('form.form-horizontal.smart-form').submit(function () { setTimeout(save, 0); return false; });
                    inputs = Global.Form.Bind(formModel, windowModel.View);
                    windowModel.Show();
                }, function (response) {
                });
            }
        };
        this.Events = new function () {
            $(document).ready(function () {
                $('#btn_forget_passwoed').click(label2.Show);
            });
        };
    };

    this.Events = new function () {
        //form.submit(submit);
        form.find('.btn_save').click(submit);
        Global.Form.Bind(bindingModel, form);
    };
};