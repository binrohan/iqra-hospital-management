
var Controller = new function () {
    var windowModel, callerOptions, service = {};
    function close() {
        if (windowModel) {
            windowModel.Hide();
        }
    };
    function show() {
        windowModel.View.find('#print_container').html(callerOptions.html);
        windowModel.Show();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/PrintDischargeBill.html', function (response) {
                windowModel = Global.Window.Bind(response);
                show();
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_print'), service.PrintService.Print);
            }, noop);
        }
    };
    (function () {
        function printElem(view) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<html><head><title>' + 'Appointment Charge' + '</title>');
            mywindow.document.write('<link href="/Content/bootstrap.min.css" rel="stylesheet" /><script src="/Content/IqraService/Js/global.js"></script><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style></head>');
            mywindow.document.write('<body style="padding: 20px;">');

            mywindow.document.write(view)
            mywindow.document.write('<script type="text/javascript"> $(document).ready(function () { window.print();});</script>');
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus();
            return true;
        };
        this.Print = function () {
            printElem(callerOptions.html);
        };
    }).call(service.PrintService = {});
};