document.getElementById("pizza-form").onsubmit = () => {

    let isValid = true;

    // Clear all errors
    clearErrors();

    let fname = document.getElementById("first-name").value.trim();
    let lname = document.getElementById("last-name").value.trim();

    // Validate First Name
    if (fname === "") {
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }

    // Validate Last Name
    if (lname === "") {
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }

    // Do not submit if form is not valid
    return isValid;
};

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}