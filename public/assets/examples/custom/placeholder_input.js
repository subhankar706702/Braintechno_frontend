unlayer.registerTool({
    name: 'placeholder_input',
    label: 'Placeholder Text Area',
    icon: 'fa-marker',
    supportedDisplayModes: ['web', 'email'],
    options: {
       
    },
    values: {},
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                return `<div class="place_holder_input_${values._meta.htmlID}">

                <div class="container place_holder_wrapper">
                <div class="card">
                <h3>Select constant placeholder</h3>
                  <div class="select-dropdown">
                    <select onchange="getPlaceHolderText(this)" id="placeHolder_select">
                      <option value="" selected>Place  holder text list</option>
                      <option value=" [username] ">Username</option>
                    <option value=" [useraddress] ">Useraddress</option>
                    <option value=" [userphonenumber] ">Userphonenumber</option>
                    <option value=" [productname] ">Productname</option>
                    <option value=" [price] ">Price</option>
                    <option value=" [contact] ">Contact</option>
                    <option value=" [owner] ">Owner</option>
                    </select>
                   </div>

                  <div class="drop_box_multi">
                  <form>
                     <textarea id="placeholderTextArea" rows="5" cols="30" ></textarea>
                  </form>
                  </div>
              
                </div>
              </div>

                    </div>`;
            },
        }),
        exporters: {
            web: function (values) {
                return `
                <div class="place_holder_input_${values._meta.htmlID}">

                <div class="container">
                <div class="card">
                <h3>Select constant placeholder</h3>
                  <div class="select-dropdown">
                    <select onchange="getPlaceHolderText(this)" id="placeHolder_select">
                    <option value="" selected>Place  holder text list</option>
                    <option value=" [username] ">Username</option>
                    <option value=" [useraddress] ">Useraddress</option>
                    <option value=" [userphonenumber] ">Userphonenumber</option>
                    <option value=" [productname] ">Productname</option>
                    <option value=" [price] ">Price</option>
                    <option value=" [contact] ">Contact</option>
                    <option value=" [owner] ">Owner</option>
                    </select>
                   </div>

                  <div class="drop_box_multi">
                  <form>
                     <textarea id="placeholderTextArea" rows="5" cols="30" ></textarea>
                  </form>
                  </div>
              
                </div>
              </div>

                    </div>
                `;
            },
            email: function (values) {
                return '<div>I am a custom tool.</div>';
            },
        },
        head: {
            css: function (values) {
                return `
                .place_holder_input_${values._meta.htmlID} .select-dropdown,
                .place_holder_input_${values._meta.htmlID} .select-dropdown * {
                    margin: 0;
                    padding: 0;
                    position: relative;
                    box-sizing: border-box;
                  }
                  .place_holder_input_${values._meta.htmlID} textarea {
                    width: 100%;
                    margin: 10px auto;
                    padding: 10px;
                  }
                  .place_holder_input_${values._meta.htmlID} .select-dropdown {
                    position: relative;
                    background-color: #E6E6E6;
                    border-radius: 4px;
                    width: 180px;
                  }
                  .place_holder_input_${values._meta.htmlID} .select-dropdown select {
                    font-size: 1rem;
                    font-weight: normal;
                    max-width: 100%;
                    padding: 8px 24px 8px 10px;
                    border: none;
                    background-color: transparent;
                      -webkit-appearance: none;
                      -moz-appearance: none;
                    appearance: none;
                  }
                  .place_holder_input_${values._meta.htmlID} .select-dropdown select:active, .select-dropdown select:focus {
                    outline: none;
                    box-shadow: none;
                  }
                  .place_holder_input_${values._meta.htmlID} .select-dropdown:after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    right: 8px;
                    width: 0;
                    height: 0;
                    margin-top: -2px;
                    border-top: 5px solid #aaa;
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                  }
                .multi_file_upload_${values._meta.htmlID} .container {
                   
                    width: 100%;
                    align-items: center;
                    display: flex;
                    justify-content: center;
                    background-color: #fcfcfc;
                  }
                  
                  .multi_file_upload_${values._meta.htmlID} .card {
                    border-radius: 10px;
                    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
                    width: 600px;
                    background-color: #ffffff;
                    padding: 10px 30px 40px;
                  }
                  
                  .multi_file_upload_${values._meta.htmlID} .card h3 {
                    font-size: 22px;
                    font-weight: 600;
                    
                  }
          `
            },
            js: function (values) {
                return `
                function getPlaceHolderText(item) {
                  // const dropdown = document.querySelector(".place_holder_wrapper select");
                  var e = document.getElementById("placeHolder_select");
                  var value = e.options[e.selectedIndex].value;
                  // var text = e.options[e.selectedIndex].text;
                  document.getElementById('placeholderTextArea').value = document.getElementById("placeholderTextArea").value + '' + value;
              }
                `
            },
        },
    },
});