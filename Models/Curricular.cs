using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Curricular
    {
        public int IdCurricularItem { get; set; }
        public int DayId { get; set; }
        public int ClassId { get; set; }
        public int TeacherId { get; set; }
        public int SubjectId { get; set; }
        public int LessonOrder { get; set; }

        public virtual Classes Class { get; set; }
        public virtual DayOfTheWeek Day { get; set; }
        public virtual Subject Subject { get; set; }
        public virtual Teacher Teacher { get; set; }
    }
}
