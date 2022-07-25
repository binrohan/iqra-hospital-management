using App.SetUp;
using IqraHMS.OT.Data.Entities.AccountArea;
using IqraHMS.OT.Data.Entities.OperationArea;
using IqraHMS.OT.Data.Entities.OTServiceArea;
using IqraHMS.OT.Data.Entities.SurgeryArea;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data
{

    public partial class AppDB : DbContext
    {
        public static string BackUpConnectionString = Connection.ConnectionString;
        public static string ConnectionString = Connection.ConnectionString;

        public AppDB() : base(ConnectionString)
        {
        }
        #region AccountArea
        public virtual DbSet<AccountReference> AccountReference { get; set; }
        #endregion AccountArea

        #region OTServiceArea
        public virtual DbSet<OTService> OTService { get; set; }
        public virtual DbSet<Surgery> Surgery { get; set; }
        public virtual DbSet<Operation> Operation { get; set; }
        public virtual DbSet<OperationStatusHistory> OperationStatusHistory { get; set; }
        public virtual DbSet<OperationPaymentHistory> OperationPaymentHistory { get; set; }
        public virtual DbSet<OperationSurgon> OperationSurgon { get; set; }
        public virtual DbSet<OperationOTService> OperationOTService { get; set; }
        public virtual DbSet<OperationHistory> OperationHistory { get; set; }
        public virtual DbSet<Surgon> Surgon { get; set; }
        public virtual DbSet<OperationPackage> OperationPackage { get; set; }
        public virtual DbSet<OperationPackageOTService> OperationPackageService { get; set; }
        #endregion OTServiceArea

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

        }
    }
}
