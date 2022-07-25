namespace App.Database
{
    using System;
    using System.Data.Entity;
    using System.Configuration;
    using IqraHMS.OT.Data.Entities.AccountArea;
    using IqraHMS.OT.Data.Entities.OTServiceArea;
    using IqraHMS.OT.Data.Entities.OperationArea;
    using IqraHMS.OT.Data.Entities.SurgeryArea;

    public partial class AppDB : DbContext
    {
        public static string BackUpConnectionString = @"data source=DESKTOP-2T4KNKA;initial catalog=IqraHMS;persist security info=True;user id=sa;password=123;MultipleActiveResultSets=True;App=EntityFramework";
        public static string ConnectionString = @"data source=DESKTOP-2T4KNKA;initial catalog=IqraHMS;persist security info=True;user id=sa;password=123;MultipleActiveResultSets=True;App=EntityFramework";

        //public static string ConnectionString = ConfigurationManager.ConnectionStrings["IqraHMSDB"].ConnectionString;
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
