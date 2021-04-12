using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Teacher
    {
        public Teacher()
        {
            Curricular = new HashSet<Curricular>();
            FeedbackSenderReceiverIdTeacherNavigation = new HashSet<FeedbackSender>();
            FeedbackSenderSenderIdTeacherNavigation = new HashSet<FeedbackSender>();
            Grade = new HashSet<Grade>();
            HomeworkInfo = new HashSet<HomeworkInfo>();
            HomeworkSubmission = new HashSet<HomeworkSubmission>();
            SubjectTeacher = new HashSet<SubjectTeacher>();
            TeacherPost = new HashSet<TeacherPost>();
        }

        public int IdTeacher { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }
        public string Surname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Adress { get; set; }
        public byte[] ImageOfTeacher { get; set; }
        public int RoleId { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }

        public virtual GenderTypes GenderNavigation { get; set; }
        public virtual Roles Role { get; set; }
        public virtual ICollection<Curricular> Curricular { get; set; }
        public virtual ICollection<FeedbackSender> FeedbackSenderReceiverIdTeacherNavigation { get; set; }
        public virtual ICollection<FeedbackSender> FeedbackSenderSenderIdTeacherNavigation { get; set; }
        public virtual ICollection<Grade> Grade { get; set; }
        public virtual ICollection<HomeworkInfo> HomeworkInfo { get; set; }
        public virtual ICollection<HomeworkSubmission> HomeworkSubmission { get; set; }
        public virtual ICollection<SubjectTeacher> SubjectTeacher { get; set; }
        public virtual ICollection<TeacherPost> TeacherPost { get; set; }
    }
}
