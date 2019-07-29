$(function(){
  $(".changeName").click(function(){
  $(this).text("Totems");
});
});

function buildProjectCode(title, imgPath, refLink){
  lightCode = "data-lightbox=\"lightbox2\" data-title=\" + title + \""

  addCode = "<div class=\"project\">"
          + "<h2>"+title+"</h2>"
          + "<a href=" + imgPath + " " + lightCode + ">"
          + "<img src=" + imgPath + ">"
          + "</a>"
          + "<a href=" + refLink + " target=\"_blank\">"
          + "<p class=\"ref_link\">Reference Link<p>"
          + "</a>" + "</div>";

  return addCode
}

/*
$(function(){
  var array = [];
  $.ajax({
    url : 'dataaSet.xml',
    type : 'get',
    dataType : 'xml',
    cache : false,
  }).fail(function(jqxhr, status, error){
    alert(status + ":" + error);
  });

    success : function(data){
      var count = 0;
      $(data).find("projects").find("title").each(function(){
        array.push($(this).find("title").text());

      });
    },
    error: function(){
      alert("failed");
    }
  }).fail(function(jqxhr, status, error){
    alert(status + ":" + error);
  });


  return array;
})
*/


//main
$(function(){
  tmpTitle = "testTitle";
  tmpImgPath = "./projects/Totems/Totems.png"
  tmpRefLink = "https://mediatedmattergroup.com/totems"


  tmpCode = buildProjectCode(tmpTitle, tmpImgPath, tmpRefLink);

  $(".projects").append(tmpCode);
});
