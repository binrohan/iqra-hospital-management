
var Controller = new function () {
    var windowModel, callerOptions, formModel = {};
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {
        windowModel.Wait();
        Global.CallServer('/ProductOrderArea/OrderEmails/GetContent?Id=' + callerOptions.model.Id, function (response) {
            windowModel.Free();
            if (!response.IsError) {
                formModel.Content = response.Data.Content;
            } else {

            }
        }, function (response) {
            windowModel.Free();
            alert('Network error had occured.');
        }, { PageSize: 9999 }, 'POST');
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductOrderArea/Templates/EmailDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                populate();
                windowModel.Show();
            }, noop);
        }
    };
};