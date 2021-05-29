$("#submit-button").on("click", function(){

  if($("#house-number").val() != "" && $("#district").val() != "" && $("#apartment-size").val() != "Apartment Type*" &&
$("#availiblity-period").val() != "Available For:*" && $("#rent").val() != ""

)
{

  $("div:not(.popup-final)").addClass("low-opacity");
    $("div.popup-final").removeClass("non-visible");

}});

$("#continue").on("click", function(){
  $(".popup-final").addClass("non-visible");
  $("#loader-gif").removeClass("non-visible");
    $("div").removeClass("low-opacity");

})
$("#cancel").on("click", function(){
  $(".popup-final").addClass("non-visible");
    $("div").removeClass("low-opacity");
})
