using System.Collections.Generic;

namespace backend.DTOs
{
    public sealed class InsightsResponse
    {
        public List<string> Insights { get; set; } = new();
    }
}
