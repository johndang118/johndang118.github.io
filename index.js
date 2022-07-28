function registerStudent()
{
    let firstName = document.getElementById("firstName").value;
    let middleName = document.getElementById("middleName").value;
    let lastName = document.getElementById("lastName").value;
    let dateOfBirth = document.getElementById("dateOfBirth").value;
    let nganh = document.getElementById("nganh").value;
    let gender = document.getElementById("gender").value;
    let fatherName = document.getElementById("fatherName").value;
    let fatherPhone = document.getElementById("fatherPhone").value;
    let fatherEmail = document.getElementById("fatherEmail").value;
    let motherName = document.getElementById("motherName").value;
    let motherPhone = document.getElementById("motherPhone").value;
    let motherEmail = document.getElementById("motherEmail").value;
    let address = document.getElementById("address").value;
    let returningNew = document.getElementById("returningNew").value;
    let paid = document.getElementById("paid").value;
    let notes = document.getElementById("notes").value;

    addStudent(firstName, middleName, lastName, dateOfBirth, nganh, gender, fatherName, fatherPhone, fatherEmail, motherName, motherPhone, motherEmail, address, returningNew, paid, notes);
}

function addStudent(firstName, middleName, lastName, dateOfBirth, nganh, gender, fatherName, fatherPhone, fatherEmail, motherName, motherPhone, motherEmail, address, returningNew, paid, notes)
{
    let id = studentId(firstName, lastName, fatherPhone, motherPhone);

    let studentDocRef = db.collection("students").doc(id);

    studentDocRef.set({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        nganh: nganh,
        gender: gender,
        fatherName: fatherName,
        fatherPhone: fatherPhone,
        fatherEmail: fatherEmail,
        motherName: motherName,
        motherPhone: motherPhone,
        motherEmail: motherEmail,
        address: address,
        returningNew: returningNew,
        paid: paid,
        notes: notes
    })
    .then((docRef) => {
        alert("Successfully Registered Student with Id: ", id);
        console.log("Student added with ID: ", id);
    })
    .catch((error) => {
        alert("Could not register. Contact JD");
        console.error("Error adding student: ", error);
    });

    
}

let studentId = (firstName, lastName, fatherPhone, motherPhone) =>
{
    let studentId;
    if (fatherPhone.length >= 4) {
        studentId = lastName.toLowerCase()+firstName.toLowerCase()+fatherPhone.slice(-4);
    }
    else if (motherPhone.length >= 4)
    {
        studentId = lastName.toLowerCase()+firstName.toLowerCase()+motherPhone.slice(-4);
    }
    else
    {
        studentId = lastName.toLowerCase()+firstName.toLowerCase()+Math.trunc(Math.random() * 10000);
    }

    return studentId;
}