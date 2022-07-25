
var Controller = new function () {
    var callerOptions, windowModel;
    function onSetLeave(list,views,viewModel) {
        list.each(function () {
            
        });
    };
    function setCalendar() {
        Global.Add({
            model: callerOptions.model,
            modules: ['Weekend', 'LeaveItem'],
            url: '/Content/IqraPharmacy/EmployeeArea/Content/Calendar.js',
            OnLeaveLoaded: onSetLeave,
            Container: windowModel.View.find('#calender_container')
        });
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {

    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            setCalendar();
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/HRIS/Templates/Leave/LeaveDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                //windowModel.View.find('.btn_save').remove();
                setCalendar();
                windowModel.Show();
            }, noop);
        }

    };
};