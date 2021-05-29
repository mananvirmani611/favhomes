$(window).on("load",function(){
     $(".loader-wrapper").fadeOut("slow");
});





// search bar implementation
// (Starting)
var places = [
    { label: 'Alwar, Rajasthan', value: 'IN' },
    { label: 'Bikaner, Rajasthan', value: 'IN' },
    { label: 'Banswara, Rajasthan', value: 'IN' },
    { label: 'Baran, Rajasthan', value: 'IN' },
    { label: 'Barmer, Rajasthan', value: 'IN' },
    { label: 'Bharatpur, Rajasthan', value: 'IN' },
    { label: 'Bhilwara, Rajasthan', value: 'IN' },
    { label: 'Bundi, Rajasthan', value: 'IN' },
    { label: 'Chittorgarh, Rajasthan', value: 'IN' },
    { label: 'Churu, Rajasthan', value: 'IN' },
    { label: 'Dausa, Rajasthan', value: 'IN' },
    { label: 'Dholpur, Rajasthan', value: 'IN' },
    { label: 'Dungarpur, Rajasthan', value: 'IN' },
    { label: 'Udaipur, Rajasthan', value: 'IN' },
    { label: 'Hanumangarh, Rajasthan', value: 'IN' },
    { label: 'Jaipur, Rajasthan', value: 'IN' },
    { label: 'Jaisalmer, Rajasthan', value: 'IN' },
    { label: 'Jalor, Rajasthan', value: 'IN' },
    { label: 'Jhalawar, Rajasthan', value: 'IN' },
    { label: 'Jhunjhunu, Rajasthan', value: 'IN' },
    { label: 'Jodhpur, Rajasthan', value: 'IN' },
    { label: 'Karauli, Rajasthan', value: 'IN' },
    { label: 'Kota, Rajasthan', value: 'IN' },
    { label: 'Nagaur, Rajasthan', value: 'IN' },
    { label: 'Pali, Rajasthan', value: 'IN' },
    { label: 'Pratapgarh, Rajasthan', value: 'IN' },
    { label: 'Rajsamand, Rajasthan', value: 'IN' },
    { label: 'Sawai Madhopur, Rajasthan', value: 'IN' },
    { label: 'Sikar, Rajasthan', value: 'IN' },
    { label: 'Sirohi, Rajasthan', value: 'IN' },
    { label: 'Sri Ganganagar, Rajasthan', value: 'IN' },
    { label: 'Tonk, Rajasthan', value: 'IN' },
    { label: 'Amritsar, Punjab', value: 'IN' },
    { label: 'Barnala, Punjab', value: 'IN' },
    { label: 'Bathinda, Punjab', value: 'IN' },
    { label: 'Faridkot, Punjab', value: 'IN' },
    { label: 'Fatehgarh Sahib, Punjab', value: 'IN' },
    { label: 'Firozpur, Punjab', value: 'IN' },
    { label: 'Fazilka, Punjab', value: 'IN' },
    { label: 'Gurdaspur, Punjab', value: 'IN' },
    { label: 'Hoshiarpur, Punjab', value: 'IN' },
    { label: 'Jalandhar, Punjab', value: 'IN' },
    { label: 'Kapurthala, Punjab', value: 'IN' },
    { label: 'Ludhiana, Punjab', value: 'IN' },
    { label: 'Mansa, Punjab', value: 'IN' },
    { label: 'Moga, Punjab', value: 'IN' },
    { label: 'Sri Muktsar Sahib, Punjab', value: 'IN' },
    { label: 'Pathankot, Punjab', value: 'IN' },
    { label: 'Patiala, Punjab', value: 'IN' },
    { label: 'Rupnagar, Punjab', value: 'IN' },
    { label: 'Sahibzada Ajit Singh Nagar, Punjab', value: 'IN' },
    { label: 'Sangrur, Punjab', value: 'IN' },
    { label: 'Shahid Bhagat Singh Nagar, Punjab', value: 'IN' },
    { label: 'Taran Taran, Punjab', value: 'IN' },
    { label: 'Ahmednagar, Maharashtra', value: 'IN' },
    { label: 'Akola, Maharashtra', value: 'IN' },
    { label: 'Amravati, Maharashtra', value: 'IN' },
    { label: 'Aurangabad, Maharashtra', value: 'IN' },
    { label: 'Beed, Maharashtra', value: 'IN' },
    { label: 'Bhandara, Maharashtra', value: 'IN' },
    { label: 'Buldhana, Maharashtra', value: 'IN' },
    { label: 'Chandrapur, Maharashtra', value: 'IN' },
    { label: 'Dhule, Maharashtra', value: 'IN' },
    { label: 'Gadchiroli, Maharashtra', value: 'IN' },
    { label: 'Gondia, Maharashtra', value: 'IN' },
    { label: 'Hingoli, Maharashtra', value: 'IN' },
    { label: 'Jalgaon, Maharashtra', value: 'IN' },
    { label: 'Jalna, Maharashtra', value: 'IN' },
    { label: 'Kolhapur, Maharashtra', value: 'IN' },
    { label: 'Latur, Maharashtra', value: 'IN' },
    { label: 'Mumbai City, Maharashtra', value: 'IN' },
    { label: 'Mumbai Suburban, Maharashtra', value: 'IN' },
    { label: 'Nagpur, Maharashtra', value: 'IN' },
    { label: 'Nanded, Maharashtra', value: 'IN' },
    { label: 'Nandurbar, Maharashtra', value: 'IN' },
    { label: 'Nashik, Maharashtra', value: 'IN' },
    { label: 'Osmanabad, Maharashtra', value: 'IN' },
    { label: 'Palghar, Maharashtra', value: 'IN' },
    { label: 'Parbhani, Maharashtra', value: 'IN' },
    { label: 'Pune, Maharashtra', value: 'IN' },
    { label: 'Raigad, Maharashtra', value: 'IN' },
    { label: 'Ratnagiri, Maharashtra', value: 'IN' },
    { label: 'Sangli, Maharashtra', value: 'IN' },
    { label: 'Satara, Maharashtra', value: 'IN' },
    { label: 'Sindhudurg, Maharashtra', value: 'IN' },
    { label: 'Solapur, Maharashtra', value: 'IN' },
    { label: 'Thane, Maharashtra', value: 'IN' },
    { label: 'Wardha, Maharashtra', value: 'IN' },
    { label: 'Washim, Maharashtra', value: 'IN' },
    { label: 'Yavatmal, Maharashtra', value: 'IN' }

  ];

var input = document.getElementById("place");
//autocomplete
autocomplete({
    input: input,
    fetch: function(text, update) {
        text = text.toLowerCase();
        // you can also use AJAX requests instead of preloaded data
        var suggestions = places.filter(n => n.label.toLowerCase().startsWith(text))
        // console.log(suggestions);
        suggestions.length = 5;
        update(suggestions);
    },
    onSelect: function(item) {
        input.value = item.label;
    },
    preventSubmit:true
});
//search bar code ends


// typewriter code, which types and deletes the code.(Starting)

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Jaipur", "Delhi", "Alwar", "Mumbai"];
const typingDelay = 100;
const erasingDelay = 100;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  }
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  }
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex>=textArray.length) textArrayIndex=0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});
//TypeWriter code ends




// $("#search-button").on("click", function(req, res){
//   var parameter = $("#place").val();
//   console.log(parameter);
//   var modifiedParam = "";
//   while(parameter.charAt(i) != ","){
//     modifiedParam = modifiedParam + parameter.charAt(i);
//   }
//   $("#search-button").attr("action", "/find-house/" + parameter);
// })
