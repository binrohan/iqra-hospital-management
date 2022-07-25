using IqraHMS.OT.Data.Entities.AccountArea;
using IqraHMS.OT.Data.Entities.OperationArea;
using IqraHMS.OT.Data.Models.AccountArea;
using IqraHMS.OT.Data.Models.OperationArea;
using IqraHMS.OT.Service.AccountArea;
using IqraHMS.OT.Service.OperationArea;
using IqraHMS.OT.Web.Controllers;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.OperationArea.Controllers
{

    public class OperationController : AppBaseController<Operation, OperationModel>
    {
        // GET: AccountArea/Operation/AutoComplete
        OperationService _service;
        public OperationController()
        {
            service = _service = new OperationService();
        }

        public ActionResult MakePayment(OperationPaymentModel model)
        {
            return Json(_service.MakePayment(model, appUser.Id));
        }

        public async Task<ActionResult> ChangeStatus(OperationChangeStatusModel model)
        {
            return Json(await _service.ChangeStatus(model, appUser.Id));
        }
    }
}