using IqraHMS.OT.Data.Entities.AccountArea;
using IqraHMS.OT.Data.Models.AccountArea;
using IqraHMS.OT.Service.AccountArea;
using IqraHMS.OT.Web.Controllers;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.AccountArea.Controllers
{

    public class AccountReferenceController : AppBaseController<AccountReference, AccountReferenceModel>
    {
        // GET: AccountArea/AccountReference/AutoComplete
        AccountReferenceService _service;
        public AccountReferenceController()
        {
            service = _service = new AccountReferenceService();
        }
        public async Task<JsonResult> AutoComplete(Page page, string reference)
        {
            return Json(await _service.AutoComplete(page, reference), JsonRequestBehavior.AllowGet);
        }
    }
}