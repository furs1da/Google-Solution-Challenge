import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    registerParent,
    registerPupil,
    codeCheck,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`weatherforecast/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (user.roleId === 1) { user.role = 'Admin'; }
            else if (user.roleId === 2) { user.role = 'Pupil'; }
            else if (user.roleId === 3) { user.role = 'Parent'; }
            else  { user.role = 'Teacher'; }
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function registerParent(nameParent, patronymicParent, surnameParent, emailParent, passwordParent, dateOfBirthParent, genderParent, workOfPlaceParent, phoneParent, adressParent, idPupil) {

    const formData = new FormData();
    formData.append("nameParent", nameParent);
    formData.append("patronymicParent", patronymicParent);
    formData.append("surnameParent", surnameParent);
    formData.append("emailParent", emailParent);
    formData.append("passwordParent", passwordParent);
    formData.append("dateOfBirthParent", (new Date(dateOfBirthParent)).toUTCString());
    formData.append("genderParent", genderParent);
    formData.append("workPlace", workOfPlaceParent);
    formData.append("phoneParent", phoneParent);
    formData.append("adressParent", adressParent);
    formData.append("idPupil", idPupil);
    const requestOptions = {
        method: 'POST',
        body: formData
    };   

    return fetch(`weatherforecast/registerParent`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            user.role = 'Parent'; 
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}

function registerPupil(namePupil, patronymicPupil, surnamePupil, emailPupil, passwordPupil, dateOfBirthPupil, genderPupil, motoPupil, phonePupil, adressPupil, imageOfPupil, classCode) {

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
        body: formData 
    };

    return fetch(`weatherforecast/registerPupil`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            user.role = 'Pupil';         
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}



function codeCheck(classCode) {

    const formData = new FormData();
    formData.append("classCode", classCode);  
    const requestOptions = {
        method: 'POST',
        body: formData
    };

    return fetch(`weatherforecast/registerParentCodeCheck`, requestOptions)
        .then(handleResponse)
        .then(classId => {         
            return classId;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
