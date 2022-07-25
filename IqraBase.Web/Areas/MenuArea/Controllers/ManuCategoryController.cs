using IqraBase.Web.Controllers;
using IqraBase.Data.Entities.MenuArea;
using IqraBase.Data.Models.MenuArea;
using IqraBase.Service.MenuArea;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IqraBase.Web.Areas.MenuArea.Controllers
{
    public class MenuCategoryController : DropDownBaseController<MenuCategory, MenuCategoryModel>
    {
        MenuCategoryService __service;
        public MenuCategoryController()
        {
            service = _service = __service = new MenuCategoryService();
        }
    }
}