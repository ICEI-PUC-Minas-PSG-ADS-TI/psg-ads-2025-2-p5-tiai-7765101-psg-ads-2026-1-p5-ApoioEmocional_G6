using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class BreathingLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

    }
}