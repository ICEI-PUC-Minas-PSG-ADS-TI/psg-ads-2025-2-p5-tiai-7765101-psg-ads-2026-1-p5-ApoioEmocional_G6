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
        public DbSet<UserOnboarding> UserOnboardings { get; set; }
        public DbSet<BreathingLog> BreathingLogs { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMessage> ConversationMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmotionLog>()
                .Property(e => e.Emotion)
                .HasConversion<string>();

            modelBuilder.Entity<Conversation>(b =>
            {
                b.HasKey(c => c.Id);
                b.Property(c => c.Date).IsRequired();
                b.HasIndex(c => new { c.UserId, c.Date }).IsUnique();
                b.HasMany(c => c.Messages).WithOne(m => m.Conversation).HasForeignKey(m => m.ConversationId);
            });

            modelBuilder.Entity<ConversationMessage>(b =>
            {
                b.HasKey(m => m.Id);
                b.Property(m => m.Role).IsRequired();
                b.Property(m => m.Content).IsRequired();
                b.Property(m => m.Timestamp).IsRequired();
            });
        }
    }
}