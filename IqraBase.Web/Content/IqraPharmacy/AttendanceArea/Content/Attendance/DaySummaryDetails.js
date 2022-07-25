
var Controller = new function () {
    var callerOptions, windowModel;
    function setChart() {
        var elm = windowModel.View.find('#chart_container');
        elm.html(callerOptions.View).find('.view_port').css({ height: '650px' }).find('.graph_container').html('');
        LineChart.Bind({
            container: elm.find('.graph_container')[0],
            data: callerOptions.Data,
            sections: [
                    { valueField: 'Sales', title: 'Sales', color: '#FF0000', textColor: '#fefefe' },
                    { valueField: 'Shift', title: 'Shift', color: '#0000FF', textColor: '#fefefe' }
            ],
            width: elm.width(),
            height: 600,
            max: callerOptions.Max
        });
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            setChart();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AttendanceArea/Templates/DaySummaryDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                setChart();
            }, noop);
        }
    };
};