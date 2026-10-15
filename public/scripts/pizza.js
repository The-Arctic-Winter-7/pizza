document.getElementById("pizza-form").onsubmit = () => {

    let isValid = true;

    // Clear all errors
    clearErrors();

    let fname = document.getElementById("first-name").value.trim();
    let lname = document.getElementById("last-name").value.trim();
    let email = document.getElementById("email").value.trim();


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

    // Validate Last Name
    if (email === "") {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    // Validate method: pick up or delivery
    let methodSelected = false;
    let methodButtons = document.getElementsByName("method");
    for (let i = 0; i < methodButtons.length; i++) {
        if (methodButtons[i].checked) {
            methodSelected = true;
        }
    }

    if (!methodSelected) {
        document.getElementById("err-method").style.display = "block";
        isValid = false;
    }

    // Validate size
    let sizeSelected = document.getElementById("size").value;
    if (sizeSelected == "none") {
        document.getElementById("err-size").style.display = "block";
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