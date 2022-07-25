var Controller = new function () {
    var service = {}, windowModel, callerOptions, currentDate = new Date(),
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
        filter.value = model.Id;
        if (windowModel) {
            windowModel.Show();
            service.InvestigationFees.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/InvestigationDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.InvestigationFees.Bind();
                setTabEvent();
            }, noop);
        }
    };

    (function () {
        
        var isBind, formModel = {}, dataSource = {}, Id, selfServicre = {};
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#investigationFees'));
            }
            reset();
            windowModel.View.find('#investigationFees').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        };
        function setOrderedList(str, container) {
            var index = 1, value = '';
            str.split('\n').each(function () {
                value += (index++ + '. ' + this + '</br>');
            });
            container.append(value);
        };

        function populate(model) {
            var patientModel = model[0][0], feesModel = model[1][0];
            for (var key in formModel) {
                if (typeof patientModel[key] != 'undefined') {
                    formModel[key] = patientModel[key];
                }
            }
            formModel.PaidAmount = feesModel.PaidAmount;
            formModel.TotalAmount = feesModel.TotalAmount;
            formModel.DiscountedAmount = feesModel.DiscountedAmount;
            formModel.DueAmount = feesModel.DueAmount;
            formModel.DiscountTaka = feesModel.DiscountTaka;
            formModel.DiscountPercentage = feesModel.DiscountPercentage;

            selfServicre.Investigation.Create(model[1]);
            currentDate = model[2][0].CurrentDate.getDate();
            patientModel.DateOfBirth = patientModel.DateOfBirth.getDate();
            patientModel.PatientAge = new Date(currentDate.getTime() - patientModel.DateOfBirth.getTime());
            patientModel.PatientAge.setFullYear(patientModel.PatientAge.getFullYear() - 1970);
            formModel.PatientAge = patientModel.PatientAge.getFullYear() + ' yrs ' + (patientModel.PatientAge.getMonth() + 1) + ' mnths ' + patientModel.PatientAge.getDate() + ' days ';
            

        };
        function load() {

            Global.CallServer('/BillingArea/InvestigationFees/Details?Id=' + callerOptions.InvestigationId, function (response) {

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
        (function () {
            var container;
            function create(item, i) {
                var elm = $(`<tr class="investigation_item">
                                    <td>`+i+`</td>
                                    <td> `+item.InvestigationRefference+` </td>
                                    <td align="right"> `+item.Cost+` </td>
                                </tr>`);

                container.before(elm);
            };
            this.Create = function (list) {
                container = container || windowModel.View.find('#cost_summary');
                windowModel.View.find('.investigation_item').remove();
                list.each(function (i) {
                    create(this, i + 1);
                });
            };
        }).call(selfServicre.Investigation = {});
        this.Bind = function () {
            bind();
            if (Id === callerOptions.InvestigationId) {
                return;
            }
            load();
            Id = callerOptions.InvestigationId;
            service.PrintService.Bind();
        };
    }).call(service.InvestigationFees = {});

    (function () {

        function printElem(elm) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<html><head><title>' + 'InvestigationFees' + '</title>');
            mywindow.document.write('<link href="/Content/bootstrap.min.css" rel="stylesheet" /><script src="/Content/IqraService/Js/global.js"></script><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style></head>');
            mywindow.document.write('<body style="padding: 20px;">');
            //mywindow.document.write('<table style="border-collapse: collapse;">');
            //printHeader(model, mywindow);
            //printData(model, mywindow);
            mywindow.document.write(elm.html())
            mywindow.document.write('<script type="text/javascript"> $(document).ready(function () { window.print();});</script>');
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
            //mywindow.print();
            //mywindow.close();
            return true;
        }

        this.Print = function (elm) {
            printElem(elm);
        }
        this.Bind = function () {
            Global.Click(windowModel.View.find('.btn_print'), printElem, windowModel.View.find('#investigationFees'));
        };
    }).call(service.PrintService = {});

};