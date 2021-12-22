
$(document).ready(function () {
    $('#PostContent').on("submit", function (event) {
        event.preventDefault();
        let authID = $('#authID').val();
        let content = $('#content').val();
        document.getElementById('content').innerHTML ='';

        $.ajax({
            url: "/",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ authID: authID, content: content }),
            success: function (data) {
                console.log(data);
                let content = data.post.content;
                let name = data.user.name;
                let avatar = data.user.avatar;

                let OldDiv = document.querySelector('.box1');
                let newDiv = OldDiv.cloneNode(true);
                let list = document.getElementById('CollectionDiv');
                list.insertBefore(newDiv, list.childNodes[0]);
                newDiv.querySelector('.name').innerHTML = name;
                newDiv.querySelector('.content').innerHTML = content;
                newDiv.querySelector('.avt').src = avatar;

                document.getElementsByClassName("box1")[0].id = data.post._id;
                document.querySelector('#content').innerHTML = "";
            }
        })
    });
});


$(document).ready(function () {
    $(".btn-delete").on("click", (event) =>{
        event.preventDefault();
        const id = $(event.target).data('id');
        console.log(id);
        $.ajax({
            url: "/DeletePost",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ IDPost: id }),
            success: function (data) {
                let id = data.IDPost;
                console.log(id);
                let Div = document.getElementById(id);
                Div.remove();
            }
        })
    });
})


$(document).ready(function () {
    $(".btn-edit").on("click", (event) =>{
        event.preventDefault();
       const button_edit = event.target;
       const content = button_edit.dataset.content;
       const id = button_edit.dataset.id;
       
       $("#IDForEditContent").attr("value", id);
       $("#contentedit").html(content);
        $("#editPost").modal("show");
    });

    $("#EditContent").on("submit", (event) =>{
        event.preventDefault();
        let content = $('#contentedit').val();
        let id = $('#IDForEditContent').val();
        $("#editPost").modal("hide");
        $.ajax({
            url: "/EditPost",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ IDPost: id, content: content }),
            success: function (data) {
                console.log(data)
               let Div = document.getElementById(data._id);
               Div.querySelector('.content').innerHTML = content;

            }   
        })
    });

    
})