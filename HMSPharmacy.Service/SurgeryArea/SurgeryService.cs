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

namespace IqraHMS.OT.Service.SurgeryArea
{

    public class SurgeryService : DropDownBaseService<Surgery>
    {
        private string Alias { get; set; } = "srgry.";
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
                return await db.GetPages(page, SurgeryQuery.Get());
            }
        }

        public override ResponseJson OnCreate(AppBaseModel model, Guid userId, bool isValid)
        {
            var surgeryModel = (SurgeryModel)model;

            var count = Get().Count();

            surgeryModel.Code = "SR-" + DateTime.Now.ToString("yyddMM") + count.ToString().PadLeft(5, '0');

            return base.OnCreate(model, userId, isValid);
        }
    }
    public class SurgeryQuery
    {
        public static string Get()
        {
            return @"[srgry].[Id]
                  ,[srgry].[Name]
                  ,[srgry].[Code]
                  ,[srgry].[CreatedAt]
                  ,[srgry].[CreatedBy]
                  ,[srgry].[UpdatedAt]
                  ,[srgry].[UpdatedBy]
                  ,[srgry].[IsDeleted]
                  ,[srgry].[Remarks]
                  ,[srgry].[ChangeLog]
                  ,[srgry].[ActivityId]
                  ,[srgry].[BranchId]
                  ,[srgry].[Price]
	              ,[ctr].[Name] [Creator]
	              ,[pdtr].[Name] [Updator]
              FROM [dbo].[Surgery] [srgry]
              LEFT JOIN [dbo].[User] [ctr] ON [ctr].[Id] = [srgry].[CreatedBy] 
              LEFT JOIN [dbo].[User] [pdtr] ON [pdtr].[Id] = [srgry].[UpdatedBy]";
        }
    }
}
