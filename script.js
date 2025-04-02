let editId;
// let deleteId;

$('.add').click(()=>{
    $('.add-post').toggle();
});

function getMethod() {
    $.ajax({
        url: 'http://localhost:3000/notes', 
        method: 'GET',                     
        success: function(response) {
            $('.api-data').empty();  
            $.each(response, function(index, item) {
                $('.api-data').append(`
                    <div class="box" data-id="${item.id}">
                        <h4>${item.task_name}</h4>
                        <p>${item.description}</p>
                        <div class='flex-div'>
                            <p>${new Date().toLocaleDateString()}</p>
                            <i class="fa-solid fa-circle-exclamation exclamation"></i>
                            <div class='option'>
                                <i class="fa-solid fa-pen-to-square edit"></i>
                                <i class="fa-solid fa-trash trash"></i>
                            </div>
                        </div>
                    </div>
                `);
            });

            $(".api-data").on("click", ".trash", function() {
                let boxId = $(this).closest(".box").data("id");
                deleteData(boxId);
                console.log(boxId); 
            });

            $(".api-data").on("click", ".edit", function() {
                let boxId = $(this).closest(".box").data("id");
                editId = boxId; 
                let task = response.find(item => item.id === editId); 

                $('.add-post').show(); 
                $('#task-name').val(task.task_name);  
                $('#desc').val(task.description);  

                
                if($('button').text() === 'Add Post'){
                    $('button').text('Edit Post'); 
                }
                console.log(editId); 
            });


            $(".exclamation").hover(
                function() {
                    $(this).siblings(".option").show();
                    
                }
            );
            $(".api-data").on("mouseleave", ".flex-div", function() {
                $(this).find(".option").hide();
            });
            
            $('.api-data .option').hide();
        },
        error: function(error) {
            console.error("Error fetching data:", error);
        }
    });
}

getMethod(); 

function postData(taskName, description) {
    $.ajax({
        url: 'http://localhost:3000/notes', 
        method: 'POST',   
        contentType: "application/json", 
        data: JSON.stringify({ 
            task_name: taskName, 
            description: description 
        }),
        success: function(response) {
            console.log('Server Response:', response);
            $("#task-name").val("");
            $("#desc").val("");
            getMethod(); 
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

function putMethod(taskName, description) {
    $.ajax({
        url: `http://localhost:3000/notes/${editId}`, 
        method: 'PUT',   
        contentType: "application/json", 
        data: JSON.stringify({ 
            task_name: taskName, 
            description: description 
        }),
        success: function(response) {
            console.log('Server Response:', response);
            $("#task-name").val("");
            $("#desc").val("");
            getMethod(); 
            $('button').text('Add Post');  
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

function deleteData(deleteId){
    $.ajax({
        url: `http://localhost:3000/notes/${deleteId}`, 
        method: 'DELETE',   
        success: function(response) {
            console.log('Server Response:', response);
            getMethod(); 
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

$("form").submit(function (event) {
    event.preventDefault(); 

    let taskName = $("#task-name").val().trim();
    let description = $("#desc").val().trim();

    if (taskName === "" || description === "") {
        alert("Please fill in all fields.");
        return;
    }

    if($('button').text() === 'Add Post'){
        postData(taskName, description); 
        $('.add-post').hide();
    }else{
        putMethod(taskName, description);
        $('button').text('Add Post');
        $('.add-post').hide();
    }

    
});
