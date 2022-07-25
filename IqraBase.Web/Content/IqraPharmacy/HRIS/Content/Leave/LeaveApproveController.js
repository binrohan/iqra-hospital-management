
var Controller = new function () {
    var callerOptions,windowModel;
    function onChange(model) {
        var cls = 'glyphicon-';
        if (model.Status == 2) {
            model.Status = 1
            cls += 'remove';
            model.ViewModel.ViewPort.find('.glyphicon').removeClass('glyphicon-ok')
        } else {
            model.Status = 2
            cls += 'ok';
            model.ViewModel.ViewPort.find('.glyphicon').removeClass('glyphicon-remove')
        }
        console.log(model.ViewModel.ViewPort.find('.glyphicon'));

        model.ViewModel.ViewPort.find('.glyphicon').addClass(cls);
    };
    function onSetLeave(list, views, viewModel) {
        var cls = '';
        callerOptions.List = [];
        views.each(function () {
            var elm = $('<div style="positopn:absolute;width:100%;height:100%; opacity:0.7;left:0;top:0;background-color:#555;"></div>');
            //this.ViewPort.css({opacity:0.6});
            this.ViewPort.append(elm);
            this.disabledElm = elm;
        });
        list.each(function () {
            if (this.LeaveInfoId == callerOptions.model.Id) {
                callerOptions.List.push(this);
                if (this.Status == 2) {
                    cls = 'ok';
                } else {
                    cls = 'remove';
                }
                this.ViewModel.ViewPort.append('<span class="icon_container"><span class="hover_grow glyphicon glyphicon-' + cls + '"></span></span>');
                this.ViewModel.disabledElm.remove();
                Global.Click(this.ViewModel.ViewPort.find('.icon_container'), onChange, this);
            }
        });
    };
    function setCalendar() {
        Global.Add({
            model: callerOptions.model,
            url: '/Content/IqraPharmacy/EmployeeArea/Content/Calendar.js',
            OnLeaveLoaded: onSetLeave,
            modules: ['EmployeeShift', 'Weekend', 'LeaveItem'],
            Container: windowModel.View.find('#calender_container')
        });
    };
    function getModel() {
        var list = [], approved=0,rejected=0;
        callerOptions.List.each(function () {
            if (this.Status == 0) {
                this.Status = 1;
                approved = 1;
            } else if (this.Status == 1) {
                approved = 1;
            } else if (this.Status == 2) {
                rejected = 2;
            }
            list.push({ Id: this.Id, Status: this.Status });
        });
        return { Status: rejected + approved, Items: list, Id: callerOptions.model.Id };
    };
    function save() {
        var model = getModel();
        console.log(model);
        windowModel.Wait();
        var model = getModel();
        Global.CallServer('/HRIS/Leave/OnApprove', function (response) {
            windowModel.Free();
            if (!response.IsError) {
                callerOptions.onSaveSuccess(formModel, formInputs);
                close();
            } else {
                alert('Server Errors.');
            }
        }, function (response) {
            response.Id = -8;
            alert('Errors.');
        }, model, 'POST');
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {

    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            setCalendar();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/HRIS/Templates/Leave/LeaveApprove.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                //Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_save').click(save);
                windowModel.Show();
                setCalendar();
            }, noop);
        }
        
    };
};