function showWebsite(str){
    if(str !== ""){
        $.ajax({
            url: "/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({choice: str}),
            success: function(result){
                $("#txt-hint").html(result.html);
            }
        })
    }
}