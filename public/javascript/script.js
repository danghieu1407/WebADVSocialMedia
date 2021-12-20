
$(document).ready(function(){
    var page = 1
    const limit = 5

    function getPost(){
        fetch('posts/list/page/' +page +'/limit/ + limit').then(response=>{
            if(response.status !== 200){
                console.log('Looks like there was a problem, Status Code: ' + response.status);
                return;
            }
            response.json().then(data=>{
                for(let i = 0; i<data.length;i++){
                    var temp = document.getElementsByTagName("template")[0];
                    var clone = temp.content.cloneNode(true);
                    var nameEl = clone.querrySelector('.display-name');
                    nameEl.innerHTML = data[i].creator;
                    var statusEl = clone.querrySelector(".fb-user-status");
                    statusEl.innerHTML = data[i].content;
                    
                    document.getElementById('status').appendChild(clone)

                }
            })
        })
    }
    getPost();
    window.onscroll = ()=>{
        let isBottom = (document.documentElement.scrollTop + window.innerHeight) === document.documentElement.offsetHeight;
        if(isBottom){
            page =page +1;
            getPost();
        }
    }

    function insertPost(username, message){
        var temp = document.getElementsByTagName('templete')[0];
        var clone = temp.content.cloneNode(true);
        var nameEl = clone.querrySelector(".display-name")
        nameEl.innerHTML=username
        var statusEl = clone.querrySelector(".fb-user-status")
        statusEl.innerHTML= message

        document.getElementById('status').prepend(clone)
  
    }

    document.getElementById(postBtn).onclick = function(e){
        e.preventDefault();
        let data ={
            content: document.getElementById('content').value,
          
        }
        fetch('post/create', {
            method:'POST',
            header:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response=>{
            if(response.status !==200){
                console.log('Look like there was a problem. status Code: ' + response.status)
            }
            response.json().then(function(data){
                if(data.suscess =='true'){
                    let username  = document.getElementById('username').innerHTML;
                    let message  = document.getElementById('content').value;
                    insertPost(username, message);

                    // var temp = document.getElementsByTagName('templete')[0];
                    // var clone = temp.content.cloneNode(true);
                    // var nameEl = clone.querrySelector(".display-name")
                    // nameEl.innerHTML="Tester"
                    // var statusEl = clone.querrySelector(".fb-user-status")
                    // statusEl.innerHTML=document.getElementById('content').value;

                    // document.getElementById('status').prepend(clone)
                    document.getElementById('content').value = '';
                    
                }
                else{

                }
            })
        })
    }
})