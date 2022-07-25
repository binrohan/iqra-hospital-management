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
    public class OperationSurgonController : AppBaseController<OperationSurgon, OperationSurgonModel>
    {
        // GET: OperationArea/OperationSurgon/SurgonByOperatrion?Id=&type=
        OperationSurgonService __service;
        public OperationSurgonController()
        {
            service = __service = new OperationSurgonService();
        }

        public async Task<JsonResult> SurgonByOperatrion(Page page)
        {
            return Json(await __service.SurgonByOperatrion(page), JsonRequestBehavior.AllowGet);
        }

        public override ActionResult Delete(Guid id)
        {
            return Json(__service.Remove(id, appUser.Id), JsonRequestBehavior.AllowGet);
        }
    }
}