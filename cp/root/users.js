const modal = document.getElementById("modal");
const roleSelect = document.getElementById("role");
const dynamicFields = document.getElementById("dynamicFields");

document.getElementById("addUserBtn").onclick = () => {
  modal.style.display = "block";
};

function closeModal(){
  modal.style.display = "none";
  dynamicFields.innerHTML = "";
}

roleSelect.addEventListener("change", () => {
  dynamicFields.innerHTML = "";

  if(roleSelect.value === "sous_directeur"){
    dynamicFields.innerHTML = `
      <select>
        <option>ZSB</option>
        <option>R-S</option>
        <option>JIS</option>
        <option>N-JIS</option>
      </select>
    `;
  }

  if(roleSelect.value === "supervisor"){
    dynamicFields.innerHTML = `
      <select id="dep">
        <option>ZSB</option>
        <option>R-S</option>
        <option>JIS</option>
        <option>N-JIS</option>
      </select>
      <div id="partZone"></div>
    `;

    document.getElementById("dep").addEventListener("change", function(){
      const partZone = document.getElementById("partZone");
      partZone.innerHTML = this.value === "ZSB"
        ? `<label><input type="checkbox"> INR</label>
           <label><input type="checkbox"> BASIS</label>
           <label><input type="checkbox"> COCKPIT</label>`
        : `<input type="text" placeholder="Zone">`;
    });
  }
});

function saveUser(){
  alert("User saved (front-end only)");
  closeModal();
}
