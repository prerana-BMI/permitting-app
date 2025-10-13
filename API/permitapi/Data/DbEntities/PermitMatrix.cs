using System;
using System.Collections.Generic;

namespace Data.DbEntities
{
    public partial class PermitMatrix
    {
        public int Id { get; set; }
        public string? TypeOfProject { get; set; }
        public string? MatrixName { get; set; }
        public string? ClientName { get; set; }
        public string? PermitList { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
