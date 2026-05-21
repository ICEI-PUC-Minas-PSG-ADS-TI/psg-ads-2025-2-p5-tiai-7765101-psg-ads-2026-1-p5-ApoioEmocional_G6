using System.ComponentModel;

namespace backend.Enum
{
    public enum UsageFrequencyEnum
    {
        [Description("Todos os dias")]
        Daily,
        [Description("Algumas vezes por semana")]
        FewTimesWeek,
        [Description("Quando eu precisar")]
        WhenNeeded
    }
}
