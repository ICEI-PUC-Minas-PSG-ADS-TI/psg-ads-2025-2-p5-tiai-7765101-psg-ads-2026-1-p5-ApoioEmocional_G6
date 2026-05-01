using backend.Enum;
using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    public class UserOnboardingResponseDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Goal { get; set; }
        public EmotionsEnum InitialStatus { get; set; }
        public UsageFrequencyEnum Usage { get; set; }
        public List<PreferenceEnum> Preferences { get; set; } = new();
        public string CurrentStatus { get; set; }
        public bool Completed { get; set; }
    }
}