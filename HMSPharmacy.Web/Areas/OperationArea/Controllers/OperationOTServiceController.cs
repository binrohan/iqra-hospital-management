using IqraBaseService.Helper;
using IqraHMS.OT.Data.Entities.OperationArea;
using IqraHMS.OT.Data.Models.OperationArea;
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
    public class OperationOTServiceController : AppBaseController<OperationOTService, OperationOTServiceModel>
    {
        // GET: OperationArea/OperationOTService/OTServiceByOperatrion?Id=&type=
        OperationOTServiceService __service;
        public OperationOTServiceController()
        {
            service = __service = new OperationOTServiceService();
        }

        public override ActionResult Delete(Guid id)
        {
            var result = __service.Remove(id, appUser.Id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}