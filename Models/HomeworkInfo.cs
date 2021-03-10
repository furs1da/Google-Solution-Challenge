using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class HomeworkInfo
    {
        public HomeworkInfo()
        {
            Grade = new HashSet<Grade>();
            HomeworkSubmission = new HashSet<HomeworkSubmission>();
        }

        public int IdHomework { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int IdSubject { get; set; }
        public int IdFlow { get; set; }
        public int IdTeacher { get; set; }
        public string Title { get; set; }
        public byte[] Attachements { get; set; }
        public string AttchFormatExst { get; set; }
        public string Filename { get; set; }

        public virtual FlowNumber IdFlowNavigation { get; set; }
        public virtual Subject IdSubjectNavigation { get; set; }
        public virtual Teacher IdTeacherNavigation { get; set; }
        public virtual ICollection<Grade> Grade { get; set; }
        public virtual ICollection<HomeworkSubmission> HomeworkSubmission { get; set; }
    }
}
