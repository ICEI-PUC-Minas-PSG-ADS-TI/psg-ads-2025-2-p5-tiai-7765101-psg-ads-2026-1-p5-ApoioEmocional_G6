using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IInsightsService
    {
        Task<IEnumerable<string>> GetInsightsAsync(Guid userId);
    }
}
