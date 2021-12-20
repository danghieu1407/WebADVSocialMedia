
$(document).ready(function () {
    $('#PostContent').on("submit", function (event) {
        event.preventDefault();
        let authID = $('#authID').val();
        let content = $('#content').val();

        $.ajax({
            url: "/",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ authID: authID, content: content }),
            success: function (data) {
                // console.log(data);
                let content = data.content;
                let name = data.user.name;
                let avatar = data.user.avatar;

                let OldDiv = document.querySelector('.box1');
                let newDiv = OldDiv.cloneNode(true);
                let list = document.getElementById('CollectionDiv');
                list.insertBefore(newDiv, list.childNodes[0]);
                newDiv.querySelector('.name').innerHTML = name;
                newDiv.querySelector('.content').innerHTML = content;
                newDiv.querySelector('.avt').src = avatar;

            }
        }) 

    });
    function getPost(){
        $.ajax({
            type:"GET",
            url:"/",
            dataType:'json',
            success: function(data){
                console.log(data)

            }

            
        })
    }
});
