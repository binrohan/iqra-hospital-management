var Controller = new function () {
   
    var service = {}, windowModel, formModel = {}, callerOptions, currentDate = new Date(),
        filter = { "field": "Id", "value": "", Operation: 0 };
    function close() {
        windowModel && windowModel.Hide();
    };

    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    }
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    this.Show = function (model) {
        callerOptions = model;
        filter.value = model.BedAllocationId;
        if (windowModel) {
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/PrintBedReceipt.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BedAllocation.Bind();
                setTabEvent();
            }, noop);
        }
    };

    (function () {
        var isBind, Id;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#printBedReceipt'));
            }
            reset();
            windowModel.View.find('#printBedReceipt').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        };
        function populate(model) {
            var patientModel = model[0][0],
                patientTransectionModel = model[1][0],
                bedAllocationModel = model[2][0]

            for (var key in formModel) {
                if (typeof patientModel[key] != 'undefined') {
                    formModel[key] = patientModel[key];
                }
            }

            for (var tran in formModel) {
                if (typeof patientTransectionModel[tran] != 'undefined') {
                    formModel[tran] = patientTransectionModel[tran];
                }
            }

            for (var bdal in formModel) {
                if (typeof bedAllocationModel[bdal] != 'undefined') {
                    formModel[bdal] = bedAllocationModel[bdal];
                }
            }

            //console.log(['data', formModel, patientModel, patientTransectionModel, bedAllocationModel]);
          
            currentDate = model[3][0].CurrentDate.getDate();
            patientModel.DateOfBirth = patientModel.DateOfBirth.getDate();
            patientModel.PatientAge = new Date(currentDate.getTime() - patientModel.DateOfBirth.getTime());
            patientModel.PatientAge.setFullYear(patientModel.PatientAge.getFullYear() - 1970);
            formModel.PatientAge = patientModel.PatientAge.getFullYear() + ' yrs ' + (patientModel.PatientAge.getMonth() + 1) + ' mnths ' + patientModel.PatientAge.getDate() + ' days ';

            formModel.currentDate = bedAllocationModel.CreatedAt.getDate().format('dd/MM/yyyy hh:mm')
            
            Global.Barcode.Bind({
                elm: windowModel.View.find('#ptnt_barcode'),
                text: patientModel.Code,
                height: 30
            });
        };
        function load() {
            Global.CallServer('/BillingArea/BedAllocation/PrintBedReceipt?Id=' + callerOptions.BedAllocationId, function (response) {

                console.log(response);
                if (!response.IsError) {
                    populate(response.Data);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                response.Id = -8;
                Global.Error.Show(response, {});
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (Id === callerOptions.BedAllocationId) {
                return;
            }
            load();
            Id = callerOptions.BedAllocationId;
            service.PrintService.Bind();
        };
    }).call(service.BedAllocation = {});

    (function () {

        function printElem(elm) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<html><head><title>' + 'Inv Invoice' + '</title>');
            mywindow.document.write('<link href="/Content/bootstrap.min.css" rel="stylesheet" /><script src="/Content/IqraService/Js/global.js"></script><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style></head>');
            mywindow.document.write('<body style="padding: 20px;">');

            mywindow.document.write(elm.html())
            mywindow.document.write('<script type="text/javascript"> $(document).ready(function () { window.print();});</script>');
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus();
            return true;
        }

        this.Print = function (elm) {
            printElem(elm);
        }
        this.Bind = function () {
            Global.Click(windowModel.View.find('.btn_print'), printElem, windowModel.View.find('#page-wrap'));
        };
    }).call(service.PrintService = {});

};