using IqraHMS.OT.Data.Entities.AccountArea;
using IqraBase.Service;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IqraHMS.OT.Data.Entities.OTServiceArea;
using IqraBase.Data.Models;

namespace IqraHMS.OT.Service.OTServiceArea
{

    public class OTServiceService : DropDownBaseService<OTService>
    {
        private string Alias { get; set; } = "otsrvc.";
        public override string GetName(string name)
        {
            name = name ?? "[CreatedAt]";
            switch (name.ToLower())
            {
                case "creator":
                    name = "ctr.Name";
                    break;
                case "updator":
                    name = "pdtr.Name";
                    break;
                default:
                    name = Alias + name;
                    break;
            }
            return base.GetName(name);
        }
        public override async Task<ResponseList<Pagger<Dictionary<string, object>>>> Get(Page page)
        {
            using (DBService db = new DBService(this))
            {
                page.SortBy = page.SortBy ?? "[CreatedAt] desc";
                return await db.GetPages(page, OTServiceQuery.Get());
            }
        }
    }
    public class OTServiceQuery
    {
        public static string Get()
        {
            return @"[otsrvc].[Id]
                  ,[otsrvc].[Name]
                  ,[otsrvc].[CreatedAt]
                  ,[otsrvc].[CreatedBy]
                  ,[otsrvc].[UpdatedAt]
                  ,[otsrvc].[UpdatedBy]
                  ,[otsrvc].[IsDeleted]
                  ,[otsrvc].[Remarks]
                  ,[otsrvc].[ChangeLog]
                  ,[otsrvc].[ActivityId]
                  ,[otsrvc].[BranchId]
                  ,[otsrvc].[Price]
                  ,[otsrvc].[Unit]
	              ,[ctr].[Name] [Creator]
	              ,[pdtr].[Name] [Updator]
              FROM [dbo].[OTService] [otsrvc]
              LEFT JOIN [dbo].[User] [ctr] ON [ctr].[Id] = [otsrvc].[CreatedBy] 
              LEFT JOIN [dbo].[User] [pdtr] ON [pdtr].[Id] = [otsrvc].[UpdatedBy]";
        }
    }
}
