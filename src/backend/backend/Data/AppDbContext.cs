using backend.Entities;
using backend.Enum;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<EmotionLog> Emotions { get; set; }
        public DbSet<BreathingLog> BreathingLogs { get; set; }
        public DbSet<UserOnboarding> UserOnboardings { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmotionLog>()
                .Property(e => e.Emotion)
                .HasConversion<string>();
        }
    }
}