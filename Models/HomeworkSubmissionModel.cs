using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace shagDiplom.Models
{
    public class HomeworkSubmissionModel
    {
        public int IdSubmission { get; set; }
        public string comments { get; set; }
        public DateTime DateSubmission { get; set; }
        public string studentName { get; set; }
        public string attechement { get; set; }
        public string Title { get; set; }
        public string dueFlag { get; set; }

        public string backgroundColor { get; set; }
        

        public HomeworkSubmissionModel(int IdSubmission, string comments, DateTime DateSubmission, string studentName, string attechement, string Title, string dueFlag, string backgroundColor)
        {
            this.IdSubmission = IdSubmission;
            this.comments = comments;
            this.DateSubmission = DateSubmission;
            this.studentName = studentName;
            this.attechement = attechement;
            this.Title = Title;
            this.dueFlag = dueFlag;
            this.backgroundColor = backgroundColor;
        }
    }
}