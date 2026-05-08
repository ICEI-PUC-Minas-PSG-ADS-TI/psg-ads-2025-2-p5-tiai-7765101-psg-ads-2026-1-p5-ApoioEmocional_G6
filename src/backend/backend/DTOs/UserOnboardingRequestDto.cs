using backend.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UserOnboardingRequestDto
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public string Goal { get; set; }

        [Required]
        public EmotionsEnum InitialStatus { get; set; }

        [Required]
        public UsageFrequencyEnum Usage { get; set; }

        public List<PreferenceEnum> Preferences { get; set; } = new();

        public string CurrentStatus { get; set; }

        [Required]
        public bool Completed { get; set; }
    }
}