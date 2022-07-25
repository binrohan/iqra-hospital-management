using IqraService.DB;
using IqraService.Helper;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using IqraBase.Service;
using IqraHMS.OT.Data;
using IqraBase.Data.Entities;

namespace IqraHMS.OT.Service
{
    public class AppBaseService<T> : IqraBase.Service.AppBaseService<T>, IService<T> where T : AppBaseEntity
    {
        public AppBaseService() : base(new AppDB())
        {
        }
    }
    public class DropDownBaseService<T> : AppBaseService<T>, IDropDownService<T> where T : DropDownBaseEntity
    {
        public virtual ResponseJson DropDownData(Expression<Func<T, bool>> filter = null)
        {
            return new ResponseJson
            {
                Data = Get(e=>e.IsDeleted==false, p => p.Name).Select(p => new { text = p.Name, value = p.Id })
            };
        }
        public virtual ResponseJson AutoCompleteData(Expression<Func<T, bool>> filter = null)
        {
            return new ResponseJson
            {
                Data = Get(filter, p => p.Name).Select(p => new { text = p.Name, value = p.Id })
            };
        }
    }
}
