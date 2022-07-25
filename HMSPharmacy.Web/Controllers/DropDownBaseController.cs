using IqraBase.Data.Entities;
using IqraBase.Data.Models;
using IqraBase.Service;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace IqraHMS.OT.Web.Controllers
{
    public class DropDownBaseController<TEntity, TModel> : AppBaseController<TEntity, TModel> where TEntity : DropDownBaseEntity where TModel : DropDownBaseModel
    {

        public IDropDownService<TEntity> _service;
        // GET: DropDownBase
        public virtual ActionResult DropDown()
        {
            return Json(_service.DropDownData(), JsonRequestBehavior.AllowGet);
        }
        //public virtual ActionResult DropDown(string txtSearch)
        //{
        //    if (string.IsNullOrEmpty(txtSearch))
        //    {
        //        return DropDown();
        //    }
        //    return Json(_service.DropDownData(d=>d.Name.StartsWith(txtSearch)), JsonRequestBehavior.AllowGet);
        //}
        public virtual async Task<JsonResult> AutoComplete(Page page)
        {
            page.SortBy = "Name";
            using (var db = new DBService())
            {
                return Json(await db.List(db.GetQuery(page, db.GetBaseQuery(page, db.GetQuery(typeof(TEntity), new string[2] { "[Id]", "[Name]" }, page)))), JsonRequestBehavior.AllowGet);
            }
        }
    }
}