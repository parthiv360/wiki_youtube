$(document).ready(function(){
    var apikey= "AIzaSyD004m8GfYQuKuA93vzNbRtPp5THHeVqN0"
    var video= ''
   

    $("form").submit(function(event){
        event.preventDefault()

        var search = $("#search").val()
        
        
        videosearch(apikey,search,9)

    })

    function videosearch(key,search,m){
        $("#videos").empty()
        $.get("https://www.googleapis.com/youtube/v3/search?key="+key 
        + "&type=video&part=snippet&maxResults="+ m + "&q="+ search, function(data){
              console.log(data)

              data.items.forEach(item => {
                   video = `
                   <iframe width= "300" height="315" src="http://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
                   
                   `
                   $("#videos").append(video)
              });
        })
    }
})