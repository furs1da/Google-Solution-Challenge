using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Pupil
    {
        public Pupil()
        {
            Attendance = new HashSet<Attendance>();
            ClassStudent = new HashSet<ClassStudent>();
            FeedbackSenderReceiverIdStudentNavigation = new HashSet<FeedbackSender>();
            FeedbackSenderSenderIdStudentNavigation = new HashSet<FeedbackSender>();
            FinalGrade = new HashSet<FinalGrade>();
            Grade = new HashSet<Grade>();
            GradeThematical = new HashSet<GradeThematical>();
            HomeworkSubmission = new HashSet<HomeworkSubmission>();
            ParentStudent = new HashSet<ParentStudent>();
        }

        public int IdPupil { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }
        public string Surname { get; set; }
        public int Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Moto { get; set; }
        public byte[] ImageOfPupil { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Adress { get; set; }
        public int RoleId { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }

        public virtual GenderTypes GenderNavigation { get; set; }
        public virtual Roles Role { get; set; }
        public virtual ICollection<Attendance> Attendance { get; set; }
        public virtual ICollection<ClassStudent> ClassStudent { get; set; }
        public virtual ICollection<FeedbackSender> FeedbackSenderReceiverIdStudentNavigation { get; set; }
        public virtual ICollection<FeedbackSender> FeedbackSenderSenderIdStudentNavigation { get; set; }
        public virtual ICollection<FinalGrade> FinalGrade { get; set; }
        public virtual ICollection<Grade> Grade { get; set; }
        public virtual ICollection<GradeThematical> GradeThematical { get; set; }
        public virtual ICollection<HomeworkSubmission> HomeworkSubmission { get; set; }
        public virtual ICollection<ParentStudent> ParentStudent { get; set; }
    }
}
