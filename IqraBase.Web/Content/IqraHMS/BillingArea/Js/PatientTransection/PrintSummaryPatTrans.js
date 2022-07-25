
var Controller = new function () {
    var windowModel, callerOptions, service = {}, formModel = {};
    function close() {
        if (windowModel) {
            windowModel.Hide();
        }
    };
    function populate() {
        Global.Copy(formModel, callerOptions.formModel, true);
    };
    function show() {
        windowModel.Show();
        service.Transection.Set();
        service.Patient.Load();
        populate();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
            service.Patient.Bind();
            console.log('Hello');
        } else {
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/PrintSummaryPatTrans.html', function (response) {
                windowModel = Global.Window.Bind(response);
                Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_print'), service.PrintService.Print);
                show();
            }, noop);

        }
    };

    (function () {
        var container;
        function getRow(data) {
            var tr = `<tr>
                                <td>`+ data.TransectionType+`</td>
                                <td>`+ data.BillAmount.toMoney() +`</td>
                                <td>`+ data.PaidAmount.toMoney() +`</td>
                                <td>`+ data.Discount.toMoney() +`</td>
                                <td>`+ data.Balance.toMoney() +`</td>
                            </tr>`;
            return tr;
            //{ field: 'TransectionType', filter: true, Add: false },
            //{ field: 'Remarks', filter: true, Add: false },
            //{ field: 'BillAmount', filter: true, Add: false },
            //{ field: 'PaidAmount', filter: true, Add: false },
            //{ field: 'Discount', filter: true, Add: false },
            //{ field: 'Balance', filter: true, Add: false },
            //{ field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
            //{ field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false }

        };
        this.Set = function () {
            container = container || windowModel.View.find('table#items tbody');
            container.empty();
            //for (var i = 0; i < 200; i++) {
                callerOptions.dataSource.each(function () {
                    container.append(getRow(this));
                });
            //}
        };
    }).call(service.Transection = {});

    (function () {
        var dataSource = {}, Id;
        function patInfo(model) {
            var patientModel = model[0][0];
            for (var key in formModel) {
                if (typeof patientModel[key] != 'undefined') {
                    formModel[key] = patientModel[key];
                }
            }
            console.log(['data', formModel, patientModel]);

            currentDate = model[1][0].CurrentDate.getDate();
            patientModel.DateOfBirth = patientModel.DateOfBirth.getDate();
            patientModel.PatientAge = new Date(currentDate.getTime() - patientModel.DateOfBirth.getTime());
            patientModel.PatientAge.setFullYear(patientModel.PatientAge.getFullYear() - 1970);
            formModel.PatientAge = patientModel.PatientAge.getFullYear() + ' yrs ' + (patientModel.PatientAge.getMonth() + 1) + ' mnths ' + patientModel.PatientAge.getDate() + ' days ';
        };
        this.Load = function () {
            console.log(['load()', callerOptions, callerOptions.PatientId]);
            Global.CallServer('/PatientArea/Patient/PrintRelease?Id=' + callerOptions.PatientId, function (response) {
                console.log(response);
                if (!response.IsError) {
                    patInfo(response.Data);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                response.Id = -8;
                Global.Error.Show(response, {});
            }, null, 'Get');
        };
    }).call(service.Patient = {});

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
            printElem(windowModel.View.find('#print_container').html());
        };
    }).call(service.PrintService = {});
};