using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace shagDiplom.Models
{
    public partial class schoolManagementSystemDatabaseContext : DbContext
    {
        public schoolManagementSystemDatabaseContext()
        {
        }

        public schoolManagementSystemDatabaseContext(DbContextOptions<schoolManagementSystemDatabaseContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Admin> Admin { get; set; }
        public virtual DbSet<AnnouncementSender> AnnouncementSender { get; set; }
        public virtual DbSet<Attendance> Attendance { get; set; }
        public virtual DbSet<ClassLetters> ClassLetters { get; set; }
        public virtual DbSet<ClassStudent> ClassStudent { get; set; }
        public virtual DbSet<Classes> Classes { get; set; }
        public virtual DbSet<Curricular> Curricular { get; set; }
        public virtual DbSet<DayOfTheWeek> DayOfTheWeek { get; set; }
        public virtual DbSet<FeedbackSender> FeedbackSender { get; set; }
        public virtual DbSet<FinalGrade> FinalGrade { get; set; }
        public virtual DbSet<FlowNumber> FlowNumber { get; set; }
        public virtual DbSet<GenderTypes> GenderTypes { get; set; }
        public virtual DbSet<Grade> Grade { get; set; }
        public virtual DbSet<GradeThematical> GradeThematical { get; set; }
        public virtual DbSet<HomeworkInfo> HomeworkInfo { get; set; }
        public virtual DbSet<HomeworkSubmission> HomeworkSubmission { get; set; }
        public virtual DbSet<Parent> Parent { get; set; }
        public virtual DbSet<ParentStudent> ParentStudent { get; set; }
        public virtual DbSet<Pupil> Pupil { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<Subject> Subject { get; set; }
        public virtual DbSet<SubjectTeacher> SubjectTeacher { get; set; }
        public virtual DbSet<Teacher> Teacher { get; set; }
        public virtual DbSet<TeacherPost> TeacherPost { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=DESKTOP-FCCHT4D;Database=schoolManagementSystemDatabase;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.IdAdmin);

                entity.ToTable("admin");

                entity.Property(e => e.IdAdmin)
                    .HasColumnName("idAdmin")
                    .ValueGeneratedNever();

                entity.Property(e => e.DateOfBirth)
                    .HasColumnName("dateOfBirth")
                    .HasColumnType("date");

                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .HasMaxLength(700);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(40);

                entity.Property(e => e.Gender).HasColumnName("gender");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(20);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(50);

                entity.Property(e => e.Patronymic)
                    .IsRequired()
                    .HasColumnName("patronymic")
                    .HasMaxLength(20);

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasColumnName("phone")
                    .HasMaxLength(15);

                entity.Property(e => e.RoleId).HasColumnName("roleId");

                entity.Property(e => e.Surname)
                    .IsRequired()
                    .HasColumnName("surname")
                    .HasMaxLength(20);

                entity.Property(e => e.Token)
                    .HasColumnName("token")
                    .HasMaxLength(50);

                entity.HasOne(d => d.GenderNavigation)
                    .WithMany(p => p.Admin)
                    .HasForeignKey(d => d.Gender)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_admin_genderTypes");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Admin)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_admin_roles");
            });

            modelBuilder.Entity<AnnouncementSender>(entity =>
            {
                entity.HasKey(e => e.IdAnnouncement)
                    .HasName("PK_announcement");

                entity.ToTable("announcementSender");

                entity.Property(e => e.IdAnnouncement)
                    .HasColumnName("idAnnouncement")
                    .ValueGeneratedNever();

                entity.Property(e => e.Actual).HasColumnName("actual");

                entity.Property(e => e.AnnouncementContent)
                    .IsRequired()
                    .HasColumnName("announcementContent");

                entity.Property(e => e.Attachements).HasColumnName("attachements");

                entity.Property(e => e.AttchFormatExst)
                    .HasMaxLength(100)
                    .IsFixedLength();

                entity.Property(e => e.DateOfAnnouncement)
                    .HasColumnName("dateOfAnnouncement")
                    .HasColumnType("date");

                entity.Property(e => e.Filename)
                    .HasColumnName("filename")
                    .HasMaxLength(300)
                    .IsFixedLength();

                entity.Property(e => e.IdAdminSender).HasColumnName("idAdminSender");

                entity.Property(e => e.IdClass).HasColumnName("idClass");

                entity.Property(e => e.IdFlow).HasColumnName("idFlow");

                entity.Property(e => e.IdRole).HasColumnName("idRole");

                entity.Property(e => e.IdSubject).HasColumnName("idSubject");

                entity.Property(e => e.TitleAnnouncement)
                    .IsRequired()
                    .HasColumnName("titleAnnouncement")
                    .HasMaxLength(1000);

                entity.HasOne(d => d.IdAdminSenderNavigation)
                    .WithMany(p => p.AnnouncementSender)
                    .HasForeignKey(d => d.IdAdminSender)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_announcementSender_admin");

                entity.HasOne(d => d.IdClassNavigation)
                    .WithMany(p => p.AnnouncementSender)
                    .HasForeignKey(d => d.IdClass)
                    .HasConstraintName("FK_announcementSender_classes");

                entity.HasOne(d => d.IdFlowNavigation)
                    .WithMany(p => p.AnnouncementSender)
                    .HasForeignKey(d => d.IdFlow)
                    .HasConstraintName("FK_announcementSender_flowNumber");

                entity.HasOne(d => d.IdRoleNavigation)
                    .WithMany(p => p.AnnouncementSender)
                    .HasForeignKey(d => d.IdRole)
                    .HasConstraintName("FK_announcementSender_roles");

                entity.HasOne(d => d.IdSubjectNavigation)
                    .WithMany(p => p.AnnouncementSender)
                    .HasForeignKey(d => d.IdSubject)
                    .HasConstraintName("FK_announcementSender_subject");
            });

            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.HasKey(e => e.IdAttendance);

                entity.ToTable("attendance");

                entity.Property(e => e.IdAttendance)
                    .HasColumnName("idAttendance")
                    .ValueGeneratedNever();

                entity.Property(e => e.DateOfLesson)
                    .HasColumnName("dateOfLesson")
                    .HasColumnType("date");

                entity.Property(e => e.IdStudent).HasColumnName("idStudent");

                entity.Property(e => e.IdSubject).HasColumnName("idSubject");

                entity.HasOne(d => d.IdStudentNavigation)
                    .WithMany(p => p.Attendance)
                    .HasForeignKey(d => d.IdStudent)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_attendance_pupil");

                entity.HasOne(d => d.IdSubjectNavigation)
                    .WithMany(p => p.Attendance)
                    .HasForeignKey(d => d.IdSubject)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_attendance_subjects");
            });

            modelBuilder.Entity<ClassLetters>(entity =>
            {
                entity.HasKey(e => e.IdLetter);

                entity.ToTable("classLetters");

                entity.Property(e => e.IdLetter)
                    .HasColumnName("idLetter")
                    .ValueGeneratedNever();

                entity.Property(e => e.ClassLetter)
                    .IsRequired()
                    .HasColumnName("classLetter")
                    .HasMaxLength(2);
            });

            modelBuilder.Entity<ClassStudent>(entity =>
            {
                entity.ToTable("Class_Student");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.IdClass).HasColumnName("idClass");

                entity.Property(e => e.IdStudent).HasColumnName("idStudent");

                entity.HasOne(d => d.IdClassNavigation)
                    .WithMany(p => p.ClassStudent)
                    .HasForeignKey(d => d.IdClass)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Class_Student_classes");

                entity.HasOne(d => d.IdStudentNavigation)
                    .WithMany(p => p.ClassStudent)
                    .HasForeignKey(d => d.IdStudent)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Class_Student_pupil");
            });

            modelBuilder.Entity<Classes>(entity =>
            {
                entity.HasKey(e => e.IdClass);

                entity.ToTable("classes");

                entity.Property(e => e.IdClass)
                    .HasColumnName("idClass")
                    .ValueGeneratedNever();

                entity.Property(e => e.AccessCode)
                    .IsRequired()
                    .HasColumnName("accessCode")
                    .HasMaxLength(10);

                entity.Property(e => e.ClassLetter).HasColumnName("classLetter");

                entity.Property(e => e.FlowNumber).HasColumnName("flowNumber");

                entity.Property(e => e.IdClassroomTeacher).HasColumnName("idClassroomTeacher");

                entity.HasOne(d => d.ClassLetterNavigation)
                    .WithMany(p => p.Classes)
                    .HasForeignKey(d => d.ClassLetter)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_classes_classLetters");

                entity.HasOne(d => d.FlowNumberNavigation)
                    .WithMany(p => p.Classes)
                    .HasForeignKey(d => d.FlowNumber)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_classes_flowNumber");

                entity.HasOne(d => d.IdClassroomTeacherNavigation)
                    .WithMany(p => p.Classes)
                    .HasForeignKey(d => d.IdClassroomTeacher)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_classes_teacher");
            });

            modelBuilder.Entity<Curricular>(entity =>
            {
                entity.HasKey(e => e.IdCurricularItem);

                entity.ToTable("curricular");

                entity.Property(e => e.IdCurricularItem)
                    .HasColumnName("idCurricularItem")
                    .ValueGeneratedNever();

                entity.Property(e => e.ClassId).HasColumnName("classId");

                entity.Property(e => e.DayId).HasColumnName("dayId");

                entity.Property(e => e.LessonOrder).HasColumnName("lessonOrder");

                entity.Property(e => e.SubjectId).HasColumnName("subjectId");

                entity.Property(e => e.TeacherId).HasColumnName("teacherId");

                entity.HasOne(d => d.Class)
                    .WithMany(p => p.Curricular)
                    .HasForeignKey(d => d.ClassId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_curricular_classes");

                entity.HasOne(d => d.Day)
                    .WithMany(p => p.Curricular)
                    .HasForeignKey(d => d.DayId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_curricular_dayOfTheWeek");

                entity.HasOne(d => d.Subject)
                    .WithMany(p => p.Curricular)
                    .HasForeignKey(d => d.SubjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_curricular_subjects");

                entity.HasOne(d => d.Teacher)
                    .WithMany(p => p.Curricular)
                    .HasForeignKey(d => d.TeacherId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_curricular_teacher");
            });

            modelBuilder.Entity<DayOfTheWeek>(entity =>
            {
                entity.HasKey(e => e.IdDay);

                entity.ToTable("dayOfTheWeek");

                entity.Property(e => e.IdDay)
                    .HasColumnName("idDay")
                    .ValueGeneratedNever();

                entity.Property(e => e.DayName)
                    .IsRequired()
                    .HasColumnName("dayName")
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<FeedbackSender>(entity =>
            {
                entity.HasKey(e => e.IdFeedback)
                    .HasName("PK_feedbackAdminastration");

                entity.ToTable("feedbackSender");

                entity.Property(e => e.IdFeedback)
                    .HasColumnName("idFeedback")
                    .ValueGeneratedNever();

                entity.Property(e => e.Attachements).HasColumnName("attachements");

                entity.Property(e => e.AttchFormatExst)
                    .HasColumnName("attchFormatExst")
                    .HasMaxLength(100);

                entity.Property(e => e.DateOfFeedBack)
                    .HasColumnName("dateOfFeedBack")
                    .HasColumnType("date");

                entity.Property(e => e.FeedbackContent)
                    .IsRequired()
                    .HasColumnName("feedbackContent");

                entity.Property(e => e.Filename)
                    .HasColumnName("filename")
                    .HasMaxLength(300);

                entity.Property(e => e.ReceiverIdAdmin).HasColumnName("receiverIdAdmin");

                entity.Property(e => e.ReceiverIdParent).HasColumnName("receiverIdParent");

                entity.Property(e => e.ReceiverIdStudent).HasColumnName("receiverIdStudent");

                entity.Property(e => e.ReceiverIdTeacher).HasColumnName("receiverIdTeacher");

                entity.Property(e => e.SenderIdAdmin).HasColumnName("senderIdAdmin");

                entity.Property(e => e.SenderIdParent).HasColumnName("senderIdParent");

                entity.Property(e => e.SenderIdStudent).HasColumnName("senderIdStudent");

                entity.Property(e => e.SenderIdTeacher).HasColumnName("senderIdTeacher");

                entity.Property(e => e.TitleFeedBack)
                    .IsRequired()
                    .HasColumnName("titleFeedBack")
                    .HasMaxLength(1000);

                entity.HasOne(d => d.ReceiverIdAdminNavigation)
                    .WithMany(p => p.FeedbackSenderReceiverIdAdminNavigation)
                    .HasForeignKey(d => d.ReceiverIdAdmin)
                    .HasConstraintName("FK_feedbackSender_admin1");

                entity.HasOne(d => d.ReceiverIdParentNavigation)
                    .WithMany(p => p.FeedbackSenderReceiverIdParentNavigation)
                    .HasForeignKey(d => d.ReceiverIdParent)
                    .HasConstraintName("FK_feedbackSender_parent1");

                entity.HasOne(d => d.ReceiverIdStudentNavigation)
                    .WithMany(p => p.FeedbackSenderReceiverIdStudentNavigation)
                    .HasForeignKey(d => d.ReceiverIdStudent)
                    .HasConstraintName("FK_feedbackSender_pupil1");

                entity.HasOne(d => d.ReceiverIdTeacherNavigation)
                    .WithMany(p => p.FeedbackSenderReceiverIdTeacherNavigation)
                    .HasForeignKey(d => d.ReceiverIdTeacher)
                    .HasConstraintName("FK_feedbackSender_teacher1");

                entity.HasOne(d => d.SenderIdAdminNavigation)
                    .WithMany(p => p.FeedbackSenderSenderIdAdminNavigation)
                    .HasForeignKey(d => d.SenderIdAdmin)
                    .HasConstraintName("FK_feedbackSender_admin");

                entity.HasOne(d => d.SenderIdParentNavigation)
                    .WithMany(p => p.FeedbackSenderSenderIdParentNavigation)
                    .HasForeignKey(d => d.SenderIdParent)
                    .HasConstraintName("FK_feedbackSender_parent");

                entity.HasOne(d => d.SenderIdStudentNavigation)
                    .WithMany(p => p.FeedbackSenderSenderIdStudentNavigation)
                    .HasForeignKey(d => d.SenderIdStudent)
                    .HasConstraintName("FK_feedbackSender_pupil");

                entity.HasOne(d => d.SenderIdTeacherNavigation)
                    .WithMany(p => p.FeedbackSenderSenderIdTeacherNavigation)
                    .HasForeignKey(d => d.SenderIdTeacher)
                    .HasConstraintName("FK_feedbackSender_teacher");
            });

            modelBuilder.Entity<FinalGrade>(entity =>
            {
                entity.HasKey(e => e.IdFinalGrade)
                    .HasName("PK_FinalGRade");

                entity.ToTable("finalGrade");

                entity.Property(e => e.IdFinalGrade)
                    .HasColumnName("idFinalGrade")
                    .ValueGeneratedNever();

                entity.Property(e => e.Grade).HasColumnName("grade");

                entity.Property(e => e.IdStudent).HasColumnName("idStudent");

                entity.Property(e => e.IdSubject).HasColumnName("idSubject");

                entity.HasOne(d => d.IdStudentNavigation)
                    .WithMany(p => p.FinalGrade)
                    .HasForeignKey(d => d.IdStudent)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_finalGrade_pupil");

                entity.HasOne(d => d.IdSubjectNavigation)
                    .WithMany(p => p.FinalGrade)
                    .HasForeignKey(d => d.IdSubject)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_finalGrade_subjects");
            });

            modelBuilder.Entity<FlowNumber>(entity =>
            {
                entity.HasKey(e => e.IdFlow);

                entity.ToTable("flowNumber");

                entity.Property(e => e.IdFlow)
                    .HasColumnName("idFlow")
                    .ValueGeneratedNever();

                entity.Property(e => e.FlowNumber1).HasColumnName("flowNumber");
            });

            modelBuilder.Entity<GenderTypes>(entity =>
            {
                entity.HasKey(e => e.IdGender);

                entity.ToTable("genderTypes");

                entity.Property(e => e.IdGender)
                    .HasColumnName("idGender")
                    .ValueGeneratedNever();

                entity.Property(e => e.GenderType)
                    .IsRequired()
                    .HasColumnName("genderType")
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<Grade>(entity =>
            {
                entity.HasKey(e => e.IdGrade);

                entity.ToTable("grade");

                entity.Property(e => e.IdGrade)
                    .HasColumnName("idGrade")
                    .ValueGeneratedNever();

                entity.Property(e => e.ClassGrade).HasColumnName("classGrade");

                entity.Property(e => e.DateOfGrade)
                    .HasColumnName("dateOfGrade")
                    .HasColumnType("date");

                entity.Property(e => e.Feedback)
                    .IsRequired()
                    .HasColumnName("feedback");

                entity.Property(e => e.Grade1).HasColumnName("grade");

                entity.Property(e => e.HomeworkGrade).HasColumnName("homeworkGrade");

                entity.Property(e => e.HomeworkId).HasColumnName("homeworkId");

                entity.Property(e => e.StudentId).HasColumnName("studentId");

                entity.Property(e => e.SubjectId).HasColumnName("subjectId");

                entity.Property(e => e.TeacherId).HasColumnName("teacherId");

                entity.HasOne(d => d.Homework)
                    .WithMany(p => p.Grade)
                    .HasForeignKey(d => d.HomeworkId)
                    .HasConstraintName("FK_grade_homeworkInfo");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.Grade)
                    .HasForeignKey(d => d.StudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_grade_pupil");

                entity.HasOne(d => d.Subject)
                    .WithMany(p => p.Grade)
                    .HasForeignKey(d => d.SubjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_grade_subjects");

                entity.HasOne(d => d.Teacher)
                    .WithMany(p => p.Grade)
                    .HasForeignKey(d => d.TeacherId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_grade_teacher");
            });

            modelBuilder.Entity<GradeThematical>(entity =>
            {
                entity.HasKey(e => e.IdThematic)
                    .HasName("PK_GradeThematical");

                entity.ToTable("gradeThematical");

                entity.Property(e => e.IdThematic)
                    .HasColumnName("idThematic")
                    .ValueGeneratedNever();

                entity.Property(e => e.DateFrom).HasColumnType("date");

                entity.Property(e => e.DateTo).HasColumnType("date");

                entity.Property(e => e.Grade).HasColumnName("grade");

                entity.Property(e => e.IdStudent).HasColumnName("idStudent");

                entity.Property(e => e.IdSubject).HasColumnName("idSubject");

                entity.HasOne(d => d.IdStudentNavigation)
                    .WithMany(p => p.GradeThematical)
                    .HasForeignKey(d => d.IdStudent)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_gradeThematical_pupil");

                entity.HasOne(d => d.IdSubjectNavigation)
                    .WithMany(p => p.GradeThematical)
                    .HasForeignKey(d => d.IdSubject)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_gradeThematical_subjects");
            });

            modelBuilder.Entity<HomeworkInfo>(entity =>
            {
                entity.HasKey(e => e.IdHomework);

                entity.ToTable("homeworkInfo");

                entity.Property(e => e.IdHomework)
                    .HasColumnName("idHomework")
                    .ValueGeneratedNever();

                entity.Property(e => e.Attachements).HasColumnName("attachements");

                entity.Property(e => e.AttchFormatExst)
                    .HasColumnName("attchFormatExst")
                    .HasMaxLength(400);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("description");

                entity.Property(e => e.DueDate)
                    .HasColumnName("dueDate")
                    .HasColumnType("date");

                entity.Property(e => e.Filename)
                    .HasColumnName("filename")
                    .HasMaxLength(300);

                entity.Property(e => e.IdFlow).HasColumnName("idFlow");

                entity.Property(e => e.IdSubject).HasColumnName("idSubject");

                entity.Property(e => e.IdTeacher).HasColumnName("idTeacher");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnName("title")
                    .HasMaxLength(1000);

                entity.HasOne(d => d.IdFlowNavigation)
                    .WithMany(p => p.HomeworkInfo)
                    .HasForeignKey(d => d.IdFlow)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_homeworkInfo_flowNumber");

                entity.HasOne(d => d.IdSubjectNavigation)
                    .WithMany(p => p.HomeworkInfo)
                    .HasForeignKey(d => d.IdSubject)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_homeworkInfo_subjects");

                entity.HasOne(d => d.IdTeacherNavigation)
                    .WithMany(p => p.HomeworkInfo)
                    .HasForeignKey(d => d.IdTeacher)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_homeworkInfo_teacher");
            });

            modelBuilder.Entity<HomeworkSubmission>(entity =>
            {
                entity.HasKey(e => e.IdSubmission);

                entity.ToTable("homeworkSubmission");

                entity.Property(e => e.IdSubmission)
                    .HasColumnName("idSubmission")
                    .ValueGeneratedNever();

                entity.Property(e => e.Comments).HasColumnName("comments");

                entity.Property(e => e.DateOfSubmission)
                    .HasColumnName("dateOfSubmission")
                    .HasColumnType("date");

                entity.Property(e => e.FileFormatAttr)
                    .IsRequired()
                    .HasMaxLength(400);

                entity.Property(e => e.Filename)
                    .HasColumnName("filename")
                    .HasMaxLength(300)
                    .IsFixedLength();

                entity.Property(e => e.HomeworkFile)
                    .IsRequired()
                    .HasColumnName("homeworkFile");

                entity.Property(e => e.HomeworkId).HasColumnName("homeworkId");

                entity.Property(e => e.IdTeacher).HasColumnName("idTeacher");

                entity.Property(e => e.StudentId).HasColumnName("studentId");

                entity.HasOne(d => d.Homework)
                    .WithMany(p => p.HomeworkSubmission)
                    .HasForeignKey(d => d.HomeworkId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_homeworkSubmission_homeworkInfo");

                entity.HasOne(d => d.IdTeacherNavigation)
                    .WithMany(p => p.HomeworkSubmission)
                    .HasForeignKey(d => d.IdTeacher)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_homeworkSubmission_teacher");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.HomeworkSubmission)
                    .HasForeignKey(d => d.StudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_homeworkSubmission_pupil");
            });

            modelBuilder.Entity<Parent>(entity =>
            {
                entity.HasKey(e => e.IdParent);

                entity.ToTable("parent");

                entity.Property(e => e.IdParent)
                    .HasColumnName("idParent")
                    .ValueGeneratedNever();

                entity.Property(e => e.Adress)
                    .IsRequired()
                    .HasColumnName("adress")
                    .HasMaxLength(40);

                entity.Property(e => e.DateOfBirth)
                    .HasColumnName("dateOfBirth")
                    .HasColumnType("date");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(40);

                entity.Property(e => e.Gender).HasColumnName("gender");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(20);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(50);

                entity.Property(e => e.Patronymic)
                    .IsRequired()
                    .HasColumnName("patronymic")
                    .HasMaxLength(20);

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasColumnName("phone")
                    .HasMaxLength(15);

                entity.Property(e => e.RoleId).HasColumnName("roleId");

                entity.Property(e => e.Surname)
                    .IsRequired()
                    .HasColumnName("surname")
                    .HasMaxLength(20);

                entity.Property(e => e.Token)
                    .HasColumnName("token")
                    .HasMaxLength(50);

                entity.Property(e => e.WorkPlace)
                    .IsRequired()
                    .HasColumnName("workPlace")
                    .HasMaxLength(80);

                entity.HasOne(d => d.GenderNavigation)
                    .WithMany(p => p.Parent)
                    .HasForeignKey(d => d.Gender)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_parent_genderTypes");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Parent)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_parent_roles");
            });

            modelBuilder.Entity<ParentStudent>(entity =>
            {
                entity.ToTable("parent_student");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.IdParent).HasColumnName("idParent");

                entity.Property(e => e.IdStudent).HasColumnName("idStudent");

                entity.HasOne(d => d.IdParentNavigation)
                    .WithMany(p => p.ParentStudent)
                    .HasForeignKey(d => d.IdParent)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_parent_student_parent");

                entity.HasOne(d => d.IdStudentNavigation)
                    .WithMany(p => p.ParentStudent)
                    .HasForeignKey(d => d.IdStudent)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_parent_student_pupil");
            });

            modelBuilder.Entity<Pupil>(entity =>
            {
                entity.HasKey(e => e.IdPupil);

                entity.ToTable("pupil");

                entity.Property(e => e.IdPupil)
                    .HasColumnName("idPupil")
                    .ValueGeneratedNever();

                entity.Property(e => e.Adress)
                    .IsRequired()
                    .HasColumnName("adress")
                    .HasMaxLength(40);

                entity.Property(e => e.DateOfBirth)
                    .HasColumnName("dateOfBirth")
                    .HasColumnType("date");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(40);

                entity.Property(e => e.Gender).HasColumnName("gender");

                entity.Property(e => e.ImageOfPupil).HasColumnName("imageOfPupil");

                entity.Property(e => e.Moto)
                    .HasColumnName("moto")
                    .HasMaxLength(200);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(20);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(50);

                entity.Property(e => e.Patronymic)
                    .IsRequired()
                    .HasColumnName("patronymic")
                    .HasMaxLength(20);

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasColumnName("phone")
                    .HasMaxLength(15);

                entity.Property(e => e.RoleId).HasColumnName("roleId");

                entity.Property(e => e.Surname)
                    .IsRequired()
                    .HasColumnName("surname")
                    .HasMaxLength(20);

                entity.Property(e => e.Token)
                    .HasColumnName("token")
                    .HasMaxLength(50);

                entity.HasOne(d => d.GenderNavigation)
                    .WithMany(p => p.Pupil)
                    .HasForeignKey(d => d.Gender)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_pupil_genderTypes");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Pupil)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_pupil_roles");
            });

            modelBuilder.Entity<Roles>(entity =>
            {
                entity.HasKey(e => e.IdRole);

                entity.ToTable("roles");

                entity.Property(e => e.IdRole)
                    .HasColumnName("idRole")
                    .ValueGeneratedNever();

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasColumnName("role")
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<Subject>(entity =>
            {
                entity.HasKey(e => e.IdSubject)
                    .HasName("PK_subjects");

                entity.ToTable("subject");

                entity.Property(e => e.IdSubject)
                    .HasColumnName("idSubject")
                    .ValueGeneratedNever();

                entity.Property(e => e.SubjectName)
                    .IsRequired()
                    .HasColumnName("subjectName")
                    .HasMaxLength(30);
            });

            modelBuilder.Entity<SubjectTeacher>(entity =>
            {
                entity.ToTable("subject_teacher");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.SubjectId).HasColumnName("subjectId");

                entity.Property(e => e.TeacherId).HasColumnName("teacherId");

                entity.HasOne(d => d.Subject)
                    .WithMany(p => p.SubjectTeacher)
                    .HasForeignKey(d => d.SubjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_subject_teacher_subject");

                entity.HasOne(d => d.Teacher)
                    .WithMany(p => p.SubjectTeacher)
                    .HasForeignKey(d => d.TeacherId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_subject_teacher_teacher");
            });

            modelBuilder.Entity<Teacher>(entity =>
            {
                entity.HasKey(e => e.IdTeacher);

                entity.ToTable("teacher");

                entity.Property(e => e.IdTeacher)
                    .HasColumnName("idTeacher")
                    .ValueGeneratedNever();

                entity.Property(e => e.Adress)
                    .IsRequired()
                    .HasColumnName("adress")
                    .HasMaxLength(40);

                entity.Property(e => e.DateOfBirth)
                    .HasColumnName("dateOfBirth")
                    .HasColumnType("date");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(40);

                entity.Property(e => e.Gender).HasColumnName("gender");

                entity.Property(e => e.ImageOfTeacher).HasColumnName("imageOfTeacher");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(20);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(50);

                entity.Property(e => e.Patronymic)
                    .IsRequired()
                    .HasColumnName("patronymic")
                    .HasMaxLength(20);

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasColumnName("phone")
                    .HasMaxLength(15);

                entity.Property(e => e.RoleId).HasColumnName("roleId");

                entity.Property(e => e.Surname)
                    .IsRequired()
                    .HasColumnName("surname")
                    .HasMaxLength(20);

                entity.Property(e => e.Token)
                    .HasColumnName("token")
                    .HasMaxLength(50);

                entity.HasOne(d => d.GenderNavigation)
                    .WithMany(p => p.Teacher)
                    .HasForeignKey(d => d.Gender)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_teacher_genderTypes");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Teacher)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_teacher_roles");
            });

            modelBuilder.Entity<TeacherPost>(entity =>
            {
                entity.HasKey(e => e.IdPost);

                entity.ToTable("teacherPost");

                entity.Property(e => e.IdPost)
                    .HasColumnName("idPost")
                    .ValueGeneratedNever();

                entity.Property(e => e.Attachements).HasColumnName("attachements");

                entity.Property(e => e.AttchFormatExst)
                    .HasMaxLength(100)
                    .IsFixedLength();

                entity.Property(e => e.DateOfPost)
                    .HasColumnName("dateOfPost")
                    .HasColumnType("date");

                entity.Property(e => e.Filename)
                    .HasColumnName("filename")
                    .HasMaxLength(300)
                    .IsFixedLength();

                entity.Property(e => e.IdFlow).HasColumnName("idFlow");

                entity.Property(e => e.IdSubject).HasColumnName("idSubject");

                entity.Property(e => e.IdTeacher).HasColumnName("idTeacher");

                entity.Property(e => e.PostContent)
                    .IsRequired()
                    .HasColumnName("postContent");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnName("title")
                    .HasMaxLength(1000);

                entity.HasOne(d => d.IdFlowNavigation)
                    .WithMany(p => p.TeacherPost)
                    .HasForeignKey(d => d.IdFlow)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_teacherPost_flowNumber");

                entity.HasOne(d => d.IdSubjectNavigation)
                    .WithMany(p => p.TeacherPost)
                    .HasForeignKey(d => d.IdSubject)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_teacherPost_subject");

                entity.HasOne(d => d.IdTeacherNavigation)
                    .WithMany(p => p.TeacherPost)
                    .HasForeignKey(d => d.IdTeacher)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_teacherPost_teacher");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
