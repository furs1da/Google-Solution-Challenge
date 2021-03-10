using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Grade
    {
        public int IdGrade { get; set; }
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public int TeacherId { get; set; }
        public string Feedback { get; set; }
        public DateTime DateOfGrade { get; set; }
        public bool? ClassGrade { get; set; }
        public bool? HomeworkGrade { get; set; }
        public int Grade1 { get; set; }
        public int? HomeworkId { get; set; }

        public virtual HomeworkInfo Homework { get; set; }
        public virtual Pupil Student { get; set; }
        public virtual Subject Subject { get; set; }
        public virtual Teacher Teacher { get; set; }
    }
}
