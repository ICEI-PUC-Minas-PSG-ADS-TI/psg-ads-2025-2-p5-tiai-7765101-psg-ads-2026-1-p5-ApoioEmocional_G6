using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    public class EmotionDailyGroupResponse
    {
        public DateTime Date { get; set; }
        public IEnumerable<EmotionResponse> Emotions { get; set; }
    }
}