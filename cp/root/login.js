document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(email === "admin@test.com" && password === "1234"){
    window.location.href = "index.html";
  } else {
    document.getElementById("error").innerText = "Invalid login";
  }
});
