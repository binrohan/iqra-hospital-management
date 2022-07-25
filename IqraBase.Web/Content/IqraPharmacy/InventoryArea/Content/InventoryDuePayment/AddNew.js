var Controller = new function () {
    var that = this, windowModel, formModel = {}, callarOptions = {}, service = {};
    function getTemplate(model) {
        var view = `<html>
<head>
    <title>Pharmacy Bill</title>
    <style type="text/css" media="print">
        @page {
            size: auto;
            margin: 0mm;
        }

        html {
            background-color: #FFFFFF;
            margin: 0px;
        }
    </style>
</head>
<body style="padding: 20px;">
    <div style="text-align:center;font-size:1.5em;font-weight:bold">Lazz Pharma Limited</div>
    <div style="text-align:center">Joypara, Dohar, Dhaka</div>
    <div style="border:2px solid silver;"></div>
    <div><label>Patient Name : </label><span style="text-align:right">Johura Khatun</span></div>
    <div style="position:relative;width:100%;height:30px;">
        <div style="position:absolute;left:0;top:0">Total Bill : </div>
        <div style="position:absolute;right:0;top:0"> `+model.Due.toMoney()+` </div>
    </div>
    <div style="position:relative;width:100%;height:30px;">
        <div style="position:absolute;left:0;top:0">Paid Amount : </div>
        <div style="position:absolute;right:0;top:0"> `+model.Paid.toMoney()+` </div>
    </div>
    <div style="position:relative;width:100%;height:30px;">
        <div style="position:absolute;left:0;top:0">Discount Amount: </div>
        <div style="position:absolute;right:0;top:0"> `+model.Discount.toMoney()+` </div>
    </div>
    <div style="border:1px solid silver;"></div>
    <div style="position:relative;width:100%;height:30px;">
        <div style="position:absolute;left:0;top:0">Due Amount : </div>
        <div style="position:absolute;right:0;top:0"> `+(model.Due-model.Paid-model.Discount).toMoney()+` </div>
    </div>
</body>
</html>`;
        return view;
    };
    function print(model) {
        var mywindow = window.open('', 'PRINT', 'height=500,width=1100');
        mywindow.document.write(getTemplate(model));
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
    };
    function getModel() {
        var model = {
            PatientId: formModel.PatientId,
            Paid: parseFloat(formModel.Paid || '0') || 0,
            Due: parseFloat(formModel.Due || '0') || 0,
            Discount: parseFloat(formModel.Discount || '0') || 0,
            Description: formModel.Description
        };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            var model = getModel();
            if (model.Due < model.Paid + model.Discount) {
                alert("Due can't be less than (Paid + Discount).");
                return;
            } else if (model.Paid<0|| model.Discount<0) {
                alert("Paid amount and Discount can't be less than 0.");
                return;
            }
            windowModel.Wait();
            Global.CallServer('/InventoryArea/InventoryDuePayment/Create', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    print(model);
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/PatientArea/Patient/Create');
                }
            }, function (response) {
                windowModel.Free();
                response.Id = -8;
                alert('Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Errors.');
        }
        return false;
    };
    function cancel() {
        windowModel.Hide(function () {
        });
    };
    function populate(model) {
        service.model = model;
        formModel.PatientId = model.Id;
        formModel.Patient = model.Name;
        formModel.Due = model.Due;
        formModel.Paid = model.Due;
        formModel.Discount = formModel.DiscountP = 0;
        formModel.Description = '';
    };
    function loadDetails() {
        windowModel.Wait('Please wait while loading data.');
        Global.CallServer('/PatientArea/Patient/Details?Id=' + callarOptions.PatientId, function (response) {
            if (!response.IsError) {
                windowModel.Free();
                populate(response.Data);
            } else {
                alert('Errors');
                //error.Save(response, saveUrl);
            }
        }, function (response) {
            alert('Errors');
            response.Id = -8;
            //error.Save(response, saveUrl);
        }, null, 'Get');
    };
    function show() {
        loadDetails();
        windowModel.Show();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        service.Events.Bind(Global.Form.Bind(formModel, windowModel.View));
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/InventoryArea/Templates/InventoryDuePayment/Add.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        function onPChange() {
            var p = parseFloat(formModel.DiscountP || '0') || 0;
            var t = service.model.Due.mlt(p).div(100).toFloat();
            formModel.Discount = t;
            formModel.Paid = service.model.Due - t;
        };
        function onTChange() {
            var t = parseFloat(formModel.Discount || '0') || 0;
            if (t > 0) {
                var p = t.mlt(100).div(service.model.Due).toFloat();
                formModel.DiscountP = p;
                formModel.Paid = service.model.Due - t;
            } else {
                formModel.Discount = '';
                formModel.DiscountP = 0;
                formModel.Paid = service.model.Due;
            }
        };
        this.Bind = function (inputs) {
            $(inputs['DiscountP']).keyup(onPChange).blur(onPChange);
            $(inputs['Discount']).keyup(onTChange).blur(onTChange);
        };
    }).call(service.Events = {});
};

