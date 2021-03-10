import { authHeader, handleResponse } from '../helpers';


export const userService = {
    GetAllPupils,
    GetByIdPupil,
    GetAllAdmins, 
    GetByIdParent,
    GetAllClasses,
    GetAllSubjects,
    GetAllGenders,
    GetAllStudentsFromClass,
    CreateTeacher,
    CreateAdmin,
    CreatePupil,
    GetAllClassroomTeachers,
    GetAllClassLetters,
    GetAllFlows,
    CreateClass,
    GetClassRoomTeacherForClass,
    GetAllPupilsForClass,
    GetAllParentsForPupil,
    CreateLesson,
    GetFlowClassLetters,
    GetDayCurricular,
    GetSubjectTeachers,
    CreateAdminFeedBack,
    CreatePupilFeedBack,
    GetSubjectTeachersPupil,
    GetAllSubjectsPupil,
    GetClassRoomTeacherForClassPupil,
    CreateParentFeedBack,
    GetAllSubjectsParent,
    GetClassRoomTeacherForClassPupilParent,
    GetSubjectTeachersPupilParent,
    GetAllChildsParent,
    changeTeacher,
    ChangeAdmin,
    GetAllFlowsTeacher,
    GetFlowClassLettersTeacher,
    GetAllSubjectsTeacher,
    CreateTeacherFeedBack,
    CreateClassRoomTeacherFeedBack,
    GetStudentsClassroomTeacher,
    CheckTeacherForClassroomTeacher,
    CreateAdminAnnouncement,
    GetAllRoles,
    GetSubjectTeacherIdentity,
    GetAllFlowsBySubjectAndTeacher,
    CreateTeacherPost,
    ChangePupil,
    GetAllPupilsForClassAttendance,
    CreateAttendance,
    CreateThematical,
    GetAllSubjectForTeacher,
    AddChild,
    CreateHomeworkInfo,
    GetAllHomeworkBySubjectPupil,
    GetHomeworkFilePupil,
    SubmitHomeworkPupil,
    ChangeClass,
    GetHomeworkFileTeacher,
    GetAllInfoTeacher,
    GetAllInfoAdmin,
    GetAllInfoPupil,
    GetAllInfoClass,
    ChangeHomeworkInfo,
    GetAllClassroomTeachersAdmin,
    GetAllClassLettersBySubjectAndTeacherAndFlow,
    DeleteRecordChildParent,
    DeleteRecordLessonAdmin,
    GetAllStudentsFromClassRegisteredParent,
    GetAllHomeworkSubmissionBySubjectAndTeacherAndClass,

    GetAllHomeworkTitlesBySubjectAndTeacherAndClass,

    GetAllHomeworkSubmissionBySubjectAndTeacherAndClassAndStudentAndTitle,

    SubmitHomeworkGradeTeacher,

    GetAllAbsence,
    GetAllAbsenceSubject,

    GetAllTeachersAdmin,
    GetHomeworkFilePupilPost,
    GetAllPostsBySubjectPupil,

    GetAllAnnouncementTeacher,
    GetAllAnnouncementStudent,
    GetAllAnnouncementParent,
    GetAllAnnouncementAdmin,

    GetAllFeedbackTeacher,
    GetAllFeedbackStudent,
    GetAllFeedbackParent,
    GetAllFeedbackAdmin,

    GetFileTeacherAnnouncement,
    GetFileStudentAnnouncement,
    GetFileParentAnnouncement,
    GetFileAdminAnnouncement,
    GetAllInfoPersonalAdmin,
    GetAllInfoPersonalTeacher,
    GetAllInfoPersonalPupil,
    GetAllInfoPersonalParent,


    GetFileTeacherFeedback,
    GetFileStudentFeedback,
    GetFileAdminFeedback,
    GetFileParentFeedback,
    GetAllAttendanceParent,
    GetAllInfoHomeworkTeacher,
    GetAllInfoAnnouncementAdmin,
    GetAllPupilsForThematicalGrade,
    CreateFinal,
    GetAllPupilsForFinalGrade,
    GetAllAttendancePupil,
    GetAllGradesPupil,
    GetAllThemGradesPupil,
    GetAllFinalGradePupil,
    GetAllGradesPupilParent,
    GetAllThemGradesPupilParent,
    GetAllFinalGradePupilParent,

    DeleteRecordAnnouncementAdmin,
    DeleteRecordHomeworkTeacher,
    DeleteRecordTeacherAdmin,
    DeleteRecordParentAdmin,
    DeleteRecordAdminAdmin,
    DeleteRecordStudentAdmin,
    DeleteRecordPostTeacher,
    GetAllInfoPostTeacher,
    ChangePost,
    GetAllChildrenParent,
    GetClassCodeStudent,
    GetAllSubjectsAdmin,
    GetAllTeachersAdminList,
    GetAllStudentsAdmin,
    GetAllParentsAdmin,
    GetAllAdminsForAdmin,
    GetAllClassesByFlowAdmin,
    GetAllHomeworkInfoTeacher,
    GetAllPostsInfoTeacher,
    GetAllAnnouncementsForAdmin,
    ChangeAnnouncement,
    ChangePersonalAdmin,
    ChangePersonalPupil,
    ChangePersonalParent,
    ChangePersonalTeacher
};

function GetAllPupils() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/pupils`, requestOptions).then(handleResponse);
}

function GetByIdPupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/pupils`, requestOptions).then(handleResponse);
}

function GetAllAdmins() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/admins`, requestOptions).then(handleResponse);
}

function CheckTeacherForClassroomTeacher() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/CheckTeacherForClassroomTeacher`, requestOptions).then(handleResponse);
}

function GetAllSubjects() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/subjects`, requestOptions).then(handleResponse);
}
function GetAllSubjectsTeacher(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllSubjectsTeacher/` + id, requestOptions).then(handleResponse);
}


function DeleteRecordTeacherAdmin(id, adminCode) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordTeacherAdmin/` + id + '/' + adminCode, requestOptions).then(handleResponse);
}

function DeleteRecordParentAdmin(id) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordParentAdmin/` + id, requestOptions).then(handleResponse);
}

function DeleteRecordPostTeacher(id) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordPostTeacher/` + id, requestOptions).then(handleResponse);
}


function DeleteRecordChildParent(id) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordChildParent/` + id, requestOptions).then(handleResponse);
}

function DeleteRecordLessonAdmin(dayId, lessonId, flowId, classId) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordLessonAdmin/` + dayId + '/' + lessonId + '/' + flowId + '/' + classId, requestOptions).then(handleResponse);
}


function DeleteRecordHomeworkTeacher(id) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordHomeworkTeacher/` + id, requestOptions).then(handleResponse);
}


function DeleteRecordAnnouncementAdmin(id) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordAnnouncementAdmin/` + id, requestOptions).then(handleResponse);
}

function DeleteRecordAdminAdmin(id, adminCode) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordAdminAdmin/` + id + '/' + adminCode , requestOptions).then(handleResponse);
}

function DeleteRecordStudentAdmin(id, adminCode) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`weatherforecast/DeleteRecordPupilAdmin/` + id + '/' + adminCode, requestOptions).then(handleResponse);
}


function GetAllFlows() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/flows`, requestOptions).then(handleResponse);
}

function GetAllRoles() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/roles`, requestOptions).then(handleResponse);
}

function GetSubjectTeacherIdentity() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/subjectTeacherIdentity`, requestOptions).then(handleResponse);
}

function GetAllFlowsTeacher() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/flowsTeacher`, requestOptions).then(handleResponse);
}


function GetAllAnnouncementTeacher() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllAnnouncementTeacher`, requestOptions).then(handleResponse);
}

function GetAllChildrenParent() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllChildrenParent`, requestOptions).then(handleResponse);
}

function GetAllAnnouncementStudent() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllAnnouncementStudent`, requestOptions).then(handleResponse);
}

function GetAllAnnouncementParent() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllAnnouncementParent`, requestOptions).then(handleResponse);
}
function GetAllAnnouncementAdmin() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllAnnouncementAdmin`, requestOptions).then(handleResponse);
}
function GetAllFeedbackTeacher() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllFeedbackTeacher`, requestOptions).then(handleResponse);
}

function GetAllFeedbackStudent() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllFeedbackStudent`, requestOptions).then(handleResponse);
}

function GetAllFeedbackParent() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllFeedbackParent`, requestOptions).then(handleResponse);
}
function GetAllFeedbackAdmin() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllFeedbackAdmin`, requestOptions).then(handleResponse);
}


function GetAllSubjectsAdmin() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllSubjectsAdmin`, requestOptions).then(handleResponse);
}

function GetAllTeachersAdminList(idSubject) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllTeachersAdminList/` + idSubject, requestOptions).then(handleResponse);
}


function GetAllStudentsAdmin(idFlow, idClassLetter) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllStudentsAdmin/` + idFlow + '/' + idClassLetter, requestOptions).then(handleResponse);
}

function GetAllParentsAdmin(idChild) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllParentsAdmin/` + idChild, requestOptions).then(handleResponse);
}


function GetAllAdminsForAdmin() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllAdminsForAdmin`, requestOptions).then(handleResponse);
}

function GetAllClassesByFlowAdmin(flowId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllClassesByFlowAdmin/` + flowId, requestOptions).then(handleResponse);
}

function GetAllHomeworkInfoTeacher(subjectId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllHomeworkInfoTeacher/` + subjectId, requestOptions).then(handleResponse);
}

function GetAllInfoHomeworkTeacher(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoHomeworkTeacher/` + id, requestOptions).then(handleResponse);
}

function GetAllInfoAnnouncementAdmin(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoAnnouncementAdmin/` + id, requestOptions).then(handleResponse);
}

function GetAllInfoPostTeacher(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoPostTeacher/` + id, requestOptions).then(handleResponse);
}


function GetAllInfoPersonalAdmin() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoPersonalAdmin`, requestOptions).then(handleResponse);
}

function GetAllInfoPersonalTeacher() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoPersonalTeacher`, requestOptions).then(handleResponse);
}


function GetAllInfoPersonalPupil() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoPersonalPupil`, requestOptions).then(handleResponse);
}


function GetAllInfoPersonalParent() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoPersonalParent`, requestOptions).then(handleResponse);
}



function GetAllPostsInfoTeacher(subjectId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllPostsInfoTeacher/` + subjectId, requestOptions).then(handleResponse);
}

function GetAllAnnouncementsForAdmin() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllAnnouncementsForAdmin', requestOptions).then(handleResponse);
}










function GetAllTeachersAdmin() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllTeachersAdmin`, requestOptions).then(handleResponse);
}

function GetAllSubjectForTeacher() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllSubjectForTeacher`, requestOptions).then(handleResponse);
}
function GetAllFlowsBySubjectAndTeacher(subjectId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllFlowsBySubjectAndTeacher/` + subjectId, requestOptions).then(handleResponse);
}
function GetFlowClassLetters(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/classesByFlow/' + id, requestOptions).then(handleResponse);
}

function GetFlowClassLettersTeacher(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetFlowClassLettersTeacher/' + id, requestOptions).then(handleResponse);
}

function GetHomeworkFilePupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetHomeworkFilePupil/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}

function GetHomeworkFilePupilPost(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetHomeworkFilePupilPost/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}
function GetHomeworkFileTeacher(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetHomeworkFileTeacher/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}


function GetFileTeacherAnnouncement(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetFileTeacherAnnouncement/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}
function GetFileStudentAnnouncement(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetFileStudentAnnouncement/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}
function GetFileParentAnnouncement(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetFileParentAnnouncement/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}
function GetFileAdminAnnouncement(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetFileAdminAnnouncement/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}
function GetFileTeacherFeedback(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetFileTeacherFeedback/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}
function GetFileStudentFeedback(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetFileStudentFeedback/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}
function GetFileAdminFeedback(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetFileAdminFeedback/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}
function GetFileParentFeedback(id) {
    const requestOptions = { method: 'GET', headers: authHeader(), responseType: 'blob' };
    return fetch('weatherforecast/GetFileParentFeedback/' + id, requestOptions).then(handleResponse => handleResponse.blob());
}





function GetClassRoomTeacherForClass(idFlow, idLetter) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/classroomTeacherForClass/' + idFlow + '/' + idLetter, requestOptions).then(handleResponse);
}



function GetAllClassLettersBySubjectAndTeacherAndFlow(idFlow, idSubject) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllClassLettersBySubjectAndTeacherAndFlow/' + idFlow + '/' + idSubject, requestOptions).then(handleResponse);
}

function GetAllHomeworkTitlesBySubjectAndTeacherAndClass(idFlow, idSubject) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllHomeworkTitlesBySubjectAndTeacherAndClass/'+ idFlow + '/' + idSubject, requestOptions).then(handleResponse);
}

function GetAllHomeworkSubmissionBySubjectAndTeacherAndClass(idClassLetter, idFlow, idSubject) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllHomeworkSubmissionBySubjectAndTeacherAndClass/' + idClassLetter + '/' + idFlow + '/' + idSubject, requestOptions).then(handleResponse);
}

function GetAllHomeworkSubmissionBySubjectAndTeacherAndClassAndStudentAndTitle(idSubject, idFlow, idClassLetter, idStudent, idHWTitle ) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllHomeworkSubmissionBySubjectAndTeacherAndClassAndStudentAndTitle/' + idSubject + '/' + idFlow + '/' + idClassLetter + '/' + idStudent + '/' + idHWTitle, requestOptions).then(handleResponse);
}



function GetAllPupilsForClass(idFlow, idLetter) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/getAllPupilsForClass/' + idFlow + '/' + idLetter, requestOptions).then(handleResponse);
}


function GetAllPupilsForClassAttendance(idFlow, idLetter) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllPupilsForClassAttendance/' + idFlow + '/' + idLetter, requestOptions).then(handleResponse);
}



function GetAllPupilsForThematicalGrade(startDate, dateEnd, idSubject, idFlow, idLetter) {   
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllPupilsForThematicalGrade/' + startDate + '/' + dateEnd + '/' + idSubject + '/' + idFlow + '/' + idLetter, requestOptions).then(handleResponse);
}

function GetAllAbsenceSubject(idStudent, idSubject, startDate, dateEnd) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllAbsenceSubject/' + startDate + '/' + dateEnd + '/' + idSubject + '/' + idStudent, requestOptions).then(handleResponse);
}

function GetAllAbsence(idStudent, startDate, dateEnd) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllAbsence/' + startDate + '/' + dateEnd + '/' + idStudent, requestOptions).then(handleResponse);
}


function GetAllPupilsForFinalGrade(idSubject, idFlow, idLetter) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllPupilsForFinalGrade/' + idSubject + '/' + idFlow + '/' + idLetter, requestOptions).then(handleResponse);
}


function GetAllParentsForPupil(idStudent) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/getAllParentsForPupil/' + idStudent, requestOptions).then(handleResponse);
}


function GetAllGradesPupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllGradesPupil/' + id, requestOptions).then(handleResponse);
}


function GetAllAttendancePupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllAttendancePupil/' + id, requestOptions).then(handleResponse);
}



function GetAllThemGradesPupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllThemGradesPupil/' + id, requestOptions).then(handleResponse);
}

function GetAllFinalGradePupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllFinalGradePupil/' + id, requestOptions).then(handleResponse);
}


function GetAllGradesPupilParent(id, studentId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllGradesPupilParent/' + id + '/' + studentId, requestOptions).then(handleResponse);
}
function GetAllThemGradesPupilParent(id, studentId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllThemGradesPupilParent/' + id + '/' + studentId, requestOptions).then(handleResponse);
}
function GetAllFinalGradePupilParent(id, studentId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllFinalGradePupilParent/' + id + '/' + studentId, requestOptions).then(handleResponse);
}

function GetAllAttendanceParent(id, studentId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllAttendanceParent/' + id + '/' + studentId, requestOptions).then(handleResponse);
}

function GetAllInfoTeacher(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoTeacher/` + id, requestOptions).then(handleResponse);
}

function GetAllInfoAdmin(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoAdmin/` + id, requestOptions).then(handleResponse);
}

function GetAllInfoPupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoPupil/` + id, requestOptions).then(handleResponse);
}

function GetAllInfoClass(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllInfoClass/` + id, requestOptions).then(handleResponse);
}



function GetClassCodeStudent(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetClassCodeStudent/` + id, requestOptions).then(handleResponse);
}


function GetByIdParent(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/pupils`, requestOptions).then(handleResponse);
}

function GetAllClasses() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/classes`, requestOptions).then(handleResponse);
}

function GetAllGenders() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/genders`, requestOptions).then(handleResponse);
}



function GetAllStudentsFromClass(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/pupilsClassById/` + id, requestOptions).then(handleResponse);
}

function GetAllStudentsFromClassRegisteredParent(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllStudentsFromClassRegisteredParent/` + id, requestOptions).then(handleResponse);
}

function GetAllClassroomTeachers() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/classroomTeachers`, requestOptions).then(handleResponse);
}

function GetAllClassroomTeachersAdmin(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllClassroomTeachersAdmin/` + id, requestOptions).then(handleResponse);
}

function GetAllClassLetters() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/classLetters`, requestOptions).then(handleResponse);
}






function GetDayCurricular(dayId, flowId, letterId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/curricularForDay/` + dayId + '/' + flowId + '/' + letterId, requestOptions).then(handleResponse);
}


function GetSubjectTeachers(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/subjectTeachers/` + id, requestOptions).then(handleResponse);
}


function GetSubjectTeachersPupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetSubjectTeachersPupil/` + id, requestOptions).then(handleResponse);
}

function GetAllHomeworkBySubjectPupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllHomeworkBySubjectPupil/` + id, requestOptions).then(handleResponse);
}


function GetAllPostsBySubjectPupil(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetAllPostsBySubjectPupil/` + id, requestOptions).then(handleResponse);
}

function GetClassRoomTeacherForClassPupil() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetClassRoomTeacherForClassPupil', requestOptions).then(handleResponse);
}
function GetAllSubjectsPupil() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllSubjectsPupil', requestOptions).then(handleResponse);
}


function CreateAttendance(zeroSelect, firstSelect, secondSelect, pupils) {

    const formData = new FormData();
    formData.append("zeroSelect", zeroSelect);
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("pupils", JSON.stringify(pupils));
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateAttendance`, requestOptions)
        .then(handleResponse);
}

function CreateThematical(zeroSelect, firstSelect, secondSelect, dateOfStart, dateOfEnd, pupils) {

    const formData = new FormData();
    formData.append("zeroSelect", zeroSelect);
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("startDate", dateOfStart);
    formData.append("endDate", dateOfEnd);
    formData.append("pupils", JSON.stringify(pupils));
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateThematical`, requestOptions)
        .then(handleResponse);
}

function CreateFinal(zeroSelect, firstSelect, secondSelect, pupils) {

    const formData = new FormData();
    formData.append("zeroSelect", zeroSelect);
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("pupils", JSON.stringify(pupils));
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateFinal`, requestOptions)
        .then(handleResponse);
}



function CreateTeacher(nameTeacher, patronymicTeacher, surnameTeacher, emailTeacher, passwordTeacher, dateOfBirthTeacher, genderTeacher, phoneTeacher, adressTeacher, imageOfTeacher, selectedOption) {

    const formData = new FormData();
    formData.append("nameTeacher", nameTeacher);
    formData.append("patronymicTeacher", patronymicTeacher);
    formData.append("surnameTeacher", surnameTeacher);
    formData.append("emailTeacher", emailTeacher);
    formData.append("passwordTeacher", passwordTeacher);
    formData.append("dateOfBirthTeacher", (new Date(dateOfBirthTeacher)).toUTCString());
    formData.append("genderTeacher", genderTeacher);
    formData.append("phoneTeacher", phoneTeacher);
    formData.append("adressTeacher", adressTeacher);
    formData.append("imageOfTeacher", imageOfTeacher);
    formData.append("selectedOption", JSON.stringify(selectedOption));
    console.log(JSON.stringify(selectedOption));

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/createTeacher`, requestOptions)
        .then(handleResponse);
}




function changeTeacher(nameTeacher, patronymicTeacher, surnameTeacher, emailTeacher, passwordTeacher, dateOfBirthTeacher, genderTeacher, phoneTeacher, adressTeacher, imageOfTeacher, selectedOption, teacherId, adminCode) {

    const formData = new FormData();
    formData.append("nameTeacher", nameTeacher);
    formData.append("patronymicTeacher", patronymicTeacher);
    formData.append("surnameTeacher", surnameTeacher);
    formData.append("emailTeacher", emailTeacher);
    formData.append("passwordTeacher", passwordTeacher);
    formData.append("dateOfBirthTeacher", (new Date(dateOfBirthTeacher)).toUTCString());
    formData.append("genderTeacher", genderTeacher);
    formData.append("phoneTeacher", phoneTeacher);
    formData.append("adressTeacher", adressTeacher);
    formData.append("imageOfTeacher", imageOfTeacher);
    formData.append("teacherId", teacherId); 
    formData.append("adminCode", adminCode); 
    formData.append("selectedOption", JSON.stringify(selectedOption));
    console.log(JSON.stringify(selectedOption));

    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/changeTeacher`, requestOptions)
        .then(handleResponse);
}




function ChangePupil(namePupil, patronymicPupil, surnamePupil, emailPupil, passwordPupil, dateOfBirthPupil, genderPupil, motoPupil, phonePupil, adressPupil, imageOfPupil, classCode, idStudent, adminCode) {

    const formData = new FormData();
    formData.append("namePupil", namePupil);
    formData.append("patronymicPupil", patronymicPupil);
    formData.append("surnamePupil", surnamePupil);
    formData.append("emailPupil", emailPupil);
    formData.append("passwordPupil", passwordPupil);
    formData.append("dateOfBirthPupil", (new Date(dateOfBirthPupil)).toUTCString());
    formData.append("genderPupil", genderPupil);
    formData.append("motoPupil", motoPupil);
    formData.append("phonePupil", phonePupil);
    formData.append("adressPupil", adressPupil);
    formData.append("imageOfPupil", imageOfPupil);
    formData.append("classCode", classCode);
    formData.append("pupilId", idStudent);
    formData.append("adminCode", adminCode);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangePupil`, requestOptions)
        .then(handleResponse);
}



function CreateAdminFeedBack(firstSelect, secondSelect, thirdSelect, fourthSelect, fifthSelect, title, content, attachement) {

    const formData = new FormData();
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("thirdSelect", thirdSelect);
    formData.append("fourthSelect", fourthSelect);
    formData.append("fifthSelect", fifthSelect);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateAdminFeedBack`, requestOptions)
        .then(handleResponse);
}


function SubmitHomeworkPupil(homeworkId, comment, attachement) {

    const formData = new FormData();
    formData.append("homeworkId", homeworkId);
    formData.append("comment", comment);
    formData.append("attachement", attachement);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/SubmitHomeworkPupil`, requestOptions)
        .then(handleResponse);
}

function AddChild(studentId) {

    const formData = new FormData();
    formData.append("studentId", studentId);
  
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/AddChild`, requestOptions)
        .then(handleResponse);
}



function CreateHomeworkInfo(zeroSelect, firstSelect, title, content, attachement, dueDate) {

    const formData = new FormData();
    formData.append("zeroSelect", zeroSelect);
    formData.append("firstSelect", firstSelect);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);
    formData.append("dueDate", (new Date(dueDate)).toUTCString());
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateHomeworkInfo`, requestOptions)
        .then(handleResponse);
}


function ChangeHomeworkInfo(title, content, attachement, dueDate, idHomework) {

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("idHomework", idHomework);
    formData.append("attachement", attachement); 
    formData.append("dueDate", (new Date(dueDate)).toUTCString());
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangeHomeworkInfo`, requestOptions)
        .then(handleResponse);
}


function SubmitHomeworkGradeTeacher(idSubmission, comment, gradeStudent) {

    const formData = new FormData();
    formData.append("idSubmission", idSubmission);
    formData.append("comment", comment);
    formData.append("gradeStudent", gradeStudent);  
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/SubmitHomeworkGradeTeacher`, requestOptions)
        .then(handleResponse);
}

function CreatePupilFeedBack(firstSelect, secondSelect, thirdSelect, title, content, attachement) {

    const formData = new FormData();
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("thirdSelect", thirdSelect);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreatePupilFeedBack`, requestOptions)
        .then(handleResponse);
}
function CreateTeacherFeedBack(firstSelect, secondSelect, thirdSelect, fourthSelect, fifthSelect, title, content, attachement) {

    const formData = new FormData();
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("thirdSelect", thirdSelect);
    formData.append("fourthSelect", fourthSelect);
    formData.append("fifthSelect", fifthSelect);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateTeacherFeedBack`, requestOptions)
        .then(handleResponse);
}

function CreateClassRoomTeacherFeedBack(firstSelect, secondSelect, thirdSelect, title, content, attachement) {

    const formData = new FormData();
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("thirdSelect", thirdSelect);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateClassRoomTeacherFeedBack`, requestOptions)
        .then(handleResponse);
}

function GetSubjectTeachersPupilParent(subjectId, studentId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`weatherforecast/GetSubjectTeachersPupilParent/` + subjectId + '/' + studentId, requestOptions).then(handleResponse);
}
function GetClassRoomTeacherForClassPupilParent(studentId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetClassRoomTeacherForClassPupilParent/' + studentId, requestOptions).then(handleResponse);
}
function GetAllSubjectsParent(studentId) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllSubjectsParent/' + studentId, requestOptions).then(handleResponse);
}

function GetAllChildsParent() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetAllChildsParent', requestOptions).then(handleResponse);
}


function GetStudentsClassroomTeacher() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('weatherforecast/GetStudentsClassroomTeacher', requestOptions).then(handleResponse);
}





function CreateParentFeedBack(zeroSelect, firstSelect, secondSelect, thirdSelect, title, content, attachement) {

    const formData = new FormData();
    formData.append("zeroSelect", zeroSelect);
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("thirdSelect", thirdSelect);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateParentFeedBack`, requestOptions)
        .then(handleResponse);
}


function CreateAdminAnnouncement(firstSelect, secondSelect, thirdSelect, title, content, attachement) {

    const formData = new FormData();
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("thirdSelect", thirdSelect);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateAdminAnnouncement`, requestOptions)
        .then(handleResponse);
}


function ChangeAnnouncement(title, content, attachement, actual, idAnnouncement) {

    const formData = new FormData();
    formData.append("idAnnouncement", idAnnouncement);
    formData.append("actual", actual);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangeAnnouncement`, requestOptions)
        .then(handleResponse);
}


function CreateTeacherPost(firstSelect, secondSelect, title, content, attachement) {

    const formData = new FormData();
    formData.append("firstSelect", firstSelect);
    formData.append("secondSelect", secondSelect);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/CreateTeacherPost`, requestOptions)
        .then(handleResponse);
}

function ChangePost(title, content, attachement, idPost) {

    const formData = new FormData();
    formData.append("idPost", idPost);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("attachement", attachement);

    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangePost`, requestOptions)
        .then(handleResponse);
}

function CreateAdmin(nameAdmin, patronymicAdmin, surnameAdmin, emailAdmin, passwordAdmin, dateOfBirthAdmin, genderAdmin, phoneAdmin, descriptionAdmin, adminCode) {

    const formData = new FormData();
    formData.append("nameAdmin", nameAdmin);
    formData.append("patronymicAdmin", patronymicAdmin);
    formData.append("surnameAdmin", surnameAdmin);
    formData.append("emailAdmin", emailAdmin);
    formData.append("passwordAdmin", passwordAdmin);
    formData.append("dateOfBirthAdmin", (new Date(dateOfBirthAdmin)).toUTCString());
    formData.append("genderAdmin", genderAdmin);
    formData.append("phoneAdmin", phoneAdmin);
    formData.append("descriptionAdmin", descriptionAdmin);
    formData.append("adminCode", adminCode);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/createAdmin`, requestOptions)
        .then(handleResponse);
}

function ChangeAdmin(nameAdmin, patronymicAdmin, surnameAdmin, emailAdmin, passwordAdmin, dateOfBirthAdmin, genderAdmin, phoneAdmin, descriptionAdmin, adminCode) {

    const formData = new FormData();
    formData.append("nameAdmin", nameAdmin);
    formData.append("patronymicAdmin", patronymicAdmin);
    formData.append("surnameAdmin", surnameAdmin);
    formData.append("emailAdmin", emailAdmin);
    formData.append("passwordAdmin", passwordAdmin);
    formData.append("dateOfBirthAdmin", (new Date(dateOfBirthAdmin)).toUTCString());
    formData.append("genderAdmin", genderAdmin);
    formData.append("phoneAdmin", phoneAdmin);
    formData.append("descriptionAdmin", descriptionAdmin);
    formData.append("adminCode", adminCode);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/changeAdmin`, requestOptions)
        .then(handleResponse);
}

function ChangePersonalAdmin(emailAdmin, passwordAdmin, phoneAdmin, descriptionAdmin) {

    const formData = new FormData();

    formData.append("emailAdmin", emailAdmin);
    formData.append("passwordAdmin", passwordAdmin);
    formData.append("phoneAdmin", phoneAdmin);
    formData.append("descriptionAdmin", descriptionAdmin);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangePersonalAdmin`, requestOptions)
        .then(handleResponse);
}

function ChangePersonalPupil(emailPupil, passwordPupil, phonePupil, addressPupil, imagePupil, moto) {

    const formData = new FormData();

    formData.append("emailPupil", emailPupil);
    formData.append("passwordPupil", passwordPupil);
    formData.append("phonePupil", phonePupil);
    formData.append("addressPupil", addressPupil);
    formData.append("imagePupil", imagePupil);
    formData.append("moto", moto);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangePersonalPupil`, requestOptions)
        .then(handleResponse);
}

function ChangePersonalParent(emailParent, passwordParent, phoneParent, addressParent, workPlaceParent) {

    const formData = new FormData();

    formData.append("emailParent", emailParent);
    formData.append("passwordParent", passwordParent);
    formData.append("phoneParent", phoneParent);
    formData.append("addressParent", addressParent);
    formData.append("workPlaceParent", workPlaceParent);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangePersonalParent`, requestOptions)
        .then(handleResponse);
}

function ChangePersonalTeacher(emailTeacher, passwordTeacher, phoneTeacher, addressTeacher, imageTeacher) {

    const formData = new FormData();

    formData.append("emailTeacher", emailTeacher);
    formData.append("passwordTeacher", passwordTeacher);
    formData.append("phoneTeacher", phoneTeacher);
    formData.append("addressTeacher", addressTeacher);
    formData.append("imageTeacher", imageTeacher);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangePersonalTeacher`, requestOptions)
        .then(handleResponse);
}

function CreatePupil(namePupil, patronymicPupil, surnamePupil, emailPupil, passwordPupil, dateOfBirthPupil, genderPupil, motoPupil, phonePupil, adressPupil, imageOfPupil, classCode) {

    const formData = new FormData();
    formData.append("namePupil", namePupil);
    formData.append("patronymicPupil", patronymicPupil);
    formData.append("surnamePupil", surnamePupil);
    formData.append("emailPupil", emailPupil);
    formData.append("passwordPupil", passwordPupil);
    formData.append("dateOfBirthPupil", (new Date(dateOfBirthPupil)).toUTCString());
    formData.append("genderPupil", genderPupil);
    formData.append("motoPupil", motoPupil);
    formData.append("phonePupil", phonePupil);
    formData.append("adressPupil", adressPupil);
    formData.append("imageOfPupil", imageOfPupil);
    formData.append("classCode", classCode);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/createPupil`, requestOptions)
        .then(handleResponse);
}


function CreateClass(flow, letter, idClassroomTeacher, accessCode) {

    const formData = new FormData();
    formData.append("flow", flow);
    formData.append("letter", letter);
    formData.append("idClassroomTeacher", idClassroomTeacher);
    formData.append("accessCode", accessCode);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/createClass`, requestOptions)
        .then(handleResponse);
}



function ChangeClass(idClassroomTeacher, accessCode, adminCode, idClass) {

    const formData = new FormData();
    formData.append("adminCode", adminCode);
    formData.append("idClassroomTeacher", idClassroomTeacher);
    formData.append("accessCode", accessCode);
    formData.append("idClass", idClass);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/ChangeClass`, requestOptions)
        .then(handleResponse);
}


function CreateLesson(flow, letter, dayId, subjectId, teacherId, lessonOrder) {

    const formData = new FormData();
    formData.append("flow", flow);
    formData.append("letter", letter);
    formData.append("dayId", dayId);
    formData.append("subjectId", subjectId);
    formData.append("teacherId", teacherId);
    formData.append("lessonOrder", lessonOrder);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`weatherforecast/createLesson`, requestOptions)
        .then(handleResponse);
}