using IqraBase.Service;
using IqraHMS.OT.Data.Entities.SurgeryArea;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Service.SurgeryArea
{
    public class OperationPackageService : AppBaseService<OperationPackage>
    {
        private string Alias { get; set; } = "prtnpckg.";
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
                var query = db.GetWhereClause(page);
                return await db.GetPages(page, OperationPackageQuery.Get());
            }
        }
    }

    public class OperationPackageQuery
    {
        public static string Get()
        {
            return @"[prtnpckg].[Id]
                    ,[prtnpckg].[CreatedAt]
                    ,[prtnpckg].[CreatedBy]
                    ,[prtnpckg].[UpdatedAt]
                    ,[prtnpckg].[UpdatedBy]
                    ,[prtnpckg].[IsDeleted]
                    ,[prtnpckg].[Remarks]
                    ,[prtnpckg].[ChangeLog]
                    ,[prtnpckg].[ActivityId]
                    ,[prtnpckg].[BranchId]
                    ,[prtnpckg].[SurgonId]
                    ,[prtnpckg].[SurgeryId]
                    ,[prtnpckg].[Price]
                    ,[prtnpckg].[MinPrice]
                    ,[prtnpckg].[OriginalCost]
	                ,[srgry].Name [SurgeryName]
	                ,[dctr].Name [SurgonName]
	                ,[ctr].Name [Creator]
	                ,[pdtr].Name [Updator]
                    FROM [dbo].[OperationPackage] [prtnpckg]
                    LEFT JOIN [Surgery] [srgry] ON [srgry].Id = [prtnpckg].SurgeryId
                    LEFT JOIN [Surgon] [srgn] ON [srgn].Id = [prtnpckg].SurgonId
                    LEFT JOIN [Doctor] [dctr] ON [dctr].Id = [srgn].DoctorId
                    LEFT JOIN [User] [ctr] ON [ctr].Id = [prtnpckg].CreatedBy
                    LEFT JOIN [User] [pdtr] ON [pdtr].Id = [prtnpckg].UpdatedBy";
        }
    }
}
