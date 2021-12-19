$(document).ready(() => {
    $("#FormUserProfile").on("submit", (e) => {
        e.preventDefault();
        let nameValue = $("#Name").val();
        let ClassValue = $("#Class").val();
        let FacultyValue = $("#Faculty").val();

        $.ajax({
            url: "/UserProfile",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ nameValue: nameValue, ClassValue: ClassValue, FacultyValue: FacultyValue }),
            success: function (res) {
                console.log(res);
            }
        })

    })
});