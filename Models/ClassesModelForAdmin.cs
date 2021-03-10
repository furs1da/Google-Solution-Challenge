using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class ClassesModelForAdmin
    {
        public int idClass { get; set; }
        public string name { get; set; }
        public string classroomTeacher { get; set; }
        public int amountOfStudents { get; set; }
        public string accessCode { get; set; }
      
        public ClassesModelForAdmin(int idClass, string name, string classroomTeacher, int amountOfStudents, string accessCode)
        {
            this.idClass = idClass;
            this.name = name;
            this.classroomTeacher = classroomTeacher;
            this.amountOfStudents = amountOfStudents;
            this.accessCode = accessCode;
        }
    }
}
