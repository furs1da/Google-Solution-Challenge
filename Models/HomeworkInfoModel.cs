using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace shagDiplom.Models
{
    public class HomeworkInfoModel
    {
        public int IdHomework { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public string teacherName { get; set; }
        public string attechement { get; set; }
        public string Title { get; set; }

        public string doneFlag { get; set; }

        public HomeworkInfoModel(int IdHomework, string Description, DateTime DueDate, string teacherName, string attechement, string Title, string doneFlag)
        {
            this.IdHomework = IdHomework;
            this.Description = Description;
            this.DueDate = DueDate;
            this.teacherName = teacherName;
            this.attechement = attechement;
            this.Title = Title;
            this.doneFlag = doneFlag;
        }
    }
}
