/*Đăng Nội Dung */
$(document).ready(function () {
    $('#PostContent').on("submit", function (event) {
        event.preventDefault();
        let authID = $('#authID').val();
        let content = $('#content').val();
        document.getElementById('content').innerHTML = '';

        $.ajax({
            url: "/",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ authID: authID, content: content }),
            success: function (data) {
                console.log(data);
                $('#content').trigger("reset");

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
                $('#PostContent')[0].reset();

            }
        })
    });

});

/*
$(document).ready(function() {
    $.ajax({
        url: "/loadmore",
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {

            let content = data.post.content;
            let name = data.user.name;
            let avatar = data.user.avatar;
            console.log(data);
            for (var i = 0; i < data.post.length; i++) {
                let olddiv = document.querySelector('.box1');
                let newdiv = olddiv.cloneNode(true);
                let list = document.getElementById('CollectionDiv');
                list.insertBefore(newdiv, list.childNodes[0]);
                newDiv.querySelector('.name').innerHTML = name;
                newDiv.querySelector('.content').innerHTML = content;
                newdiv.querySelector('.avt').scr = avatar;
                document.getElementsByClassName("box1")[0].id = data.post._id;
                $('#CollectionDiv').append(newdiv)
            }

        }
    })
})
*/
window.onload = ()=>{
    console.log('Mở kết nối tới sever')
    
    const socket = io();

    socket.on('connect', ()=>{console.log('đã kết nối thành công')
    })
    socket.on('disconnect', ()=>{console.log('đã kết nối thất bại')
    socket.on('message',m=> {console.log(`đã nhận một tin nhắn:${m}`)})
})
}

function appendMessages(message) {
    const html = `<div>${message}</div>`
    messages.innerHTML += html
}

/**Xóa Bài Viết */

$(document).ready(function () {
    $(document).on("click", "#btn-delete", (event) => {
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

/**Sửa bài viết */
$(document).ready(function () {
    $(".btn-edit").on("click", (event) => {
        event.preventDefault();
        const button_edit = event.target;
        const content = button_edit.dataset.content;
        const id = button_edit.dataset.id;

        $("#IDForEditContent").attr("value", id);
        $("#contentedit").html(content);
        $("#editPost").modal("show");
    });

    $("#EditContent").on("submit", (event) => {
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
                $('#EditContent')[0].reset();

            }
        })
    });
})



let IDPost;
/*Comment Bài Viết */
$(document).ready(function () {
    $(document).on("click", ".OpenCommentModal", (event) => {
        event.preventDefault();
        IDPost = $(event.target).data('id');
        $("#CommentModal").modal("show");
        $.ajax({
            url: "/loadComment",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ IDPost: IDPost }),
            success: function (data) {
                let datacmt = data.data;
                let datauser = data.user;
                let list = document.getElementById('CommentList');
                datacmt.forEach(cmt => {
                    let OldDiv = document.querySelector('.ElementComment');
                    let newDiv = OldDiv.cloneNode(true);

                    newDiv.setAttribute('id', cmt._id);
                    let Deletebtn = document.createElement('a');

                    Deletebtn.setAttribute('data-id', cmt._id);
                    Deletebtn.setAttribute("class", "DeleteComment");

                    Deletebtn.innerHTML = "Xóa";
                    datauser.forEach(usercmt => {
                        if (cmt.Commentor == usercmt.authId) {
                            newDiv.querySelector('.UserComment').innerHTML = usercmt.name;
                        }
                    })
                    if (cmt.Commentor == data.OwnerComment) {
                        newDiv.querySelector('.UserComment').appendChild(Deletebtn);
                    }
                    newDiv.querySelector('.ContentOfComment').innerHTML = cmt.content;
                    list.appendChild(newDiv);
                })
            }
        })



    });

    $("#CommentModal").on("submit", (event) => {
        event.preventDefault();
        let authID = $('#authID').val();
        let comment = $('#comment').val();
        $.ajax({
            url: "/SendComment",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ IDPost: IDPost, authID: authID, comment: comment }),
            success: function (data) {
                let list = document.getElementById('CommentList');
                let OldDiv = document.querySelector('.ElementComment');
                let newDiv = OldDiv.cloneNode(true);

                newDiv.setAttribute('id', data.data._id);
                let Deletebtn = document.createElement('a');
                Deletebtn.setAttribute('data-id', data.data._id);
                Deletebtn.setAttribute("class", "DeleteComment");
                Deletebtn.innerHTML = "Xóa";
                newDiv.querySelector('.UserComment').innerHTML = data.user.name;
                newDiv.querySelector('.UserComment').appendChild(Deletebtn);
                newDiv.querySelector('.ContentOfComment').innerHTML = data.data.content;
                list.appendChild(newDiv);
            }
        })

    })

    $('#CommentModal').on('hidden.bs.modal', function () {
        console.log("CloseModal")
        let list = document.getElementById('CommentList');
        let Div = document.querySelector(".ElementComment");
        let newDiv = Div.cloneNode(true);
        list.innerHTML = '';
        list.appendChild(newDiv);
    })

    $(document).on("click", ".DeleteComment", (event) => {
        event.preventDefault();
        let id = event.target.dataset.id;
        console.log(id);

        $.ajax({
            url: "/DeleteComment",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ IDComment: id }),
            success: function (data) {
                let Div = document.getElementById(id);
                Div.remove();
            }
        })
    });
})


/*Load Thêm Bài Viết */
$(document).ready(function () {
    
    $(window).on("scroll", function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    
            let code = $(".LoadMoreEvent").data('code');
            if (code== 1) {
                let code = 1
                $.ajax({
                    url: "/LoadMoreEvent",
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ code: code }),
                    success: function (data) {
                        let list = document.getElementById("CollectionDiv");
                        data.result.forEach(data_element => {
                            let OldDiv = document.querySelector('.box1');
                            let newDiv = OldDiv.cloneNode(true);
                            newDiv.querySelector('.namePage').innerHTML = data_element.user.name;
                            newDiv.querySelector('.namePage').setAttribute('href', `/PageOfUser?authId=${data_element.user.authId}`);
                            newDiv.querySelector('.content').innerHTML = data_element.content;
                            newDiv.querySelector('.avt').src = data_element.user.avatar;
                            newDiv.querySelector('.OpenCommentModal').setAttribute('data-id', data_element._id);
                            list.appendChild(newDiv);
                        })
    
                    }
                })
            }
            else if (code== 2) {
                let code = 2
                let id = $(".LoadMoreEvent").data('id')
                $.ajax({
                    url: "/LoadMoreEvent",
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ code: code ,id:id}),
                    success: function (data) {
                        console.log(data)
                        let list = document.getElementById("CollectionDiv");
                        data.post.forEach(data_element => {
                            let OldDiv = document.querySelector('.box1');
                            let newDiv = OldDiv.cloneNode(true);
                            newDiv.querySelector('.namePage').innerHTML = data.userother.name;
                            newDiv.querySelector('.namePage').setAttribute('href', `/PageOfUser?authId=${data.userother.authId}`);
                            newDiv.querySelector('.content').innerHTML = data_element.content;
                            newDiv.querySelector('.avt').src = data.userother.avatar;
                            newDiv.querySelector('.OpenCommentModal').setAttribute('data-id', data_element._id);
                            list.appendChild(newDiv);
                        })
    
                    }
                })
            }
            
        }
    }); 
})

$(document).ready(function () {
    $("body").on("click", ".OpenDetailNotification", (event) => {
        event.preventDefault();
        let content = $(event.target).data("content");
        let title = $(event.target).data("title");
        $("#TitleNotification").html(title);
        $(".ContentNotification").html(content);
        $("#DetailNotification").modal("show");
    })
})

$(document).ready(function () {
    function getNameFaculy(data) {
        if(data=="BHLD")
        {
            return "Bảo Hộ Lao Động";
        }
        else if(data=="PCTHSSV")
        {
            return "Phòng Công Tác Học Sinh Sinh Viên";
        }
        else if(data=="PDH")
        {
            return "Phòng Đại Học"
        }
        else if(data=="PSDH")
        {
            return "Phòng Sau Đại Học"
        }
        else if(data=="ĐTVMT")
        {
            return "Phòng điện toán và máy tính"
        }
        else if(data=="TDTUEnglish")
        {
            return "TDT Creative Language Center"
        }
        else if(data=="TTTH")
        {
            return "Trung Tâm Tin Học"
        }
        else if (data == "SDTC")
        { 
            return "Trung tâm đào tạo phát triển xã hội "
        }
    }
})





