namespace contract.Entities
{
    public partial class EPermitMatrix : EPaginationReq
    {
        public int Id { get; set; }
        public string? TypeOfProject { get; set; }
        public string? MatrixName { get; set; }
        public int? ClientId { get; set; }
        public string? ClientName { get; set; }
        public string? PermitList { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? PermitCount { get; set; }
    }
}
