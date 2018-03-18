$("#header").load("header.html");
$("#footer").load("footer.html", function(){
  var footerYear = $('#footer-current-year'),
      date = new Date(),
      currentYear = date.getFullYear();

  footerYear.text(currentYear);
});
