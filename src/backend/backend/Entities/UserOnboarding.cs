using backend.Enum;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class UserOnboarding
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }
        public User User { get; set; }

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
