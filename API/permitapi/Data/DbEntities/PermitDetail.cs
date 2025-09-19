using System;
using System.Collections.Generic;

namespace Data.DbEntities;

public partial class PermitDetail
{
    public int Id { get; set; }

    public int? PermitId { get; set; }

    public string? Description { get; set; }

    public string? Threshold { get; set; }

    public int? PrepTimeMin { get; set; }

    public int? PrepTimeMax { get; set; }

    public int? AgencyReviewTimeMin { get; set; }

    public int? AgencyReviewTimeMax { get; set; }

    public decimal? BasicFees { get; set; }

    public string? AdditionalBasic { get; set; }
}
