
var Controller = new function () {
    var callerOptions,windowModel;
    function setCalendar() {
        Global.Add({
            model: callerOptions.model,
            url: '/Content/IqraPharmacy/EmployeeArea/Content/Calendar.js',
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
            Global.LoadTemplate('/Content/IqraPharmacy/HRIS/Templates/Leave/LeaveApprove.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                //Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_save').remove();
                setCalendar();
                windowModel.Show();
            }, noop);
        }
        
    };
};